/**
 * In-house JetStream-like log: at-least-once delivery with ack, without nats.io.
 */
import { matchSubject } from "./messaging-protocol"

type StreamRecord = {
  seq: number
  subject: string
  data: unknown
  headers: Record<string, string>
  acked: boolean
}

const records: StreamRecord[] = []
let seq = 0

export function resetNatsStream() {
  records.length = 0
  seq = 0
}

export function natsStreamPublish(subject: string, data: unknown, headers: Record<string, string> = {}) {
  const record: StreamRecord = { seq: ++seq, subject, data, headers, acked: false }
  records.push(record)
  return record.seq
}

export function natsStreamAck(seqNo: number) {
  const record = records.find((item) => item.seq === seqNo)
  if (!record) return false
  record.acked = true
  return true
}

export async function natsStreamConsume(
  pattern: string,
  handler: (record: StreamRecord) => Promise<void>,
  options: { redeliverUnacked?: boolean } = {},
) {
  const pending = records.filter((item) => matchSubject(item.subject, pattern) && (options.redeliverUnacked ? !item.acked : true))
  for (const record of pending) {
    await handler(record)
  }
  return pending.length
}

export function natsStreamPending(pattern = ">") {
  return records.filter((item) => !item.acked && matchSubject(item.subject, pattern)).length
}
