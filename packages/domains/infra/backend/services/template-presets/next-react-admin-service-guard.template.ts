export const nextReactAdminServiceGuardTemplate = `import { Errors } from "@/lib/errors"

export type {{entityName}}Status = "PENDING" | "APPROVED" | "REJECTED"

const TRANSITIONS: Record<{{entityName}}Status, {{entityName}}Status[]> = {
  PENDING: ["APPROVED", "REJECTED"],
  APPROVED: [],
  REJECTED: [],
}

export class {{entityName}}StateGuard {
  static assertTransition(from: {{entityName}}Status, to: {{entityName}}Status) {
    const allowList = TRANSITIONS[from] ?? []
    if (!allowList.includes(to)) {
      throw Errors.CONFLICT("状态不允许迁移: \${from} -> \${to}")
    }
  }
}
`
