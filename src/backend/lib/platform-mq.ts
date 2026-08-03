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
