export const nextReactAdminWorkflowTypesTemplate = `export interface {{entityName}}WorkflowItem {
  id: string
  title: string
  status: "PENDING" | "APPROVED" | "REJECTED"
}

export interface {{entityName}}WorkflowAuditInput {
  id: string
  action: "APPROVE" | "REJECT"
  reason?: string
}
`
