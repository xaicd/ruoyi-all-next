/**
 * Host ↔ Worker 协议帧（与宿主 src/modules/shared/backend/plugins/worker-protocol.ts 对齐）。
 *
 * 为什么这里有一份独立实现而不是共享类型：SDK 是**独立包**，不能 import 宿主源码；
 * 而让宿主去依赖一个未构建的 workspace 包会把 Next 构建拖进 workspace 编译链。
 * 两份实现的一致性是靠**契约测试**保证的 —— 宿主侧的测试会跑真实的示例插件做往返，
 * 帧格式一旦分叉，测试立刻红。
 *
 * 纯 JS + 同名 .d.ts：不给插件作者加构建步骤，同时保留类型提示。
 *
 * 传输：stdio 上的逐行 JSON-RPC（PLUGIN_SPEC §12.1）。一行一个 JSON 对象，`\n` 分隔。
 */

export function encode(message) {
  return `${JSON.stringify(message)}\n`
}

/** 从缓冲切出完整行消息；半行留在缓冲里等下一次数据。 */
export function decode(buffer) {
  const messages = []
  let rest = buffer
  let index = rest.indexOf("\n")
  while (index >= 0) {
    const line = rest.slice(0, index).trim()
    rest = rest.slice(index + 1)
    if (line) {
      try {
        const parsed = JSON.parse(line)
        if (parsed && typeof parsed.id === "number" && typeof parsed.method === "string") messages.push(parsed)
      } catch {
        // 非 JSON 行忽略：stdout 只应走协议，诊断信息请写 stderr
      }
    }
    index = rest.indexOf("\n")
  }
  return { messages, rest }
}

/** PLUGIN_SPEC §13 的三个必选方法。 */
export const REQUIRED_METHODS = Object.freeze(["initialize", "health", "shutdown"])

/** JSON-RPC 标准错误码。 */
export const RPC_ERROR = Object.freeze({
  methodNotFound: -32601,
  internalError: -32603,
})
