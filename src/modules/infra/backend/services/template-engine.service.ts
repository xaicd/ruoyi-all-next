import type {
  InfraCodegenExportInput,
  InfraPageQueryInput,
} from "../../../../backend/validators/infra.validator"
import { domainLog } from "../../../../backend/lib/domain-log"
import { readSettingList, writeSettingList } from "./infra-setting-store"
import { DEFAULT_NEXT_REACT_TEMPLATE_PRESETS } from "./template-engine-presets"

type TemplateCategory = "CRUD" | "TREE" | "SINGLETON" | "WORKFLOW" | "DOMAIN" | "FOUNDATION"
type TemplateType = "BACKEND" | "FRONTEND" | "API" | "SQL"
type TemplateEngine = "handlebars" | "mustache" | "ejs" | "json-template"
type TemplateStatus = "ACTIVE" | "DISABLED"

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

const TEMPLATES_SETTING_KEY = "infra.template-engine.templates"

function mergeTemplates(stored: InfraTemplateRecord[]) {
  const merged = new Map<string, InfraTemplateRecord>()
  for (const preset of DEFAULT_NEXT_REACT_TEMPLATE_PRESETS) {
    merged.set(preset.code, preset)
  }
  for (const item of stored) {
    merged.set(item.code, item)
  }
  return [...merged.values()]
}

async function readTemplateCatalog() {
  const stored = await readSettingList<InfraTemplateRecord>(TEMPLATES_SETTING_KEY)
  return mergeTemplates(stored)
}

function renderTemplate(content: string, variables: TemplatePreviewInput["variables"]) {
  return content.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_, key: string) => {
    const value = variables[key]
    if (value === null || value === undefined) return ""
    return String(value)
  })
}

function renderTemplatePath(path: string, variables: TemplatePreviewInput["variables"]) {
  return renderTemplate(path, variables)
}

function expandSelectedTemplates(
  selected: InfraTemplateRecord[],
  candidates: InfraTemplateRecord[],
) {
  const candidateMap = new Map(candidates.map((item) => [item.code, item]))
  const expanded: InfraTemplateRecord[] = []
  const seen = new Set<string>()

  for (const template of selected) {
    const bundleTemplateCodes = Array.isArray(template.options?.bundleTemplateCodes)
      ? (template.options?.bundleTemplateCodes as string[])
      : []

    if (bundleTemplateCodes.length === 0) {
      if (!seen.has(template.code)) {
        expanded.push(template)
        seen.add(template.code)
      }
      continue
    }

    for (const code of bundleTemplateCodes) {
      const bundledTemplate = candidateMap.get(code)
      if (!bundledTemplate || seen.has(bundledTemplate.code)) continue
      expanded.push(bundledTemplate)
      seen.add(bundledTemplate.code)
    }
  }

  return expanded
}

export class InfraTemplateEngineService {
  static async list(input: InfraPageQueryInput) {
    domainLog.event("infra.template-engine.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    const templates = await readTemplateCatalog()
    const keyword = input.keyword?.trim().toLowerCase() ?? ""
    const filtered = keyword
      ? templates.filter(
          (item) =>
            item.code.toLowerCase().includes(keyword) ||
            item.name.toLowerCase().includes(keyword) ||
            item.category.toLowerCase().includes(keyword) ||
            item.templateType.toLowerCase().includes(keyword),
        )
      : templates

    const start = (input.page - 1) * input.pageSize
    return {
      items: filtered.slice(start, start + input.pageSize),
      total: filtered.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async save(operatorId: string, template: Omit<InfraTemplateRecord, "id" | "updatedAt"> & { id?: string }) {
    const templates = await readSettingList<InfraTemplateRecord>(TEMPLATES_SETTING_KEY)
    const nextTemplate: InfraTemplateRecord = {
      id: template.id ?? `tpl-${Date.now()}`,
      code: template.code,
      name: template.name,
      category: template.category,
      templateType: template.templateType,
      engine: template.engine,
      content: template.content,
      status: template.status,
      description: template.description,
      options: template.options,
      updatedAt: new Date().toISOString(),
    }

    const next = [nextTemplate, ...templates.filter((item) => item.code !== template.code)]
    await writeSettingList(TEMPLATES_SETTING_KEY, next)

    domainLog.audit("infra.template-engine.save", {
      operatorId,
      templateCode: template.code,
      templateType: template.templateType,
    })

    return nextTemplate
  }

  static async preview(input: TemplatePreviewInput) {
    const templates = await readTemplateCatalog()
    const template = templates.find((item) => item.code === input.templateCode)
    if (!template) {
      throw new Error("模板不存在")
    }

    domainLog.event("infra.template-engine.preview", {
      templateCode: input.templateCode,
      engine: template.engine,
    })

    return {
      templateCode: template.code,
      renderedContent: renderTemplate(template.content, input.variables),
      engine: template.engine,
      category: template.category,
      templateType: template.templateType,
    }
  }

  static async generate(input: InfraCodegenExportInput): Promise<TemplateScaffoldResult> {
    const templates = await readTemplateCatalog()
    const candidates = templates.filter((item) => {
      if (!input.includeDisabled && item.status !== "ACTIVE") return false
      const stack = String(item.options?.stack ?? "")
      return stack === input.stack
    })

    const selected = input.templateCodes?.length
      ? candidates.filter((item) => input.templateCodes?.includes(item.code))
      : candidates

    const templatesToRender = expandSelectedTemplates(selected, candidates)

    const files = templatesToRender.flatMap((template) => {
      const rawPath = String(template.options?.filePath ?? `templates/${template.code}.txt`)
      const renderedPath = renderTemplatePath(rawPath, input.variables)
      const renderedContent = renderTemplate(template.content, input.variables)

      return [
        {
          templateCode: template.code,
          path: renderedPath,
          content: renderedContent,
          engine: template.engine,
          category: template.category,
          templateType: template.templateType,
        },
      ]
    })

    domainLog.event("infra.template-engine.generate", {
      stack: input.stack,
      templateCount: templatesToRender.length,
      fileCount: files.length,
    })

    return {
      stack: input.stack,
      generatedAt: new Date().toISOString(),
      files,
    }
  }

  static async getByCode(templateCode: string) {
    const templates = await readTemplateCatalog()
    return templates.find((item) => item.code === templateCode) ?? null
  }
}