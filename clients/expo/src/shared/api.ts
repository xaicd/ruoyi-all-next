/**
 * Expo 端 API 封装 —— 消费与 Web/portal 完全相同的后端契约（{success,data}）：
 * open/meta/appearance、open/meta/page-schema/:entity、app/member/auth|user。
 * 一套后端，Web(portal) 与 Expo 各自渲染。apiBase 来自 app.json extra 或 EXPO_PUBLIC_API_BASE。
 */
import Constants from "expo-constants"

const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE ||
  (Constants.expoConfig?.extra as any)?.apiBase ||
  "http://localhost:3000"

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

let TOKEN: string | null = null
export function setToken(t: string) {
  TOKEN = t
}
export function getToken() {
  return TOKEN
}

async function parse<T>(res: Response): Promise<T> {
  const json: any = await res.json().catch(() => ({}))
  if (!res.ok || json?.success === false) {
    throw new Error(json?.error || json?.message || `请求失败(${res.status})`)
  }
  return json.data as T
}

function authHeaders(): Record<string, string> {
  return TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}
}

export async function fetchAppearance(): Promise<Appearance> {
  return parse<Appearance>(await fetch(`${API_BASE}/api/v1/open/meta/appearance`))
}

export async function fetchPageSchema(entity: string): Promise<PageSchema> {
  return parse<PageSchema>(await fetch(`${API_BASE}/api/v1/open/meta/page-schema/${encodeURIComponent(entity)}`))
}

export async function memberLogin(account: string, password: string): Promise<{ token: string; member: MemberPublic }> {
  const data = await parse<{ token: string; expiresIn: number; member: MemberPublic }>(
    await fetch(`${API_BASE}/api/v1/app/member/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ account, password }),
    }),
  )
  setToken(data.token)
  return { token: data.token, member: data.member }
}

export async function fetchProfile(): Promise<MemberPublic> {
  return parse<MemberPublic>(await fetch(`${API_BASE}/api/v1/app/member/user/profile`, { headers: authHeaders() }))
}

export async function updateProfile(patch: { nickname?: string; avatarUrl?: string; extraFields?: Record<string, unknown> }): Promise<MemberPublic> {
  return parse<MemberPublic>(
    await fetch(`${API_BASE}/api/v1/app/member/user/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(patch),
    }),
  )
}

/** 预览免输入登录：演示凭据（对齐 portal） */
export const DEMO_CREDENTIALS = { account: "demo", password: "demo123" }
