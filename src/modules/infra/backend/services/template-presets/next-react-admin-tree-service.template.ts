export const nextReactAdminTreeServiceTemplate = `import { logger } from "@/lib/logger"

const log = logger.child("{{entityName}}TreeService", "biz")

type TreeItem = {
  id: string
  parentId: string | null
  name: string
}

export class {{entityName}}TreeService {
  static async listTree() {
    log.event("{{modulePath}}.tree.list")
    const items: TreeItem[] = []
    return items
  }

  static async moveNode(input: { id: string; targetParentId: string | null }) {
    log.event("{{modulePath}}.tree.move", input)
    return { success: true }
  }
}
`
