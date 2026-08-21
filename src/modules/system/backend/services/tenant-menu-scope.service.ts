import { SystemMenuRepository, type SystemMenuRow } from "@/modules/system/backend/repositories/menu.repository"
import { withOnlinePackageMenuIds } from "@/modules/online/contract/menu-catalog"

const PLATFORM_CONTROL_MENU_NAMES = new Set(["租户管理", "租户套餐", "数据源配置", "OAuth 2.0", "令牌管理", "应用管理"])
const PLATFORM_CONTROL_PERMISSION_PREFIXES = ["system:tenant:", "system:tenant-package:", "system:oauth2-", "infra:data-source-config:"]
const PLATFORM_CONTROL_PATHS = new Set(["tenant", "tenant-package", "data-source-config", "oauth2", "oauth2/application"])
const PLATFORM_CONTROL_COMPONENTS = new Set([
  "system/tenant/index",
  "system/tenantPackage/index",
  "infra/dataSourceConfig/index",
  "system/oauth2/token/index",
  "system/oauth2/client/index",
])

function normalized(value: string | null): string {
  return value?.trim().replace(/^\/+/, "").replace(/\/+$/, "") ?? ""
}

/** Platform control-plane roots are never assignable through tenant packages. */
export function isPlatformControlMenu(menu: Pick<SystemMenuRow, "name" | "permission" | "path" | "component">): boolean {
  const path = normalized(menu.path)
  const component = normalized(menu.component)
  return PLATFORM_CONTROL_MENU_NAMES.has(menu.name)
    || PLATFORM_CONTROL_PERMISSION_PREFIXES.some((prefix) => menu.permission?.startsWith(prefix))
    || PLATFORM_CONTROL_PATHS.has(path)
    || PLATFORM_CONTROL_COMPONENTS.has(component)
}

export class TenantMenuScope {
  private readonly byId = new Map(this.menus.map((menu) => [menu.id, menu]))
  private readonly blockedIds = new Set<string>()

  constructor(private readonly menus: SystemMenuRow[]) {
    for (const menu of menus) if (isPlatformControlMenu(menu)) this.blockedIds.add(menu.id)
    let changed = true
    while (changed) {
      changed = false
      for (const menu of menus) {
        if (menu.parentId && this.blockedIds.has(menu.parentId) && !this.blockedIds.has(menu.id)) {
          this.blockedIds.add(menu.id)
          changed = true
        }
      }
    }
  }

  isTenantPackageCandidate(menuId: string): boolean {
    const menu = this.byId.get(menuId)
    if (!menu || menu.status !== "ACTIVE" || this.blockedIds.has(menuId)) return false
    const seen = new Set<string>()
    let current: SystemMenuRow | undefined = menu
    while (current.parentId) {
      if (seen.has(current.id)) return false
      seen.add(current.id)
      const parent = this.byId.get(current.parentId)
      if (!parent || parent.status !== "ACTIVE" || this.blockedIds.has(parent.id)) return false
      current = parent
    }
    return true
  }

  /** Adds only safe active ancestors, so scoped trees can never promote orphan nodes to roots. */
  normalize(menuIds: Iterable<string>): string[] {
    const result = new Set<string>()
    for (const menuId of menuIds) {
      if (!this.isTenantPackageCandidate(menuId)) continue
      let current = this.byId.get(menuId)
      const seen = new Set<string>()
      while (current && !seen.has(current.id)) {
        seen.add(current.id)
        result.add(current.id)
        current = current.parentId ? this.byId.get(current.parentId) : undefined
      }
    }
    return [...result]
  }

  candidateIds(): string[] {
    return this.normalize(this.menus.map((menu) => menu.id))
  }
}

async function currentScope(): Promise<TenantMenuScope> {
  return new TenantMenuScope(await SystemMenuRepository.findAll())
}

export async function getTenantPackageCandidateMenuIds(): Promise<string[]> {
  return (await currentScope()).candidateIds()
}

/** Effective tenant authorization: package membership intersected with the safe tenant catalog. */
export async function getTenantAssignableMenuIds(packageMenuIds: Iterable<string>): Promise<Set<string>> {
  return new Set((await currentScope()).normalize(withOnlinePackageMenuIds(packageMenuIds)))
}

/** Rejects direct package writes outside the safe tenant catalog and returns a tree-complete selection. */
export async function validateTenantPackageMenuIds(menuIds: string[]): Promise<string[]> {
  const scope = await currentScope()
  for (const menuId of new Set(menuIds)) {
    if (!scope.isTenantPackageCandidate(menuId)) throw new Error(`菜单不可用于租户套餐: ${menuId}`)
  }
  return scope.normalize(menuIds)
}
