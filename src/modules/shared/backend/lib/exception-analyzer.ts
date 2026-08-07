/**
 * Exception Analyzer - 异常日志分析与告警
 *
 * 能力：
 * - 异常分类与聚合（相同堆栈合并）
 * - 异常频率监控（突增告警）
 * - 异常关联分析（关联 traceId、userId、API）
 * - 异常通知（webhook / 邮件 / 企微）
 *
 * 阶段演进：
 * - 阶段A：内存收集 + 简单聚合
 * - 阶段B：持久化 + Elasticsearch
 * - 阶段C：独立日志分析服务 + 智能告警
 */

// ============ Types ============

export type ExceptionRecord = {
  id: string
  type: string
  message: string
  stack?: string
  domain: string
  api?: string
  userId?: string
  traceId?: string
  metadata?: Record<string, unknown>
  timestamp: string
}

export type ExceptionGroup = {
  fingerprint: string
  message: string
  count: number
  firstSeen: string
  lastSeen: string
  samples: ExceptionRecord[]
}

export type AlertRule = {
  id: string
  condition: "COUNT_THRESHOLD" | "RATE_SPIKE" | "NEW_TYPE"
  threshold: number
  window: number // seconds
  notify: "log" | "webhook" | "email"
}

// ============ State ============

const records: ExceptionRecord[] = []
const groups = new Map<string, ExceptionGroup>()
const MAX_RECORDS = 2000
const alertRules: AlertRule[] = [
  { id: "high-frequency", condition: "COUNT_THRESHOLD", threshold: 50, window: 60, notify: "log" },
  { id: "rate-spike", condition: "RATE_SPIKE", threshold: 3, window: 300, notify: "log" },
]

// ============ Core ============

function generateFingerprint(type: string, message: string, stack?: string): string {
  const key = `${type}:${message.slice(0, 100)}:${(stack || "").split("\n")[1] || ""}`
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0
  }
  return `fp-${Math.abs(hash).toString(36)}`
}

export const exceptionAnalyzer = {
  /**
   * 记录异常
   */
  record(error: Error | string, context?: { domain?: string; api?: string; userId?: string; traceId?: string; metadata?: Record<string, unknown> }) {
    const err = typeof error === "string" ? new Error(error) : error
    const record: ExceptionRecord = {
      id: `exc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: err.constructor.name,
      message: err.message,
      stack: err.stack,
      domain: context?.domain || "unknown",
      api: context?.api,
      userId: context?.userId,
      traceId: context?.traceId,
      metadata: context?.metadata,
      timestamp: new Date().toISOString(),
    }

    records.push(record)
    if (records.length > MAX_RECORDS) records.shift()

    // 聚合到 group
    const fp = generateFingerprint(record.type, record.message, record.stack)
    const existing = groups.get(fp)
    if (existing) {
      existing.count++
      existing.lastSeen = record.timestamp
      if (existing.samples.length < 5) existing.samples.push(record)
    } else {
      groups.set(fp, {
        fingerprint: fp,
        message: record.message,
        count: 1,
        firstSeen: record.timestamp,
        lastSeen: record.timestamp,
        samples: [record],
      })
    }

    // 检查告警规则
    checkAlerts(record)

    return record.id
  },

  /** 获取异常组（按频率排序） */
  getGroups(limit = 20): ExceptionGroup[] {
    return [...groups.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  },

  /** 获取最近异常记录 */
  getRecent(limit = 50): ExceptionRecord[] {
    return records.slice(-limit)
  },

  /** 按域统计 */
  statsByDomain(): Record<string, number> {
    const stats: Record<string, number> = {}
    for (const r of records) {
      stats[r.domain] = (stats[r.domain] || 0) + 1
    }
    return stats
  },

  /** 按 API 统计（TOP N） */
  topApis(limit = 10): { api: string; count: number }[] {
    const counts: Record<string, number> = {}
    for (const r of records) {
      if (r.api) counts[r.api] = (counts[r.api] || 0) + 1
    }
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([api, count]) => ({ api, count }))
  },

  /** 清空（测试用） */
  clear() {
    records.length = 0
    groups.clear()
  },
}

function checkAlerts(record: ExceptionRecord) {
  for (const rule of alertRules) {
    if (rule.condition === "COUNT_THRESHOLD") {
      const windowStart = Date.now() - rule.window * 1000
      const recentCount = records.filter((r) => new Date(r.timestamp).getTime() > windowStart).length
      if (recentCount >= rule.threshold) {
        // TODO: 阶段B 发送真实告警
        console.warn(`[ALERT] ${rule.id}: ${recentCount} exceptions in ${rule.window}s`)
      }
    }
  }
}
