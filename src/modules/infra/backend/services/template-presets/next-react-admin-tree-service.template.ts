export const nextReactAdminTreeServiceTemplate = `import { domainLog } from "@/modules/shared/backend/lib/domain-log"

/**
 * Same-process callers use this Service as a local application port.
 * Cross-domain callers must use createDomainFacade("{{moduleName}}"), never import this Service.
 */
type TreeItem = {
  id: string
  parentId: string | null
  name: string
}

export class {{entityName}}TreeService {
  static async listTree() {
    domainLog.event("{{moduleName}}.{{featureKebab}}.tree.list")
    const items: TreeItem[] = []
    return items
  }

  static async moveNode(input: { id: string; targetParentId: string | null }) {
    domainLog.event("{{moduleName}}.{{featureKebab}}.tree.move", input)
    return { success: true }
  }
}
`
