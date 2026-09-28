/**
 * Host ↔ Plugin Worker 协议（Paperclip PLUGIN_SPEC §13 的 required 子集）。
 *
 * 传输：host 与 worker 之间走 **stdio 上的逐行 JSON-RPC**（§12.1）。
 * 一行一个 JSON 对象，`\n` 分隔 —— 不用 Content-Length 头，因为 stdio 是可读流，
 * 行分隔对日志混排与截断都更健壮。
 *
 * §13 规定三个**必选**方法；其余（onEvent/runJob/handleWebhook/getData/performAction/
 * executeTool、jobs/webhooks/tools 声明面）属后续增量，本文件不提前声明未实现的能力。
 */

/** §13 required。worker 未实现其中任何一个即视为不合格 worker。 */
export const REQUIRED_WORKER_METHODS = ["initialize", "health", "shutdown"] as const

export type RequiredWorkerMethod = (typeof REQUIRED_WORKER_METHODS)[number]

/** 进程行为参数。权威数值取自 §12.5 与健康检查需要。 */
export const WORKER_LIMITS = {
  /** host → worker 单次请求的等待上限。避免一个不响应的 worker 挂住宿主。 */
  requestTimeoutMs: 15_000,
  /** §12.5 步骤 2：收到 shutdown() 后给 worker 的自行退出时间。 */
  gracefulShutdownMs: 10_000,
  /** §12.5 步骤 4：SIGTERM 之后到 SIGKILL 的等待。 */
  sigtermGraceMs: 5_000,
  /** 启动后等待 initialize 成功的时间。 */
  initializeTimeoutMs: 20_000,
  /** 保留的 stderr 尾部字符数（用于诊断，避免无界增长）。 */
  stderrTailChars: 4_000,
} as const

export type JsonRpcRequest = {
  jsonrpc: "2.0"
  id: number
  method: string
  params?: unknown
}

export type JsonRpcSuccess = { jsonrpc: "2.0"; id: number; result?: unknown }
export type JsonRpcFailure = { jsonrpc: "2.0"; id: number; error: { code: number; message: string } }
export type JsonRpcMessage = JsonRpcSuccess | JsonRpcFailure

/** worker 启动时收到的上下文（§13.1：manifest / 已解析配置 / 实例信息 / 宿主 API 版本）。 */
export type WorkerInitializeInput = {
  manifest: unknown
  config: Record<string, unknown>
  hostApiVersion: number
  instance: { pluginKey: string; packagePath: string }
}

/** §13.2 health() 的返回形状。 */
export type WorkerHealthResult = {
  status: "ok" | "degraded" | "error"
  message?: string
  diagnostics?: unknown
}

export function encodeMessage(message: JsonRpcRequest | JsonRpcMessage): string {
  // JSON.stringify 不会产出裸换行，故逐行编码是安全的
  return `${JSON.stringify(message)}\n`
}

/**
 * 从缓冲文本中切出完整的行消息，返回解析结果与剩余缓冲。
 * 半行（还没收到 `\n`）留在缓冲里等下一次数据 —— 这是 stdio 分片必然要处理的。
 */
export function decodeMessages(buffer: string): { messages: JsonRpcMessage[]; rest: string } {
  const messages: JsonRpcMessage[] = []
  let rest = buffer
  let index = rest.indexOf("\n")
  while (index >= 0) {
    const line = rest.slice(0, index).trim()
    rest = rest.slice(index + 1)
    if (line) {
      try {
        const parsed = JSON.parse(line) as JsonRpcMessage
        if (parsed && typeof parsed.id === "number") messages.push(parsed)
      } catch {
        // 非 JSON 行：worker 可能往 stdout 写了日志。忽略即可 ——
        // 宿主不应因插件乱写 stdout 而崩，诊断信息由 stderr 承担。
      }
    }
    index = rest.indexOf("\n")
  }
  return { messages, rest }
}
