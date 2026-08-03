import { ruoyiPrisma } from "../../../shared/backend/prisma"

export async function readSettingList<T>(key: string): Promise<T[]> {
  const row = await ruoyiPrisma.setting.findUnique({ where: { key } })
  const payload = row?.value as { items?: T[] } | null
  return Array.isArray(payload?.items) ? (payload.items as T[]) : []
}

export async function writeSettingList<T>(key: string, items: T[]) {
  await ruoyiPrisma.setting.upsert({
    where: { key },
    create: { key, value: { items } },
    update: { value: { items } },
  })
}
