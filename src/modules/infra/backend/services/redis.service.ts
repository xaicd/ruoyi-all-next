import { monitorRead } from "../../../../backend/lib/platform-monitor"
import { domainLog } from "../../../../backend/lib/domain-log"
import { readSettingList } from "./infra-setting-store"

type InfraRedisMetric = {
  key: string
  value: number
}

export class InfraRedisService {
  static async metrics() {
    domainLog.event("infra.redis.metrics", {})

    const persisted = await readSettingList<InfraRedisMetric>("infra.redis.metrics")
    const metrics: InfraRedisMetric[] = persisted.length
      ? persisted
      : [
          { key: "redis.connected_clients", value: monitorRead("redis.connected_clients") },
          {
            key: "redis.instantaneous_ops_per_sec",
            value: monitorRead("redis.instantaneous_ops_per_sec"),
          },
          { key: "redis.used_memory_mb", value: monitorRead("redis.used_memory_mb") },
        ]

    return {
      items: metrics,
      total: metrics.length,
      fetchedAt: new Date().toISOString(),
    }
  }
}
