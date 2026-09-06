/**
 * 进程内 MQ 基础原语（同步 pub/sub）。保持向下兼容不变。
 *
 * 说明：需要「本地零配置兜底 + 可切换真实 broker（Redis Pub/Sub 等）」的新路径，
 * 请改用 `@/modules/shared/backend/lib/mq` 的 getMq() 异步驱动（MQ_DRIVER=memory|redis）。
 * 本文件仅作单进程同步基元与既有测试的向下兼容层，API 契约保持不变。
 */
type MqMessage = {
  topic: string
  payload: unknown
  broker: "redis" | "kafka" | "rabbit"
}

type Listener = (message: MqMessage) => void

const LISTENERS = new Map<string, Listener[]>()

export function mqSubscribe(topic: string, listener: Listener) {
  const current = LISTENERS.get(topic) ?? []
  LISTENERS.set(topic, [...current, listener])
}

export function mqPublish(message: MqMessage) {
  const current = LISTENERS.get(message.topic) ?? []
  for (const listener of current) {
    listener(message)
  }
}

export function clearMqListeners() {
  LISTENERS.clear()
}
