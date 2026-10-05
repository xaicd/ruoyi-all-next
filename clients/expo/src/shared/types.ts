/**
 * 端无关的类型契约（Web 与 Expo 共用同一套后端返回结构）。
 *
 * 从原 `shared/api.ts` 抽出 —— 那里同时放了类型与请求实现，
 * 现在拆开: 类型在 types.ts，请求在 request.ts，按实体的接口在 api/<域>/<实体>.ts。
 */

// 端无关字段协议（与 portal-shared / 后端 page-schema 一致）
export type FieldDef = {
  code: string
  label: string
  type: "text" | "textarea" | "number" | "boolean" | "date" | "select" | "image"
  required?: boolean
  showInList?: boolean
  showInForm?: boolean
  options?: Array<{ label: string; value: string }>
  placeholder?: string
  sort?: number
}
export type PageSchema = { entity: string; title: string; fields: FieldDef[] }

export type Appearance = {
  siteName: string
  logoUrl: string
  faviconUrl: string
  primaryColor: string
  radius: number
  fontFamily: string
  layout: { density: "comfortable" | "compact" }
}

export type MemberPublic = {
  id: string
  account: string
  email: string | null
  nickname: string
  avatarUrl: string | null
  memberLevel: string
  status: string
  extraFields?: Record<string, unknown>
}
