type AuditRecord = {
  action: string
  operatorId: string
  targetType?: string
  targetId?: string
  detail?: Record<string, unknown>
  createdAt: string
}

const AUDIT_BUFFER: AuditRecord[] = []

/**
 * 审计日志最小实现：当前写入内存缓冲。
 * TODO: 对接数据库或日志总线。
 */
export async function writeAuditLog(record: Omit<AuditRecord, "createdAt">) {
  AUDIT_BUFFER.push({ ...record, createdAt: new Date().toISOString() })
}

export function getAuditBuffer() {
  return AUDIT_BUFFER
}
