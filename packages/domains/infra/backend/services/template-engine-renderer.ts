/**
 * Infra Template Engine Rendering & Catalog Helpers
 */

import { readSettingList } from "./infra-setting-store"
import { DEFAULT_NEXT_REACT_TEMPLATE_PRESETS } from "./template-engine-presets"
import type { InfraTemplateRecord, TemplatePreviewInput } from "./template-engine.types"

export const TEMPLATES_SETTING_KEY = "infra.template-engine.templates"

export function mergeTemplates(stored: InfraTemplateRecord[]) {
  const merged = new Map<string, InfraTemplateRecord>()
  for (const preset of DEFAULT_NEXT_REACT_TEMPLATE_PRESETS) {
    merged.set(preset.code, preset)
  }
  for (const item of stored) {
    merged.set(item.code, item)
  }
  return [...merged.values()]
}

export async function readTemplateCatalog() {
  const stored = await readSettingList<InfraTemplateRecord>(TEMPLATES_SETTING_KEY)
  return mergeTemplates(stored)
}

export function deriveTemplateVariables(variables: Record<string, string | number | boolean | null | undefined> = {}) {
  const modulePath = String(variables.modulePath ?? variables.moduleName ?? "").replace(/^\/+|\/+$/g, "")
  const moduleName = String(variables.moduleName ?? modulePath.split("/")[0] ?? "")
  const featureKebab = String(variables.featureKebab ?? (modulePath.split("/").slice(1).join("-") || moduleName))
  const apiBase = String(variables.apiBase ?? (modulePath ? `/api/v1/admin/${modulePath}` : "/api/v1/admin"))
  return { ...variables, modulePath, moduleName, featureKebab, apiBase }
}

export function renderTemplate(content: string, variables: TemplatePreviewInput["variables"]) {
  const resolved = deriveTemplateVariables(variables)
  return content.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_, key: string) => {
    const value = resolved[key]
    if (value === null || value === undefined) return ""
    return String(value)
  })
}

export function renderTemplatePath(path: string, variables: TemplatePreviewInput["variables"]) {
  return renderTemplate(path, variables)
}

export function expandSelectedTemplates(
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
