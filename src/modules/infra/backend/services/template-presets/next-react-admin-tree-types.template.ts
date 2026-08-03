export const nextReactAdminTreeTypesTemplate = `export interface {{entityName}}TreeNode {
  id: string
  name: string
  children?: {{entityName}}TreeNode[]
}

export interface Move{{entityName}}TreeNodeInput {
  id: string
  targetParentId: string | null
}
`
