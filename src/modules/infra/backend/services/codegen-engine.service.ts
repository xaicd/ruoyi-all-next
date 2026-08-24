/**
 * Codegen Engine - 审阅式 CRUD 代码生成引擎（门面协调器）
 *
 * 核心设计：
 * - 架构分层：模板渲染全部由 `codegen-templates/` 独立模块处理
 * - 本服务专注：配置校验、模板调度分发、多端联动装配与 ZIP 归档输出
 */

import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import {
  type CodegenConfig,
  type CodegenOutput,
  generateAllCodegenOutputs,
  toCamel,
  toKebab,
  toPascal,
} from "./codegen-templates"

export type {
  CodegenActionType,
  CodegenAdvancedConfig,
  CodegenAdvancedField,
  CodegenConfig as CodegenEngineConfig,
  CodegenMasterDetailChild,
  CodegenQueryOperator,
  CodegenScene,
  CodegenTemplate,
  CodegenValidationRule,
  CodegenWidget,
} from "../../contract/codegen.types"

export type { CodegenConfig, CodegenOutput } from "./codegen-templates"

const IDENTIFIER = /^[a-z][a-z0-9_]{0,63}$/
const CLASS_NAME = /^[A-Z][A-Za-z0-9]{0,63}$/

function validateConfig(config: CodegenConfig): void {
  if (!IDENTIFIER.test(config.moduleName)) throw new Error("moduleName 必须为小写字母开头的模块标识")
  if (!CLASS_NAME.test(config.className)) throw new Error("className 必须为 PascalCase 标识")
  if (!config.businessName?.trim() || config.businessName.length > 100) throw new Error("businessName 必须为 1–100 个字符")
  if (!config.table?.name || !IDENTIFIER.test(config.table.name)) throw new Error("table.name 必须为小写字母开头的表标识")
}

export const CodegenEngineService = {
  /**
   * 生成该表的全套工程代码产物（全后端分层 + 前端组件 + RBAC SQL + 移动端 Clients）
   */
  generateCodes(config: CodegenConfig, options?: { includeClients?: boolean }): CodegenOutput[] {
    validateConfig(config)
    domainLog.event("infra.codegen.generated", {
      moduleName: config.moduleName,
      className: config.className,
      tableName: config.table.name,
    })
    return generateAllCodegenOutputs(config, options)
  },

  /** 兼容别名 */
  generate(config: CodegenConfig, options?: { includeClients?: boolean }): CodegenOutput[] {
    return this.generateCodes(config, options)
  },

  /** 兼容 RPC/API 的 previewCodegen */
  async previewCodegen(config: CodegenConfig, options?: { includeClients?: boolean }) {
    const files = this.generateCodes(config, options)
    return { files }
  },

  /** 兼容 RPC/API 的 generateCodegen */
  async generateCodegen(config: CodegenConfig, options?: { includeClients?: boolean }) {
    const files = this.generateCodes(config, options)
    return { files }
  },

  /**
   * 生成代码预览清单
   */
  preview(config: CodegenConfig, options?: { includeClients?: boolean }): Array<{ path: string; type: string; lineCount: number }> {
    const outputs = this.generateCodes(config, options)
    return outputs.map((o) => ({
      path: o.path,
      type: o.type,
      lineCount: o.content.split("\n").length,
    }))
  },

  /**
   * 生成 ZIP 包文件列表
   */
  async buildZipEntries(config: CodegenConfig, options?: { includeClients?: boolean }): Promise<Array<{ filename: string; content: string }>> {
    const outputs = this.generateCodes(config, options)
    return outputs.map((o) => ({
      filename: o.path,
      content: o.content,
    }))
  },
}

export const codegenEngineService = CodegenEngineService

// 保留老版本常用辅助别名兼容
export {
  generateAllCodegenOutputs,
  toCamel,
  toKebab,
  toPascal,
}
