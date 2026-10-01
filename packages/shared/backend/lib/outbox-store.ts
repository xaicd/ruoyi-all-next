/**
 * Outbox/inbox persistence adapter.
 * Memory store is transactional (snapshot rollback). Kysely is used only with a real database.
 */
import { hasRealDatabase } from "./database"
import { createKyselyOutboxStore } from "./outbox-kysely-store"
import type { OutboxRecord } from "./transactional-outbox"

export type OutboxDbHandle = { driver: "memory" } | unknown

export type OutboxTx = {
  db: OutboxDbHandle
  insertOutbox: (record: OutboxRecord) => Promise<void>
}

export type OutboxStore = {
  driver: "memory" | "kysely"
  runInTransaction: <T>(fn: (tx: OutboxTx) => Promise<T>) => Promise<T>
  list: (status?: OutboxRecord["status"]) => Promise<OutboxRecord[]>
  listPending: (limit: number) => Promise<OutboxRecord[]>
  save: (record: OutboxRecord) => Promise<void>
  inboxHas: (consumer: string, eventId: string) => Promise<boolean>
  inboxMark: (consumer: string, eventId: string) => Promise<void>
  /** 允许异步: 真实库 store 的 reset 需要 DELETE，同步签名会把 Promise 丢掉（TS 也不拦）。 */
  reset: () => void | Promise<void>
}

function cloneRecord(record: OutboxRecord): OutboxRecord {
  return { ...record, payload: { ...record.payload }, headers: { ...record.headers } }
}

export function createMemoryOutboxStore(): OutboxStore {
  const outbox: OutboxRecord[] = []
  const inbox = new Set<string>()
  return {
    driver: "memory",
    async runInTransaction(fn) {
      const snapOut = outbox.map(cloneRecord)
      const snapIn = new Set(inbox)
      try {
        return await fn({
          db: { driver: "memory" },
          async insertOutbox(record) {
            outbox.push(cloneRecord(record))
          },
        })
      } catch (error) {
        outbox.length = 0
        outbox.push(...snapOut)
        inbox.clear()
        for (const key of snapIn) inbox.add(key)
        throw error
      }
    },
    async list(status) {
      return outbox.filter((item) => (status ? item.status === status : true)).map(cloneRecord)
    },
    async listPending(limit) {
      return outbox.filter((item) => item.status === "pending").slice(0, limit).map(cloneRecord)
    },
    async save(record) {
      const index = outbox.findIndex((item) => item.id === record.id)
      if (index >= 0) outbox[index] = cloneRecord(record)
    },
    async inboxHas(consumer, eventId) {
      return inbox.has(`${consumer}::${eventId}`)
    },
    async inboxMark(consumer, eventId) {
      inbox.add(`${consumer}::${eventId}`)
    },
    reset() {
      outbox.length = 0
      inbox.clear()
    },
  }
}

const memoryStore = createMemoryOutboxStore()
let override: OutboxStore | undefined
let kyselyStore: OutboxStore | undefined

export function setOutboxStore(store?: OutboxStore) {
  override = store
}

export function getOutboxStore(): OutboxStore {
  if (override) return override
  if (hasRealDatabase()) {
    kyselyStore ??= createKyselyOutboxStore()
    return kyselyStore
  }
  return memoryStore
}

export function resetOutboxStore(): void | Promise<void> {
  override = undefined
  memoryStore.reset()
  // 真实库 store 的清理是异步的 —— 必须**向上返回**，否则调用方无从 await，
  // 清理可能在下一个用例开始后才跑完（TS 不报错，这正是它危险的地方）。
  return kyselyStore?.reset()
}
