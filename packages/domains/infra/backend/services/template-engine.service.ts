import type {
  InfraCodegenExportInput,
  InfraPageQueryInput,
} from "@/modules/infra/backend/validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { readSettingList, writeSettingList } from "./infra-setting-store"
import type {
  InfraTemplateRecord,
  TemplatePreviewInput,
  TemplateScaffoldResult,
} from "./template-engine.types"
import {
  TEMPLATES_SETTING_KEY,
  readTemplateCatalog,
  renderTemplate,
  renderTemplatePath,
  expandSelectedTemplates,
} from "./template-engine-renderer"

export type {
  TemplateCategory,
  TemplateType,
  TemplateEngine,
  TemplateStatus,
  InfraTemplateRecord,
  TemplatePreviewInput,
  TemplateScaffoldFile,
  TemplateScaffoldResult,
} from "./template-engine.types"

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

export const infraTemplateEngineService = InfraTemplateEngineService