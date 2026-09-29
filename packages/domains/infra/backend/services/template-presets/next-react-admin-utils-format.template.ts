export const nextReactAdminUtilsFormatTemplate = `export function format{{entityName}}Status(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "启用"
    case "DISABLED":
      return "禁用"
    case "PENDING":
      return "待处理"
    default:
      return "未知"
  }
}

export function format{{entityName}}Time(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return "-"

  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  const hh = String(date.getHours()).padStart(2, "0")
  const mm = String(date.getMinutes()).padStart(2, "0")

  return y + "-" + m + "-" + d + " " + hh + ":" + mm
}
`