/**
 * 消息队列驱动抽象 —— 对齐 cache/database 的哲学：
 * 外部消息中间件(Redis/Kafka/RabbitMQ)必须有本地零配置兜底(进程内 pub/sub)，且可 env 切换。
 *
 * 默认 memory：进程内同步分发，预览/开发零配置即用。
 * 生产 MQ_DRIVER=redis + REDIS_URL：切 Redis Pub/Sub，跨进程/实例分发，业务代码不改。
 *
 * 统一异步接口。subscribe 返回取消订阅函数。
 */

export type MqDriverName = "memory" | "redis"

export interface MqMessage {
  topic: string
  payload: unknown
}

export type MqListener = (message: MqMessage) => void | Promise<void>

/** 取消订阅 */
export type MqUnsubscribe = () => void

export interface MqDriver {
  readonly name: MqDriverName
  /** 订阅主题，返回取消订阅函数 */
  subscribe(topic: string, listener: MqListener): Promise<MqUnsubscribe>
  /** 发布消息到主题 */
  publish(message: MqMessage): Promise<void>
  /** 健康检查（memory 恒 true；redis 探活） */
  ping(): Promise<boolean>
  dispose(): Promise<void>
}
