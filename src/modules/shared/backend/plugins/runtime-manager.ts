/**
 * 插件运行时统一入口。
 *
 * 上层（注册表服务）只依赖本文件，不关心插件是以哪种形态跑的：
 *   - `merged`   -> MergedPlugin，in-process 直接函数调用
 *   - `isolated` -> PluginWorker，独立进程 + stdio JSON-RPC（现有实现，仍由 pluginWorkerManager 持有）
 *
 * 两种形态对外暴露同一组 `start / health / stop`，因此生命周期状态机与 capability 判定
 * 可以完全共用 —— 这正是"一个插件、两种运行形态"的关键。
 */
import { MergedPlugin } from "./merged-runtime"
import type { PluginRuntimeMode } from "./types"
import { pluginWorkerManager } from "./worker-manager"
import type { WorkerHealthResult, WorkerInitializeInput } from "./worker-protocol"

export type PluginRuntime = {
  readonly running: boolean
  start(input: WorkerInitializeInput): Promise<void>
  health(): Promise<WorkerHealthResult>
  stop(): Promise<void>
}

export class PluginRuntimeManager {
  /** 只保存 merged 形态；isolated 由 pluginWorkerManager 持有（避免两处真源）。 */
  private merged = new Map<string, MergedPlugin>()

  async start(
    pluginKey: string,
    mode: PluginRuntimeMode,
    entryPath: string,
    packagePath: string,
    input: WorkerInitializeInput,
  ): Promise<PluginRuntime> {
    // 幂等：同一插件重复 start（例如改了 mode）先停掉旧的，避免两份实例同时活着。
    await this.stop(pluginKey)

    if (mode === "merged") {
      const instance = new MergedPlugin(pluginKey, entryPath, packagePath)
      await instance.start({ ...input, mode: "merged" })
      this.merged.set(pluginKey, instance)
      return instance
    }

    return pluginWorkerManager.start(pluginKey, entryPath, packagePath, { ...input, mode: "isolated" })
  }

  get(pluginKey: string): PluginRuntime | undefined {
    return this.merged.get(pluginKey) ?? pluginWorkerManager.get(pluginKey)
  }

  /**
   * 调用插件自带的路由处理器。
   * 目前只有 merged 形态支持（isolated 需要 worker 协议新增路由转发方法，尚未实现）；
   * 调用方（route-mount）会先按形态判定并给出明确错误，不静默降级。
   */
  async invokeRoute(pluginKey: string, routeKey: string, input: Parameters<import("./merged-runtime").MergedPlugin["invokeRoute"]>[1]) {
    const instance = this.merged.get(pluginKey)
    if (!instance) throw new Error(`插件 ${pluginKey} 不是 merged 形态或未运行，无法调用其路由`)
    return instance.invokeRoute(routeKey, input)
  }

  modeOf(pluginKey: string): PluginRuntimeMode | undefined {
    if (this.merged.has(pluginKey)) return "merged"
    return pluginWorkerManager.get(pluginKey) ? "isolated" : undefined
  }

  list(): string[] {
    return [...new Set([...this.merged.keys(), ...pluginWorkerManager.list()])]
  }

  async stop(pluginKey: string): Promise<void> {
    const instance = this.merged.get(pluginKey)
    if (instance) {
      await instance.stop()
      this.merged.delete(pluginKey)
    }
    if (pluginWorkerManager.get(pluginKey)) {
      await pluginWorkerManager.stop(pluginKey)
    }
  }

  async stopAll(): Promise<void> {
    for (const key of [...this.merged.keys()]) {
      await this.stop(key)
    }
    await pluginWorkerManager.stopAll()
  }
}

export const pluginRuntimeManager = new PluginRuntimeManager()
