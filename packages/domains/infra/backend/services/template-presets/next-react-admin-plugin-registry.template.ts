export const nextReactAdminPluginRegistryTemplate = `export type AdminPlugin = {
  code: string
  enabled: boolean
  description?: string
}

export const ADMIN_PLUGINS: AdminPlugin[] = [
  { code: "chart", enabled: true, description: "图表可视化能力" },
  { code: "export", enabled: true, description: "数据导出能力" },
  { code: "audit", enabled: true, description: "操作审计扩展" },
]

export function isAdminPluginEnabled(code: string): boolean {
  return ADMIN_PLUGINS.some((plugin) => plugin.code === code && plugin.enabled)
}
`