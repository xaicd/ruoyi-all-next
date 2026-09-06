/**
 * Redis Pub/Sub 消息驱动 —— 生产/跨进程分发。懒加载 ioredis（不装则不引入依赖）。
 * 仅当 MQ_DRIVER=redis 时被选用；payload 以 JSON 序列化传输。
 * ioredis 订阅连接与发布连接分离（订阅态连接不能再发命令）。
 */
import type { MqDriver, MqListener, MqMessage, MqUnsubscribe } from "./mq-driver"

export class RedisMqDriver implements MqDriver {
  readonly name = "redis" as const
  private pub: any = null
  private sub: any = null
  private ready: Promise<void> | null = null
  private readonly listeners = new Map<string, Set<MqListener>>()

  constructor(private readonly url: string) {}

  private async conn(): Promise<void> {
    if (this.pub && this.sub) return
    if (!this.ready) {
      this.ready = (async () => {
        let IORedis: any
        try {
          // ioredis 为可选依赖：仅 MQ_DRIVER=redis 时才需安装；未装时不影响 memory 默认路径。
          // @ts-ignore optional peer dependency, resolved at runtime only
          IORedis = (await import("ioredis")).default
        } catch {
          throw new Error("MQ_DRIVER=redis 需要安装依赖 ioredis（npm i ioredis）")
        }
        this.pub = new IORedis(this.url, { lazyConnect: false, maxRetriesPerRequest: 2 })
        this.sub = new IORedis(this.url, { lazyConnect: false, maxRetriesPerRequest: 2 })
        this.sub.on("message", (topic: string, raw: string) => {
          const set = this.listeners.get(topic)
          if (!set) return
          let payload: unknown = raw
          try {
            payload = JSON.parse(raw)
          } catch {
            /* 非 JSON 原样传递 */
          }
          for (const listener of Array.from(set)) {
            void listener({ topic, payload })
          }
        })
      })()
    }
    return this.ready
  }

  async subscribe(topic: string, listener: MqListener): Promise<MqUnsubscribe> {
    await this.conn()
    const set = this.listeners.get(topic) ?? new Set<MqListener>()
    const firstForTopic = set.size === 0
    set.add(listener)
    this.listeners.set(topic, set)
    if (firstForTopic) await this.sub.subscribe(topic)
    return () => {
      const cur = this.listeners.get(topic)
      if (!cur) return
      cur.delete(listener)
      if (cur.size === 0) {
        this.listeners.delete(topic)
        void this.sub?.unsubscribe(topic)
      }
    }
  }

  async publish(message: MqMessage): Promise<void> {
    await this.conn()
    await this.pub.publish(message.topic, JSON.stringify(message.payload))
  }

  async ping(): Promise<boolean> {
    try {
      await this.conn()
      return (await this.pub.ping()) === "PONG"
    } catch {
      return false
    }
  }

  async dispose(): Promise<void> {
    for (const c of [this.pub, this.sub]) {
      if (c) {
        try {
          await c.quit()
        } catch {
          /* ignore */
        }
      }
    }
    this.pub = null
    this.sub = null
    this.ready = null
    this.listeners.clear()
  }
}
