/**
 * 仓内**第一方插件**的入口静态表。
 *
 * 为什么必须有这张表（不能靠运行期 import）:
 *   - 仓内第一方插件是 **TS**，而宿主的合并运行时用的是运行期 `import(specifier)`，
 *     Node 不认识 TS；
 *   - 把路径拼成模板串再 import，Turbopack/Vite 也无法静态追踪（本仓在 broker 上踩过一次）。
 * 因此第一方插件必须**显式登记** —— 与 `domain-service-loaders.ts` 同一模式。
 *
 * 第三方插件（实例目录里装进来的）走运行期 import，因为它们产出的是编译后的 JS。
 * 两种来源用同一套 manifest/能力语义，只有"怎么把代码拿进来"这一步不同。
 *
 * 新增第一方插件时: 在下面加一行。
 */

type PluginEntryFactory = () => Promise<Record<string, unknown>>

export const FIRST_PARTY_PLUGIN_ENTRIES: Record<string, PluginEntryFactory> = {
  "ruoyi.pay": () => import("@/modules/pay/plugin-entry"),
  "ruoyi.report": () => import("@/modules/report/plugin-entry"),
  "ruoyi.bpm": () => import("@/modules/bpm/plugin-entry"),
  "ruoyi.mp": () => import("@/modules/mp/plugin-entry"),
  "ruoyi.member": () => import("@/modules/member/plugin-entry"),
  "ruoyi.iot": () => import("@/modules/iot/plugin-entry"),
  "ruoyi.erp": () => import("@/modules/erp/plugin-entry"),
  "ruoyi.im": () => import("@/modules/im/plugin-entry"),
  "ruoyi.aigw": () => import("@/modules/aigw/plugin-entry"),
  "ruoyi.ai": () => import("@/modules/ai/plugin-entry"),
  "ruoyi.crm": () => import("@/modules/crm/plugin-entry"),
  "ruoyi.wms": () => import("@/modules/wms/plugin-entry"),
  "ruoyi.online": () => import("@/modules/online/plugin-entry"),
  "ruoyi.mall": () => import("@/modules/mall/plugin-entry"),
  "ruoyi.mes": () => import("@/modules/mes/plugin-entry"),
}

/** 取第一方插件入口工厂；不是第一方插件时返回 undefined（调用方回退到运行期 import）。 */
export function firstPartyPluginEntry(pluginKey: string): PluginEntryFactory | undefined {
  return FIRST_PARTY_PLUGIN_ENTRIES[pluginKey]
}
