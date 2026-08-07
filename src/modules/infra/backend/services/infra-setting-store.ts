import { ruoyiPrisma } from "@/modules/shared/backend/prisma"

export async function readSettingList<T>(key: string, prefixes: string[] = []): Promise<T[]> {
  const candidates = [key, ...prefixes]

  for (const candidate of candidates) {
    const exact = await ruoyiPrisma.setting.findUnique({ where: { key: candidate } })
    if (exact) {
      const payload = exact.value as { items?: T[] } | null
      if (Array.isArray(payload?.items)) {
        return payload.items as T[]
      }
    }

    const prefixed = await ruoyiPrisma.setting.findMany({
      where: { key: { startsWith: candidate } },
      orderBy: { createdAt: "asc" },
    })

    for (const row of prefixed) {
      const payload = row.value as { items?: T[] } | null
      if (Array.isArray(payload?.items)) {
        return payload.items as T[]
      }
    }
  }

  return []
}

export async function writeSettingList<T>(key: string, items: T[]) {
  await ruoyiPrisma.setting.upsert({
    where: { key },
    create: { key, value: { items } },
    update: { value: { items } },
  })
}
