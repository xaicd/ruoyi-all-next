/**
 * In-house NATS-like fabric. No nats.io server or client.
 * Implements subject routing, wildcards, queue groups, headers, and native request-reply inboxes.
 */
import { matchSubject } from "./messaging-protocol"

export type NatsMessage = {
  subject: string
  reply?: string
  headers: Record<string, string>
  data: unknown
}

type NatsHandler = (message: NatsMessage) => Promise<unknown>
type Subscription = { id: string; pattern: string; queue?: string; handler: NatsHandler }

const subscriptions: Subscription[] = []
const queueCursor = new Map<string, number>()
let seq = 0

export function resetNatsFabric() {
  subscriptions.length = 0
  queueCursor.clear()
  seq = 0
}

export function natsSubscribe(pattern: string, handler: NatsHandler, options: { queue?: string } = {}) {
  const id = `sub-${++seq}`
  subscriptions.push({ id, pattern, queue: options.queue, handler })
  return id
}

export function natsUnsubscribe(id: string) {
  const index = subscriptions.findIndex((item) => item.id === id)
  if (index >= 0) subscriptions.splice(index, 1)
}

function recipients(subject: string): Subscription[] {
  const matched = subscriptions.filter((item) => matchSubject(subject, item.pattern))
  const independent = matched.filter((item) => !item.queue)
  const grouped = new Map<string, Subscription[]>()
  for (const item of matched) {
    if (!item.queue) continue
    const list = grouped.get(item.queue) ?? []
    list.push(item)
    grouped.set(item.queue, list)
  }
  const selected = [...independent]
  for (const [queue, list] of grouped) {
    const cursor = queueCursor.get(queue) ?? 0
    selected.push(list[cursor % list.length])
    queueCursor.set(queue, cursor + 1)
  }
  return selected
}

export async function natsPublish(subject: string, data: unknown, headers: Record<string, string> = {}, reply?: string) {
  const message: NatsMessage = { subject, reply, headers, data }
  const targets = recipients(subject)
  await Promise.all(targets.map(async (item) => {
    try {
      const result = await item.handler(message)
      if (reply && result !== undefined) await deliverReply(reply, result, {})
    } catch (error: any) {
      if (reply) await deliverReply(reply, undefined, { "x-error": error.message ?? "nats handler failed" })
    }
  }))
  return targets.length
}

async function deliverReply(subject: string, data: unknown, headers: Record<string, string>) {
  const targets = recipients(subject)
  await Promise.all(targets.map((item) => item.handler({ subject, headers, data })))
}

export function natsRequest<T = unknown>(
  subject: string,
  data: unknown,
  options: { headers?: Record<string, string>; timeoutMs?: number } = {},
): Promise<T> {
  const timeoutMs = options.timeoutMs ?? 5000
  const inbox = `_INBOX.${++seq}`
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      natsUnsubscribe(inboxSub)
      reject(new Error(`Timeout after ${timeoutMs}ms`))
    }, timeoutMs)
    const inboxSub = natsSubscribe(inbox, async (message) => {
      clearTimeout(timer)
      natsUnsubscribe(inboxSub)
      if (message.headers["x-error"]) {
        reject(new Error(message.headers["x-error"]))
        return
      }
      resolve(message.data as T)
    })
    const targets = recipients(subject)
    if (targets.length === 0) {
      clearTimeout(timer)
      natsUnsubscribe(inboxSub)
      reject(new Error(`NoResponders for ${subject}`))
      return
    }
    void natsPublish(subject, data, options.headers ?? {}, inbox).catch((error) => {
      clearTimeout(timer)
      natsUnsubscribe(inboxSub)
      reject(error)
    })
  })
}

export function natsStatus() {
  return {
    connected: true,
    subscriberCount: subscriptions.length,
    driver: "in-house",
  }
}
