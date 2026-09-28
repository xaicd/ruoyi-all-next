/**
 * 参考插件 worker：实现 PLUGIN_SPEC §13 的三个必选方法。
 *
 * 刻意保持最小 —— 新作者应当能照着它写出自己的第一个插件。
 * 注意 stdout 只走协议，诊断信息一律写 stderr（宿主只从 stdout 解析 JSON-RPC）。
 */
import { definePlugin, runWorker } from "@ruoyi/plugin-sdk"

const plugin = definePlugin({
  async setup(ctx) {
    ctx.logger.info(`ready (host api v${ctx.hostApiVersion})`)
  },

  async onHealth() {
    return { status: "ok", message: "hello-world plugin ready" }
  },

  async onShutdown() {
    // 只需快速收尾；宿主给 10s，超时会升级到 SIGTERM/SIGKILL
  },
})

runWorker(plugin)
