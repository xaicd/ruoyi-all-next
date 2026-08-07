/**
 * Trace Context - 分布式链路追踪
 *
 * 设计目标：
 * - 每个请求生成唯一 traceId，贯穿整个调用链
 * - 跨域调用时自动透传 traceId
 * - 日志中自动携带 traceId，方便排查问题
 *
 * 阶段演进：
 * - 阶段A：AsyncLocalStorage 存储 traceId
 * - 阶段B：加入 spanId、parentSpanId
 * - 阶段C：对接 OpenTelemetry / Jaeger
 */

import { AsyncLocalStorage } from "async_hooks"

// ============ Types ============

export type TraceInfo = {
  traceId: string
  spanId: string
  parentSpanId?: string
  serviceName: string
  operationName: string
  startTime: number
  attributes: Record<string, string | number | boolean>
}

// ============ Storage ============

const traceStorage = new AsyncLocalStorage<TraceInfo>()

// ============ Core ============

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export const traceContext = {
  /**
   * 开始一个新的 trace（通常在 route handler 入口调用）
   *
   * @example
   * export async function GET(request: Request) {
   *   return traceContext.run("system", "user.list", async () => {
   *     // 所有下游调用自动携带 traceId
   *     const users = await SystemUserService.list(input)
   *     return NextResponse.json({ success: true, data: users })
   *   })
   * }
   */
  run<T>(serviceName: string, operationName: string, fn: () => T | Promise<T>): T | Promise<T> {
    const trace: TraceInfo = {
      traceId: generateId(),
      spanId: generateId(),
      serviceName,
      operationName,
      startTime: Date.now(),
      attributes: {},
    }
    return traceStorage.run(trace, fn)
  },

  /**
   * 从请求头中恢复 trace（跨服务调用时）
   */
  fromHeaders(headers: Headers, serviceName: string, operationName: string): TraceInfo {
    return {
      traceId: headers.get("x-trace-id") || generateId(),
      spanId: generateId(),
      parentSpanId: headers.get("x-span-id") || undefined,
      serviceName,
      operationName,
      startTime: Date.now(),
      attributes: {},
    }
  },

  /** 获取当前 trace 信息 */
  current(): TraceInfo | undefined {
    return traceStorage.getStore()
  },

  /** 获取当前 traceId */
  getTraceId(): string {
    return traceStorage.getStore()?.traceId || "no-trace"
  },

  /** 设置属性（用于日志和监控） */
  setAttribute(key: string, value: string | number | boolean) {
    const trace = traceStorage.getStore()
    if (trace) trace.attributes[key] = value
  },

  /** 生成用于透传的 headers */
  toHeaders(): Record<string, string> {
    const trace = traceStorage.getStore()
    if (!trace) return {}
    return {
      "x-trace-id": trace.traceId,
      "x-span-id": trace.spanId,
      "x-service-name": trace.serviceName,
    }
  },
}
