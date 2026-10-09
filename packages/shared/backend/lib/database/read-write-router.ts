/**
 * 读写分离与高可用集群路由引擎
 *
 * 核心机制：
 * 1. 上下文感知（AsyncLocalStorage）：支持 runWithMaster / runWithReplica / runInTransaction
 * 2. 事务安全（Read-Your-Writes）：事务内无论读写强制路由至主库（Master），规避主从延迟
 * 3. 负载均衡算法：Round-Robin (轮询)、Weighted (加权)、Random (随机)
 * 4. 故障自愈与自动降级：当从库不可用或宕机时，自动剔除并降级回切主库
 */

import { AsyncLocalStorage } from "node:async_hooks"
import type {
  DataSourceContext,
  ReplicaNode,
  ReplicaLoadBalancePolicy,
  MasterReplicaConfig,
} from "./types"

const contextStorage = new AsyncLocalStorage<DataSourceContext>()

export class ReadWriteRouter {
  private static rrIndex = 0

  /** 在主库上下文中执行操作 */
  static async runWithMaster<T>(fn: () => Promise<T>): Promise<T> {
    const parent = contextStorage.getStore() || {}
    return contextStorage.run({ ...parent, routingTarget: "master" }, fn)
  }

  /** 在从库只读上下文中执行操作（若无可用从库将自动降级至主库） */
  static async runWithReplica<T>(fn: () => Promise<T>): Promise<T> {
    const parent = contextStorage.getStore() || {}
    // 事务内严禁切从库，强制走主库
    if (parent.inTransaction) {
      return fn()
    }
    return contextStorage.run({ ...parent, routingTarget: "replica" }, fn)
  }

  /** 在事务上下文中执行操作（自动强制锁定主库） */
  static async runInTransaction<T>(fn: () => Promise<T>): Promise<T> {
    const parent = contextStorage.getStore() || {}
    return contextStorage.run({ ...parent, inTransaction: true, routingTarget: "master" }, fn)
  }

  /** 获取当前路由上下文 */
  static getContext(): DataSourceContext | undefined {
    return contextStorage.getStore()
  }

  /** 获取当前路由目标 */
  static getCurrentTarget(): "master" | "replica" | "auto" {
    const ctx = contextStorage.getStore()
    if (ctx?.inTransaction) return "master"
    return ctx?.routingTarget ?? "auto"
  }

  /** 判断当前是否处于事务保护区 */
  static isTransactionActive(): boolean {
    return contextStorage.getStore()?.inTransaction === true
  }

  /** 根据策略从健康从库集群中选举节点 */
  static selectReplica(
    replicas: ReplicaNode[],
    policy: ReplicaLoadBalancePolicy = "round_robin"
  ): ReplicaNode | null {
    const healthyNodes = replicas.filter((r) => r.isHealthy !== false)
    if (healthyNodes.length === 0) return null

    if (policy === "random") {
      const idx = Math.floor(Math.random() * healthyNodes.length)
      return healthyNodes[idx]
    }

    if (policy === "weighted") {
      const totalWeight = healthyNodes.reduce((sum, n) => sum + (n.weight ?? 1), 0)
      let randomVal = Math.random() * totalWeight
      for (const node of healthyNodes) {
        randomVal -= (node.weight ?? 1)
        if (randomVal <= 0) return node
      }
      return healthyNodes[0]
    }

    // Default: round_robin
    const selected = healthyNodes[this.rrIndex % healthyNodes.length]
    this.rrIndex = (this.rrIndex + 1) % 1_000_000
    return selected
  }
}

export class ReplicaClusterManager {
  private config: MasterReplicaConfig | null = null

  init(config: MasterReplicaConfig) {
    this.config = {
      ...config,
      loadBalancePolicy: config.loadBalancePolicy ?? "round_robin",
    }
  }

  getConfig(): MasterReplicaConfig | null {
    return this.config
  }

  registerReplica(node: ReplicaNode): void {
    if (!this.config) {
      throw new Error("MasterReplicaConfig 尚未初始化，请先调用 init()")
    }
    const exists = this.config.replicas.findIndex((r) => r.name === node.name)
    if (exists >= 0) {
      this.config.replicas[exists] = node
    } else {
      this.config.replicas.push(node)
    }
  }

  updateHealth(nodeName: string, isHealthy: boolean, latencyMs?: number): void {
    if (!this.config) return
    const target = this.config.replicas.find((r) => r.name === nodeName)
    if (target) {
      target.isHealthy = isHealthy
      if (latencyMs !== undefined) target.latencyMs = latencyMs
      target.lastCheckedAt = Date.now()
    }
  }

  getHealthyReplicas(): ReplicaNode[] {
    if (!this.config) return []
    return this.config.replicas.filter((r) => r.isHealthy !== false)
  }

  /** 获取执行目标节点（写走主、读走从，事务走主，无可用从库降级走主） */
  resolveTargetNode(isWriteOperation = false): { isMaster: boolean; nodeUrl: string; nodeName: string } {
    if (!this.config) {
      throw new Error("未配置集群高可用与读写分离")
    }

    const currentTarget = ReadWriteRouter.getCurrentTarget()
    const mustUseMaster = isWriteOperation || currentTarget === "master" || ReadWriteRouter.isTransactionActive()

    if (mustUseMaster) {
      return { isMaster: true, nodeUrl: this.config.master.url, nodeName: this.config.master.name }
    }

    const selectedReplica = ReadWriteRouter.selectReplica(this.config.replicas, this.config.loadBalancePolicy)
    if (!selectedReplica) {
      // 降级回退主库
      return { isMaster: true, nodeUrl: this.config.master.url, nodeName: `${this.config.master.name} (fallback)` }
    }

    return { isMaster: false, nodeUrl: selectedReplica.url, nodeName: selectedReplica.name }
  }

  reset(): void {
    this.config = null
  }
}

// 导出单例与类（遵循 PascalCase + camelCase 规范）
export const replicaClusterManager = new ReplicaClusterManager()
export const readWriteRouter = ReadWriteRouter

export const runWithMaster = ReadWriteRouter.runWithMaster.bind(ReadWriteRouter)
export const runWithReplica = ReadWriteRouter.runWithReplica.bind(ReadWriteRouter)
export const runInTransaction = ReadWriteRouter.runInTransaction.bind(ReadWriteRouter)
