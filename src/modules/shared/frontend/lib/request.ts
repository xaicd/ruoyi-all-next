/**
 * 统一请求客户端
 *
 * 功能：
 * - 自动附加 Authorization header
 * - Token 过期自动跳转登录
 * - 统一响应解析
 * - 统一错误处理
 */

type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  body?: any
  headers?: Record<string, string>
  /** 跳过 token 检查（登录接口用） */
  noAuth?: boolean
}

class RequestClient {
  private baseUrl = ""

  /** 获取 token */
  private getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("ruoyi_token")
  }

  /** token 过期处理 */
  private handleUnauthorized() {
    if (typeof window === "undefined") return
    localStorage.removeItem("ruoyi_token")
    localStorage.removeItem("ruoyi_user")
    const current = window.location.pathname
    if (current !== "/login") {
      window.location.href = "/login?redirect=" + encodeURIComponent(current)
    }
  }

  /** 核心请求方法 */
  async request<T = any>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { method = "GET", body, headers = {}, noAuth = false } = options

    // 构建 headers
    const finalHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    }

    // 自动附加 token
    if (!noAuth) {
      const token = this.getToken()
      if (token) {
        finalHeaders["Authorization"] = `Bearer ${token}`
      }
    }

    // 构建 fetch options
    const fetchOptions: RequestInit = {
      method,
      headers: finalHeaders,
    }

    if (body && method !== "GET") {
      fetchOptions.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(this.baseUrl + url, fetchOptions)

      // 401: token 过期或无效
      if (response.status === 401 && !noAuth) {
        this.handleUnauthorized()
        return { success: false, error: "登录已过期，请重新登录" }
      }

      const data = await response.json()
      return data
    } catch (error: any) {
      return { success: false, error: error?.message ?? "网络异常" }
    }
  }

  // === 快捷方法 ===

  get<T = any>(url: string, params?: Record<string, any>) {
    if (params) {
      const sp = new URLSearchParams()
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") sp.set(k, String(v))
      })
      const qs = sp.toString()
      if (qs) url += (url.includes("?") ? "&" : "?") + qs
    }
    return this.request<T>(url, { method: "GET" })
  }

  post<T = any>(url: string, body?: any, options?: Partial<RequestOptions>) {
    return this.request<T>(url, { method: "POST", body, ...options })
  }

  put<T = any>(url: string, body?: any) {
    return this.request<T>(url, { method: "PUT", body })
  }

  patch<T = any>(url: string, body?: any) {
    return this.request<T>(url, { method: "PATCH", body })
  }

  delete<T = any>(url: string) {
    return this.request<T>(url, { method: "DELETE" })
  }
}

/** 全局请求实例 */
export const request = new RequestClient()

/** API 路径常量 */
export const API = {
  // System
  AUTH: "/api/v1/admin/system/auth",
  USERS: "/api/v1/admin/system/users",
  ROLES: "/api/v1/admin/system/roles",
  DEPTS: "/api/v1/admin/system/depts",
  MENUS: "/api/v1/admin/system/menus",
  POSTS: "/api/v1/admin/system/posts",
  DICTS: "/api/v1/admin/system/dicts",
  ROLE_MENU_IDS: "/api/v1/admin/system/permissions/role-menus",
  ASSIGN_ROLE_MENU: "/api/v1/admin/system/permissions/assign-role-menu",
  TENANTS: "/api/v1/admin/system/tenants",
  TENANT_PACKAGES: "/api/v1/admin/system/tenant-packages",

  // Infra
  CONFIGS: "/api/v1/admin/infra/configs",
  JOBS: "/api/v1/admin/infra/jobs",
  FILES: "/api/v1/admin/infra/files",
  DATA_SOURCE_CONFIG: "/api/v1/admin/infra/data-source-config",
  CODEGEN: "/api/v1/admin/infra/codegen",

  // Pay
  PAY_ORDERS: "/api/v1/admin/pay/orders",
  PAY_REFUNDS: "/api/v1/admin/pay/refunds",

  // CRM
  CRM_CUSTOMERS: "/api/v1/admin/crm/customers",
} as const
