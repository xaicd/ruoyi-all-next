/**
 * L1 单元测试网络闸门。
 *
 * 单元测试必须是自洽的：真实网络请求会让用例变成不可复现的集成测试，
 * 还会把外部服务的抖动与配额问题伪装成"代码缺陷"。
 *
 * 与仓库既有底座的分工：
 * - L1 单元：本文件负责断网（保证 hermetic）
 * - L2 集成：`src/modules/infra/testing/TestingKit` 的 createTestDatabase()
 *           提供真实嵌入式 SQLite + 种子数据（真实数据库，不是伪造 mock）
 * - L3 契约：见 src/modules/shared/backend/lib/__tests__/rpc-protocol.test.ts
 * - L4 E2E：playwright.config.ts + test/e2e、test/agent
 *
 * 用法：
 *   import { assertNoNetwork, restoreNetwork } from "./framework/network-guard"
 *   beforeEach(() => assertNoNetwork())
 *   afterEach(() => restoreNetwork())
 */

let originalFetch: typeof globalThis.fetch | undefined

/** 断网：任何 fetch 调用都会抛出，指出是哪条用例违规。 */
export function assertNoNetwork(): void {
  originalFetch = globalThis.fetch
  globalThis.fetch = (() => {
    throw new Error("单元测试禁止真实网络请求：请改为注入 mock，或把该用例移到 L2 集成层。")
  }) as typeof globalThis.fetch
}

/** 还原被 interrupt 的 fetch；未断网时保持原样。 */
export function restoreNetwork(): void {
  if (originalFetch) {
    globalThis.fetch = originalFetch
    originalFetch = undefined
  }
}
