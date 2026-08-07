type DomainEventRecord = {
  name: string
  payload?: Record<string, unknown>
  createdAt: string
}

type DomainAuditRecord = {
  action: string
  payload?: Record<string, unknown>
  createdAt: string
}

const EVENT_BUFFER: DomainEventRecord[] = []
const AUDIT_BUFFER: DomainAuditRecord[] = []

/**
 * ruoyi-all-next 最小日志门面。
 * 通过 event/audit 语义保持与后续日志中心对接的一致接口。
 */
export const domainLog = {
  event(name: string, payload?: Record<string, unknown>) {
    EVENT_BUFFER.push({ name, payload, createdAt: new Date().toISOString() })
  },
  audit(action: string, payload?: Record<string, unknown>) {
    AUDIT_BUFFER.push({ action, payload, createdAt: new Date().toISOString() })
  },
}

export function getDomainEventBuffer() {
  return EVENT_BUFFER
}

export function getDomainAuditBuffer() {
  return AUDIT_BUFFER
}

export function clearDomainLogBuffer() {
  EVENT_BUFFER.length = 0
  AUDIT_BUFFER.length = 0
}
