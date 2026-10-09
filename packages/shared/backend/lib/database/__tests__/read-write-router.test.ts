import { describe, it, expect, beforeEach } from "vitest"
import {
  ReadWriteRouter,
  ReplicaClusterManager,
  runWithMaster,
  runWithReplica,
  runInTransaction,
} from "../read-write-router"
import type { ReplicaNode, MasterReplicaConfig } from "../types"

describe("ReadWriteRouter & ReplicaClusterManager (高可用与读写分离)", () => {
  beforeEach(() => {
    // 重置
  })

  it("支持在 runWithMaster 和 runWithReplica 之间切换上下文", async () => {
    expect(ReadWriteRouter.getCurrentTarget()).toBe("auto")

    await runWithMaster(async () => {
      expect(ReadWriteRouter.getCurrentTarget()).toBe("master")

      // 嵌套内部允许切从库（非事务场景）
      await runWithReplica(async () => {
        expect(ReadWriteRouter.getCurrentTarget()).toBe("replica")
      })

      expect(ReadWriteRouter.getCurrentTarget()).toBe("master")
    })

    expect(ReadWriteRouter.getCurrentTarget()).toBe("auto")
  })

  it("在事务上下文中 (runInTransaction) 强制路由至主库并封锁从库读取", async () => {
    await runInTransaction(async () => {
      expect(ReadWriteRouter.isTransactionActive()).toBe(true)
      expect(ReadWriteRouter.getCurrentTarget()).toBe("master")

      // 尝试在事务内切从库，必须被守卫拦截，强制保持主库
      await runWithReplica(async () => {
        expect(ReadWriteRouter.isTransactionActive()).toBe(true)
        expect(ReadWriteRouter.getCurrentTarget()).toBe("master")
      })
    })

    expect(ReadWriteRouter.isTransactionActive()).toBe(false)
  })

  it("负载均衡算法：Round-Robin 轮询与健康节点过滤", () => {
    const replicas: ReplicaNode[] = [
      { name: "node-1", url: "mysql://host1:3306/db", isHealthy: true },
      { name: "node-2", url: "mysql://host2:3306/db", isHealthy: false }, // 宕机
      { name: "node-3", url: "mysql://host3:3306/db", isHealthy: true },
    ]

    const picked1 = ReadWriteRouter.selectReplica(replicas, "round_robin")
    const picked2 = ReadWriteRouter.selectReplica(replicas, "round_robin")
    const picked3 = ReadWriteRouter.selectReplica(replicas, "round_robin")

    // node-2 处于宕机状态，必须被过滤，仅在 node-1 和 node-3 之间循环
    expect([picked1?.name, picked2?.name, picked3?.name]).not.toContain("node-2")
    expect(["node-1", "node-3"]).toContain(picked1?.name)
    expect(["node-1", "node-3"]).toContain(picked2?.name)
  })

  it("所有从库宕机时自动降级回退主库", () => {
    const cluster = new ReplicaClusterManager()
    const config: MasterReplicaConfig = {
      master: {
        name: "master-main",
        driver: "mysql",
        url: "mysql://master:3306/db",
        tier: "A",
        protocolFamily: "mysql",
      },
      replicas: [
        { name: "slave-1", url: "mysql://slave1:3306/db", isHealthy: false },
        { name: "slave-2", url: "mysql://slave2:3306/db", isHealthy: false },
      ],
      loadBalancePolicy: "round_robin",
    }
    cluster.init(config)

    // 从库全部宕机，读操作自动降级走主库
    const resolved = cluster.resolveTargetNode(false)
    expect(resolved.isMaster).toBe(true)
    expect(resolved.nodeUrl).toBe("mysql://master:3306/db")
  })

  it("写操作强制路由至主库", () => {
    const cluster = new ReplicaClusterManager()
    const config: MasterReplicaConfig = {
      master: {
        name: "master-main",
        driver: "mysql",
        url: "mysql://master:3306/db",
        tier: "A",
        protocolFamily: "mysql",
      },
      replicas: [
        { name: "slave-1", url: "mysql://slave1:3306/db", isHealthy: true },
      ],
    }
    cluster.init(config)

    const resolved = cluster.resolveTargetNode(true) // isWriteOperation = true
    expect(resolved.isMaster).toBe(true)
    expect(resolved.nodeName).toBe("master-main")
  })
})
