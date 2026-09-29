/**
 * 租户解析助手（shared → 平台面）
 *
 * 未认证入口（C 端会员登录/注册等）没有租户上下文，只能依赖调用方提供的租户标识。
 * 平台面对业务域不开放（microservice:check 强制：业务域只能 import system.public.facade），
 * 因此这里由 shared 统一走 system.platform.facade —— 与 shared/backend/auth/guards.ts
 * 调用 resolveTenantEntitlement 的既有姿势一致。
 */

import { systemPlatformFacade } from "@/modules/system/contract/system.platform.facade"

/**
 * 把租户编码解析为租户 id。
 *
 * 返回 null 表示编码对应的租户不存在；调用方负责决定错误语义（避免在此处确定 HTTP 语义）。
 * 平台调用失败与「租户不存在」是两件事，因此失败直接抛出，不与 null 混淆。
 */
export async function resolveTenantIdByCode(tenantCode: string): Promise<string | null> {
  const result = await systemPlatformFacade.resolveTenantIdByCode(
    { tenantCode },
    { caller: "shared.tenant-resolver" },
  )
  if (!result.success) throw new Error(result.error ?? "租户标识解析失败")
  const data = result.data as { tenantId?: string | null } | undefined
  return data?.tenantId ?? null
}
