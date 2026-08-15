import { ApiError } from "@/modules/shared/backend/http/api-error"
import type { AuthContext } from "@/modules/shared/backend/auth/context"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { KyselyOnlineDefinitionRepository } from "../adapters/persistence/online-definition.repository"
import { KyselyOnlineSchemaPlanRepository } from "../adapters/persistence/online-schema-plan.repository"
import { KyselyOnlineRuntimeRepository } from "../adapters/persistence/online-runtime.repository"
import type { ApproveOnlineSchemaPlanInput, CreateOnlineDefinitionInput, CreateOnlineRuntimeRecordInput, CreateOnlineSchemaPlanInput, OnlineDefinitionPageInput, OnlineRuntimeRecordPageInput, PublishOnlineRevisionInput, RollbackOnlineDefinitionInput, UpdateOnlineDefinitionInput, UpdateOnlineRevisionInput, UpdateOnlineRuntimeRecordInput, ValidateOnlineRevisionInput } from "../validators"

function tenantScope(auth: AuthContext): { tenantId: string; actorId: string } {
  if (!auth.tenantId) throw new ApiError("FORBIDDEN", "Online Definition 必须在租户上下文中管理")
  return { tenantId: auth.tenantId, actorId: auth.userId }
}

export class OnlineDefinitionService {
  static async page(auth: AuthContext, input: OnlineDefinitionPageInput) {
    const { tenantId } = tenantScope(auth)
    const data = await KyselyOnlineDefinitionRepository.page({ tenantId, page: input.page ?? 1, pageSize: input.pageSize ?? 20 })
    return { ...data, phase: "METADATA_READY" as const, persistence: "POSTGRESQL_REQUIRED" as const }
  }

  static async create(auth: AuthContext, input: CreateOnlineDefinitionInput) {
    const scope = tenantScope(auth)
    const data = await KyselyOnlineDefinitionRepository.create({ ...scope, code: input.code!, name: input.name!, modelType: input.modelType! })
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

  static async updateDraft(auth: AuthContext, code: string, input: UpdateOnlineRevisionInput) {
    const scope = tenantScope(auth)
    const data = await KyselyOnlineDefinitionRepository.updateDraft({ ...scope, code, expectedLockVersion: input.expectedLockVersion!, model: input.model, interaction: input.interaction, policy: input.policy, workflow: input.workflow })
    domainLog.audit("online.revision.update", { targetType: "ONLINE_DEFINITION", targetId: data.id })
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
    return KyselyOnlineRuntimeRepository.pageRecords({ ...tenantScope(auth), definitionCode: code, sessionId, page: input.page, pageSize: input.pageSize })
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
