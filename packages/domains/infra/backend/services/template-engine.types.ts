/**
 * Infra Template Engine Types
 */

export type TemplateCategory = "CRUD" | "TREE" | "SINGLETON" | "WORKFLOW" | "DOMAIN" | "FOUNDATION"
export type TemplateType = "BACKEND" | "FRONTEND" | "API" | "SQL"
export type TemplateEngine = "handlebars" | "mustache" | "ejs" | "json-template"
export type TemplateStatus = "ACTIVE" | "DISABLED"

export type InfraTemplateRecord = {
  id: string
  code: string
  name: string
  category: TemplateCategory
  templateType: TemplateType
  engine: TemplateEngine
  content: string
  status: TemplateStatus
  description?: string
  options?: Record<string, unknown>
  updatedAt: string
}

export type TemplatePreviewInput = {
  templateCode: string
  variables: Record<string, string | number | boolean | null | undefined>
}

export type TemplateScaffoldFile = {
  templateCode: string
  path: string
  content: string
  engine: TemplateEngine
  category: TemplateCategory
  templateType: TemplateType
}

export type TemplateScaffoldResult = {
  stack: string
  generatedAt: string
  files: TemplateScaffoldFile[]
}
