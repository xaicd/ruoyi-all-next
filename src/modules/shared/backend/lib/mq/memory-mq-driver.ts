/**
 * 内存消息驱动 —— 默认零配置。进程内 pub/sub，订阅者按主题精确匹配同步分发。
 * 适用预览/开发/单进程；跨进程需切 redis 驱动。
 */
import type { MqDriver, MqListener, MqMessage, MqUnsubscribe } from "./mq-driver"

export class MemoryMqDriver implements MqDriver {
  readonly name = "memory" as const
  private readonly listeners = new Map<string, Set<MqListener>>()

  async subscribe(topic: string, listener: MqListener): Promise<MqUnsubscribe> {
    const set = this.listeners.get(topic) ?? new Set<MqListener>()
    set.add(listener)
    this.listeners.set(topic, set)
    return () => {
      const cur = this.listeners.get(topic)
      if (!cur) return
      cur.delete(listener)
      if (cur.size === 0) this.listeners.delete(topic)
    }
  }

  async publish(message: MqMessage): Promise<void> {
    const set = this.listeners.get(message.topic)
    if (!set) return
    for (const listener of Array.from(set)) {
      await listener(message)
    }
  }

  async ping(): Promise<boolean> {
    return true
  }

  async dispose(): Promise<void> {
    this.listeners.clear()
  }
}
