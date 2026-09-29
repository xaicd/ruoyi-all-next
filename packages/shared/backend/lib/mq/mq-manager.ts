/**
 * 消息队列管理器 —— 按 env 选驱动，对齐 cache 的 cache-manager 哲学：
 *   MQ_DRIVER = memory(默认，进程内零配置) | redis(Pub/Sub 跨进程)
 *   redis 时读 MQ_REDIS_URL / REDIS_URL（缺省 redis://127.0.0.1:6379）
 * 未配置时一律 memory：预览/开发零外部依赖即用；生产切 redis 业务代码不改。
 */
import type { MqDriver, MqDriverName } from "./mq-driver"
import { MemoryMqDriver } from "./memory-mq-driver"
import { RedisMqDriver } from "./redis-mq-driver"

let _instance: MqDriver | null = null

export function getMqDriverName(): MqDriverName {
  const raw = (process.env.MQ_DRIVER || "").toLowerCase()
  return raw === "redis" ? "redis" : "memory"
}

/** 获取当前消息驱动（单例）。默认 memory（进程内零配置）。 */
export function getMq(): MqDriver {
  if (_instance) return _instance
  const name = getMqDriverName()
  if (name === "redis") {
    const url = process.env.MQ_REDIS_URL || process.env.REDIS_URL || "redis://127.0.0.1:6379"
    _instance = new RedisMqDriver(url)
  } else {
    _instance = new MemoryMqDriver()
  }
  return _instance
}

/** 测试/切换用：重置单例（下次 getMq 按当前 env 重建） */
export async function resetMq(): Promise<void> {
  if (_instance) await _instance.dispose().catch(() => {})
  _instance = null
}
