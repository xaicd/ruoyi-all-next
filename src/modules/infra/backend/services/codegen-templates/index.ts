// Codegen Templates Master Index & Orchestration Pipeline
import { type CodegenConfig, type CodegenOutput, toCamel } from "./common"
import { generateTypes } from "./types.template"
import { generateValidator } from "./validator.template"
import { generateRepository } from "./repository.template"
import { generateService } from "./service.template"
import { generateRpc } from "./rpc.template"
import { generateActions } from "./actions.template"
import { generateRoute, generateActionRoutes } from "./route.template"
import { generateApiClient } from "./frontend-api.template"
import { generateFormComponent } from "./frontend-form.template"
import { generateListPage } from "./frontend-list.template"
import { generateAppPage } from "./frontend-page.template"
import { generateTest } from "./test.template"
import { generateRbacSql } from "./rbac-sql.template"
import { generateClientH5 } from "./client-h5.template"
import { generateClientUniApp } from "./client-uniapp.template"
import { generateClientFlutter } from "./client-flutter.template"

export * from "./common"
export * from "./types.template"
export * from "./validator.template"
export * from "./repository.template"
export * from "./service.template"
export * from "./rpc.template"
export * from "./actions.template"
export * from "./route.template"
export * from "./frontend-api.template"
export * from "./frontend-form.template"
export * from "./frontend-list.template"
export * from "./frontend-page.template"
export * from "./test.template"
export * from "./rbac-sql.template"
export * from "./client-h5.template"
export * from "./client-uniapp.template"
export * from "./client-flutter.template"

export interface GenerateCodesOptions {
  includeClients?: boolean
}

/**
 * 完整组装并生成该数据表/模块的全套工程代码产物
 * 包含：后端 6 大分层 + 前端 4 大组件 + RBAC 增量 SQL + 单元测试 + Clients 多端 (可选)
 */
export function generateAllCodegenOutputs(config: CodegenConfig, options?: GenerateCodesOptions): CodegenOutput[] {
  const outputs: CodegenOutput[] = [
    generateTypes(config),
    generateValidator(config),
  ]

  if (config.onlineRuntime?.storageKind !== "MANAGED_TABLE") {
    outputs.push(generateRepository(config))
  }

  outputs.push(
    generateService(config),
    generateRpc(config),
    generateActions(config),
    generateRoute(config),
    ...generateActionRoutes(config),
    generateApiClient(config),
    generateFormComponent(config),
    generateListPage(config),
    generateAppPage(config),
    generateTest(config),
    generateRbacSql(config),
    {
      path: "codegen-manifest.json",
      type: "manifest" as any,
      content: JSON.stringify({
        moduleName: config.moduleName,
        className: config.className,
        rpcActions: [`ruoyi.cmd.${config.moduleName}.${toCamel(config.className)}.page`],
      }, null, 2),
    },
  )

  if (options?.includeClients !== false) {
    outputs.push(
      ...generateClientH5(config),
      ...generateClientUniApp(config),
      ...generateClientFlutter(config),
    )
  }

  return outputs
}
