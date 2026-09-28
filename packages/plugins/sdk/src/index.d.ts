export type PluginContext = {
  pluginKey: string
  hostApiVersion?: number
  instance?: { pluginKey: string; packagePath: string }
  config: Record<string, unknown>
  logger: { info: (message: string) => void; error: (message: string) => void }
}

export type PluginHandlers = {
  /** worker 启动时调用一次（宿主 initialize 请求内）。 */
  setup?: (ctx: PluginContext) => void | Promise<void>
  /** 响应宿主 health 请求。未实现时默认返回 { status: "ok" }。 */
  onHealth?: () => { status: "ok" | "degraded" | "error"; message?: string; diagnostics?: unknown } | Promise<{
    status: "ok" | "degraded" | "error"
    message?: string
    diagnostics?: unknown
  }>
  /** 响应宿主 shutdown 请求；返回后会自行 process.exit(0)。 */
  onShutdown?: () => void | Promise<void>
}

export declare function definePlugin<T extends PluginHandlers>(handlers: T): T
export declare function runWorker(
  plugin: PluginHandlers,
  options?: { input?: NodeJS.ReadStream; output?: NodeJS.WriteStream },
): void
