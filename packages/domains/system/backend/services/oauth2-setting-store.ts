import type { Prisma } from "@prisma/client"
import { ruoyiPrisma } from "@/modules/shared/backend/prisma"

function listValue<T>(items: T[]): Prisma.InputJsonValue {
  return { items: items as Prisma.InputJsonArray }
}

export async function readSettingList<T>(key: string, defaults: T[] = []): Promise<T[]> {
  const row = await ruoyiPrisma.setting.findUnique({ where: { key } })
  const items = (row?.value as { items?: T[] } | null)?.items
  if (Array.isArray(items)) {
    return items as T[]
  }

  if (defaults.length > 0) {
    await ruoyiPrisma.setting.upsert({
      where: { key },
      create: { key, value: listValue(defaults) },
      update: { value: listValue(defaults) },
    })
  }

  return defaults
}

export async function writeSettingList<T>(key: string, items: T[]) {
  await ruoyiPrisma.setting.upsert({
    where: { key },
    create: { key, value: listValue(items) },
    update: { value: listValue(items) },
  })
}