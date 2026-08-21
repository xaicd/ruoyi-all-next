import { ApiError } from "@/modules/shared/backend/http/api-error"
import type { AuthContext } from "@/modules/shared/backend/auth/context"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { KyselyOnlineDefinitionRepository } from "../adapters/persistence/online-definition.repository"
import { KyselyOnlineSchemaPlanRepository } from "../adapters/persistence/online-schema-plan.repository"
import { KyselyOnlineRuntimeRepository } from "../adapters/persistence/online-runtime.repository"
import { toOnlineCodegenConfig } from "../application/online-codegen.adapter"
import { infraPlatformFacade } from "@/modules/infra/contract/infra.platform.facade"
import { systemPublicFacade } from "@/modules/system/contract/system.public.facade"
import type { ApplyOnlineSchemaPlanInput, ApproveOnlineSchemaPlanInput, ArchiveOnlineDefinitionInput, BatchDownloadOnlineCodeInput, CreateOnlineDefinitionInput, CreateOnlineRuntimeRecordInput, CreateOnlineSchemaPlanInput, DeleteOnlineDefinitionInput, NormalizeOnlineSystemFieldsInput, OnlineDefinitionPageInput, OnlinePageDefinitionsInput, OnlineRuntimeRecordPageInput, PublishOnlineRevisionInput, ResolvePublishedReleaseInput, RollbackOnlineDefinitionInput, UpdateOnlineDefinitionInput, UpdateOnlineRevisionInput, UpdateOnlineRuntimeRecordInput, ValidateOnlineRevisionInput } from "../validators"

function tenantScope(auth: AuthContext): { tenantId: string; actorId: string } {
  if (!auth.tenantId) throw new ApiError("FORBIDDEN", "Online Definition 必须在租户上下文中管理")
  return { tenantId: auth.tenantId, actorId: auth.userId }
}

export class OnlineDefinitionService {
  static async page(auth: AuthContext, input: OnlineDefinitionPageInput) {
    return this.pageDefinitions({ ...input, tenantId: tenantScope(auth).tenantId })
  }

  static async pageDefinitions(input: OnlinePageDefinitionsInput) {
    if (!input.tenantId) throw new ApiError("FORBIDDEN", "Online Definition 必须在租户上下文中管理")
    const data = await KyselyOnlineDefinitionRepository.page({
      tenantId: input.tenantId,
      page: input.page ?? 1,
      pageSize: input.pageSize ?? 20,
      keyword: input.keyword,
      modelType: input.modelType,
      status: input.status,
    })
    return { ...data, phase: "METADATA_READY" as const, persistence: "POSTGRESQL_REQUIRED" as const }
  }

  static async resolvePublishedRelease(input: ResolvePublishedReleaseInput) {
    return KyselyOnlineRuntimeRepository.resolvePublishedReleaseById(input)
  }

  static async resolveCodegenImport(input: ResolvePublishedReleaseInput) {
    const runtime = await KyselyOnlineRuntimeRepository.resolvePublishedReleaseById(input)
    const childRuntimes = await KyselyOnlineRuntimeRepository.resolveMasterDetailChildReleases({ tenantId: input.tenantId, runtime })
    const config = toOnlineCodegenConfig(runtime, childRuntimes)
    return {
      definitionCode: runtime.definitionCode,
      definitionName: runtime.definitionName,
      releaseId: runtime.releaseId,
      schemaRevision: runtime.schemaRevision,
      storageKind: runtime.model.storage.kind,
      moduleName: config.moduleName,
      businessName: config.businessName,
      className: config.className,
      template: config.template,
      scene: config.scene,
      permissionPrefix: config.permissionPrefix,
      advanced: config.advanced,
    }
  }

  static async create(auth: AuthContext, input: CreateOnlineDefinitionInput) {
    const scope = tenantScope(auth)
    const data = await KyselyOnlineDefinitionRepository.create({ ...scope, code: input.code!, name: input.name!, modelType: input.modelType!, model: input.model, interaction: input.interaction })
    domainLog.audit("online.definition.create", { targetType: "ONLINE_DEFINITION", targetId: data.id })
    return data
  }

  static async detail(auth: AuthContext, code: string) {
    const { tenantId } = tenantScope(auth)
    return KyselyOnlineDefinitionRepository.detail({ tenantId, code })
  }

  static async update(auth: AuthContext, code: string, input: UpdateOnlineDefinitionInput) {
    const scope = tenantScope(auth)
    const data = await KyselyOnlineDefinitionRepository.updateDefinition({ ...scope, code, name: input.name, expectedLockVersion: input.expectedLockVersion! })
    domainLog.audit("online.definition.update", { targetType: "ONLINE_DEFINITION", targetId: data.id })
    return data
  }

  static async archive(auth: AuthContext, code: string, input: ArchiveOnlineDefinitionInput) {
    const scope = tenantScope(auth)
    const data = await KyselyOnlineDefinitionRepository.archiveDefinition({ ...scope, code, expectedLockVersion: input.expectedLockVersion })
    domainLog.audit("online.definition.archive", { targetType: "ONLINE_DEFINITION", targetId: data.id })
    return data
  }

  static async delete(auth: AuthContext, code: string, input: DeleteOnlineDefinitionInput) {
    const scope = tenantScope(auth)
    await KyselyOnlineDefinitionRepository.deleteDefinition({ ...scope, code, expectedLockVersion: input.expectedLockVersion })
    domainLog.audit("online.definition.delete", { targetType: "ONLINE_DEFINITION", targetId: code })
  }

  static async updateDraft(auth: AuthContext, code: string, input: UpdateOnlineRevisionInput) {
    const scope = tenantScope(auth)
    const data = await KyselyOnlineDefinitionRepository.updateDraft({ ...scope, code, expectedLockVersion: input.expectedLockVersion!, model: input.model, interaction: input.interaction, views: input.views, policy: input.policy, workflow: input.workflow })
    domainLog.audit("online.revision.update", { targetType: "ONLINE_DEFINITION", targetId: data.id })
    return data
  }

  static async normalizeSystemFields(auth: AuthContext, code: string, input: NormalizeOnlineSystemFieldsInput) {
    const scope = tenantScope(auth)
    const data = await KyselyOnlineDefinitionRepository.normalizeSystemFields({ ...scope, code, expectedLockVersion: input.expectedLockVersion })
    domainLog.audit("online.definition.normalize-system-fields", { targetType: "ONLINE_DEFINITION", targetId: data.id })
    return data
  }

  static async validateDraft(auth: AuthContext, code: string, input: ValidateOnlineRevisionInput) {
    const scope = tenantScope(auth)
    return KyselyOnlineDefinitionRepository.validateDraft({ ...scope, code, expectedLockVersion: input.expectedLockVersion! })
  }

  static async listSchemaPlans(auth: AuthContext, code: string) {
    const { tenantId } = tenantScope(auth)
    return KyselyOnlineSchemaPlanRepository.list({ tenantId, code })
  }

  static async getSchemaPlan(auth: AuthContext, code: string, planId: string) {
    const { tenantId } = tenantScope(auth)
    return KyselyOnlineSchemaPlanRepository.get({ tenantId, code, planId })
  }

  static async createSchemaPlan(auth: AuthContext, code: string, input: CreateOnlineSchemaPlanInput) {
    const scope = tenantScope(auth)
    const data = await KyselyOnlineSchemaPlanRepository.createForCurrentDraft({ ...scope, code, expectedLockVersion: input.expectedLockVersion })
    domainLog.audit("online.schema-plan.create", { targetType: "ONLINE_SCHEMA_CHANGE", targetId: data.id })
    return data
  }

  static async approveSchemaPlan(auth: AuthContext, code: string, planId: string, input: ApproveOnlineSchemaPlanInput) {
    const scope = tenantScope(auth)
    const data = await KyselyOnlineSchemaPlanRepository.approve({ ...scope, code, planId, expectedLockVersion: input.expectedLockVersion, note: input.note })
    domainLog.audit("online.schema-plan.approve", { targetType: "ONLINE_SCHEMA_CHANGE", targetId: data.id })
    return data
  }

  static async applySchemaPlan(auth: AuthContext, code: string, planId: string, input: ApplyOnlineSchemaPlanInput) {
    const scope = tenantScope(auth)
    const data = await KyselyOnlineSchemaPlanRepository.apply({ ...scope, code, planId, expectedLockVersion: input.expectedLockVersion })
    domainLog.audit("online.schema-plan.apply", { targetType: "ONLINE_SCHEMA_CHANGE", targetId: data.id, metadata: { status: data.status, appliedSchemaRevision: data.appliedSchemaRevision } })
    return data
  }

  static async publish(auth: AuthContext, code: string, input: PublishOnlineRevisionInput) {
    const scope = tenantScope(auth)
    const data = await KyselyOnlineDefinitionRepository.publish({ ...scope, code, expectedLockVersion: input.expectedLockVersion! })
    domainLog.audit("online.definition.publish", { targetType: "ONLINE_DEFINITION", targetId: data.id })
    return data
  }

  static async rollback(auth: AuthContext, code: string, input: RollbackOnlineDefinitionInput) {
    const scope = tenantScope(auth)
    const data = await KyselyOnlineDefinitionRepository.rollback({ ...scope, code, releaseId: input.releaseId!, expectedLockVersion: input.expectedLockVersion! })
    domainLog.audit("online.definition.rollback", { targetType: "ONLINE_DEFINITION", targetId: data.id })
    return data
  }

  static async previewGeneratedCode(auth: AuthContext, code: string) {
    const { tenantId } = tenantScope(auth)
    const runtime = await KyselyOnlineRuntimeRepository.resolveCurrentPublishedRelease({ tenantId, definitionCode: code })
    if (runtime.modelType !== "SINGLE" || runtime.model.storage.kind !== "MANAGED_TABLE") throw new ApiError("CONFLICT", "生产 CRUD 代码下载当前仅支持 SINGLE + MANAGED_TABLE 已发布模型")
    const childRuntimes = await KyselyOnlineRuntimeRepository.resolveMasterDetailChildReleases({ tenantId, runtime })
    const config = toOnlineCodegenConfig(runtime, childRuntimes)
    const outputs = await invokeInfraCodegen("previewCodegen", config)
    domainLog.audit("online.definition.codegen.preview", { targetType: "ONLINE_DEFINITION", targetId: runtime.definitionId, metadata: { releaseId: runtime.releaseId, schemaRevision: runtime.schemaRevision, fileCount: outputs.length } })
    return { releaseId: runtime.releaseId, schemaRevision: runtime.schemaRevision, files: outputs }
  }

  static async generateCode(auth: AuthContext, code: string) {
    const { tenantId } = tenantScope(auth)
    const runtime = await KyselyOnlineRuntimeRepository.resolveCurrentPublishedRelease({ tenantId, definitionCode: code })
    if (runtime.modelType !== "SINGLE" || runtime.model.storage.kind !== "MANAGED_TABLE") throw new ApiError("CONFLICT", "生产 CRUD 代码下载当前仅支持 SINGLE + MANAGED_TABLE 已发布模型")
    const childRuntimes = await KyselyOnlineRuntimeRepository.resolveMasterDetailChildReleases({ tenantId, runtime })
    const config = toOnlineCodegenConfig(runtime, childRuntimes)
    const outputs = await invokeInfraCodegen("generateCodegen", config)
    domainLog.audit("online.definition.codegen.download", { targetType: "ONLINE_DEFINITION", targetId: runtime.definitionId, metadata: { releaseId: runtime.releaseId, schemaRevision: runtime.schemaRevision, fileCount: outputs.length } })
    return { releaseId: runtime.releaseId, schemaRevision: runtime.schemaRevision, className: config.className, files: outputs }
  }

  /** Generates every requested Release under the current tenant; failures abort the whole batch. */
  static async generateCodeBatch(auth: AuthContext, input: BatchDownloadOnlineCodeInput) {
    const results = []
    for (const code of input.codes) results.push({ code, ...(await this.generateCode(auth, code)) })
    domainLog.audit("online.definition.codegen.batch-download", { targetType: "ONLINE_DEFINITION", targetId: input.codes.join(","), metadata: { definitionCount: results.length, fileCount: results.reduce((total, result) => total + result.files.length, 0) } })
    return results
  }

  /** Returns only dictionary values explicitly referenced by this immutable Published Release. */
  static async lookupDictionaryOptions(auth: AuthContext, code: string, fieldCode: string) {
    const { tenantId } = tenantScope(auth)
    const runtime = await KyselyOnlineRuntimeRepository.resolveCurrentPublishedRelease({ tenantId, definitionCode: code })
    const field = runtime.interaction.fields.find((item) => item.code === fieldCode)
    if (!field?.dictionaryCode || ![field.widget, field.query.widget].some((widget) => widget === "DICTIONARY" || widget === "SELECT")) throw new ApiError("NOT_FOUND", "当前 Published Release 未为该字段配置字典选项")
    const result = await systemPublicFacade.getDictDataByType({ type: field.dictionaryCode }, { caller: "online.definition" })
    if (!result.success) throw new ApiError("INTERNAL_ERROR", result.error ?? "system dict 调用失败")
    const values = Array.isArray(result.data) ? result.data : []
    const options = values
      .filter((value: { status: string }) => value.status === "ACTIVE")
      .map((value: { value: string; label: string }) => ({ value: value.value, label: value.label }))
    domainLog.audit("online.definition.lookup.dictionary", { targetType: "ONLINE_DEFINITION", targetId: runtime.definitionId, metadata: { releaseId: runtime.releaseId, fieldCode, dictionaryCode: field.dictionaryCode, optionCount: options.length } })
    return { releaseId: runtime.releaseId, fieldCode, options }
  }

  static async startTestSession(auth: AuthContext, code: string) {
    const scope = tenantScope(auth)
    const data = await KyselyOnlineRuntimeRepository.startTestSession({ ...scope, definitionCode: code })
    domainLog.audit("online.test.start", { targetType: "ONLINE_TEST_SESSION", targetId: data.id })
    return data
  }

  static async getTestSession(auth: AuthContext, code: string, sessionId: string) {
    return KyselyOnlineRuntimeRepository.getTestSession({ ...tenantScope(auth), definitionCode: code, sessionId })
  }

  static async pageTestRecords(auth: AuthContext, code: string, sessionId: string, input: OnlineRuntimeRecordPageInput) {
    const conditions = (input.conditions ?? []).map((condition) => ({ field: condition.field!, value: condition.value! }))
    return KyselyOnlineRuntimeRepository.pageRecords({ ...tenantScope(auth), definitionCode: code, sessionId, page: input.page, pageSize: input.pageSize, conditions })
  }

  static async createTestRecord(auth: AuthContext, code: string, sessionId: string, input: CreateOnlineRuntimeRecordInput) {
    const data = await KyselyOnlineRuntimeRepository.createRecord({ ...tenantScope(auth), definitionCode: code, sessionId, data: input.data })
    domainLog.audit("online.test.record.create", { targetType: "ONLINE_RECORD", targetId: data.id })
    return data
  }

  static async updateTestRecord(auth: AuthContext, code: string, sessionId: string, recordId: string, input: UpdateOnlineRuntimeRecordInput) {
    const data = await KyselyOnlineRuntimeRepository.updateRecord({ ...tenantScope(auth), definitionCode: code, sessionId, recordId, data: input.data })
    domainLog.audit("online.test.record.update", { targetType: "ONLINE_RECORD", targetId: data.id })
    return data
  }

  static async deleteTestRecord(auth: AuthContext, code: string, sessionId: string, recordId: string) {
    await KyselyOnlineRuntimeRepository.deleteRecord({ ...tenantScope(auth), definitionCode: code, sessionId, recordId })
    domainLog.audit("online.test.record.delete", { targetType: "ONLINE_RECORD", targetId: recordId })
  }
}

type InfraCodegenFiles = { files?: Array<{ path: string; content: string; type: string }> }

async function invokeInfraCodegen(method: "previewCodegen" | "generateCodegen", config: ReturnType<typeof toOnlineCodegenConfig>) {
  const result = await infraPlatformFacade[method](config, { caller: "online.definition" })
  if (!result.success) throw new ApiError("INTERNAL_ERROR", result.error ?? "infra codegen 调用失败")
  const files = (result.data as InfraCodegenFiles | undefined)?.files
  if (!Array.isArray(files)) throw new ApiError("INTERNAL_ERROR", "infra codegen 返回缺少 files")
  return files
}
