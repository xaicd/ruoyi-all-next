import { projectProfile } from "./project-profile"

export function overlayPackageName(id: string, fallback: string): string {
  return projectProfile.packages.find((item) => item.id === id)?.name ?? fallback
}

export function overlayUserNickname(username: string, fallback: string, bootstrapUsername?: string): string {
  if (bootstrapUsername && username === bootstrapUsername) return projectProfile.bootstrapAdmin.nickname
  return projectProfile.defaultUsers.find((item) => item.username === username)?.nickname ?? fallback
}

export function overlayTenant<T extends {
  id: string
  tenantCode: string
  name: string
  contactName: string | null
  contactPhone: string | null
  domain: string | null
  packageId: string | null
}>(row: T): T {
  const hit = projectProfile.tenants.find((item) => item.id === row.id)
  if (!hit) return row
  return {
    ...row,
    tenantCode: hit.code,
    name: hit.name,
    contactName: hit.contactName ?? row.contactName,
    contactPhone: hit.contactPhone ?? row.contactPhone,
    domain: hit.domain === undefined ? row.domain : hit.domain,
    packageId: hit.packageId,
  }
}
