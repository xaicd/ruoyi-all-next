import { ruoyiPrisma } from "@/modules/shared/backend/prisma"

export async function readSettingList<T>(key: string, defaults: T[] = []): Promise<T[]> {
  const row = await ruoyiPrisma.setting.findUnique({ where: { key } })
  const items = (row?.value as { items?: T[] } | null)?.items
  if (Array.isArray(items)) {
    return items as T[]
  }

  if (defaults.length > 0) {
    await ruoyiPrisma.setting.upsert({
      where: { key },
      create: { key, value: { items: defaults } },
      update: { value: { items: defaults } },
    })
  }

  return defaults
}

export async function writeSettingList<T>(key: string, items: T[]) {
  await ruoyiPrisma.setting.upsert({
    where: { key },
    create: { key, value: { items } },
    update: { value: { items } },
  })
}