export const nextReactAdminAppConfigTemplate = `export const adminAppConfig = {
  appName: "乡村振兴综合服务平台",
  appShortName: "QLO",
  defaultLocale: "zh-CN",
  dateFormat: "YYYY-MM-DD HH:mm:ss",
  pageSizeOptions: [10, 20, 50],
  featureFlags: {
    enableReportCenter: true,
    enableRealtimeBoard: true,
  },
} as const
`