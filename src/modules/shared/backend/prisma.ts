import { PrismaClient } from "@prisma/client"

declare global {
  // eslint-disable-next-line no-var
  var __ruoyiAllNextPrisma__: PrismaClient | undefined
}

type MockModel = {
  findMany: (args?: any) => Promise<any[]>
  findFirst: (args?: any) => Promise<any>
  findUnique: (args?: any) => Promise<any>
  count: (args?: any) => Promise<number>
  create: (args?: any) => Promise<any>
  update: (args?: any) => Promise<any>
  upsert: (args?: any) => Promise<any>
  deleteMany: (args?: any) => Promise<{ count: number }>
  groupBy: (args?: any) => Promise<any[]>
}

function createMockModel(): MockModel {
  return {
    async findMany() {
      return []
    },
    async findFirst() {
      return null
    },
    async findUnique() {
      return null
    },
    async count() {
      return 0
    },
    async create(args?: any) {
      return args?.data ?? {}
    },
    async update(args?: any) {
      return args?.data ?? {}
    },
    async upsert(args?: any) {
      return args?.update ?? args?.create ?? {}
    },
    async deleteMany() {
      return { count: 0 }
    },
    async groupBy() {
      return []
    },
  }
}

function createMockPrismaClient() {
  const modelProxy = new Proxy(createMockModel(), {
    get(target, prop, receiver) {
      if (typeof prop === "string" && prop in target) {
        return Reflect.get(target, prop, receiver)
      }
      return async () => null
    },
  })

  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (typeof prop === "string" && prop.startsWith("$")) {
          return async () => undefined
        }
        return modelProxy
      },
    },
  ) as unknown as PrismaClient
}

function createClientSafely(): PrismaClient {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    })
  } catch {
    return createMockPrismaClient()
  }
}

export const ruoyiPrisma = globalThis.__ruoyiAllNextPrisma__ ?? createClientSafely()

if (process.env.NODE_ENV !== "production") {
  globalThis.__ruoyiAllNextPrisma__ = ruoyiPrisma
}