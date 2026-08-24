/**
 * TenantIsolationPlugin — Kysely 全局租户隔离插件
 *
 * 挂在 getKyselyDb() 单例上，对走 Kysely 的所有查询自动注入租户过滤，
 * 开发者写 CRUD 无需手工拼 tenant_id（AGENTS.md §4.8 / L2）。
 *
 * 规则：
 * - 仅当存在租户上下文（getCurrentTenantId() 有值）且非平台上下文时注入；
 * - 表白名单 TENANT_TABLES（含 tenant_id 列的表，与 prisma schema 对齐）；
 * - select/update/delete：合并 where tenant_id = <当前租户>（已含则跳过，避免重复）；
 * - insert：自动追加 tenant_id 列（已显式提供则跳过）；
 * - 无上下文（open/relay/内部任务/测试）与平台上下文：零改动，行为兼容。
 */

import {
  AndNode,
  BinaryOperationNode,
  ColumnNode,
  DeleteQueryNode,
  InsertQueryNode,
  OperationNodeTransformer,
  PrimitiveValueListNode,
  SelectQueryNode,
  UpdateQueryNode,
  ValueNode,
  WhereNode,
  type ColumnNode as ColumnNodeType,
  type ExpressionNode,
  type FromNode,
  type IdentifierNode,
  type KyselyPlugin,
  type PluginTransformQueryArgs,
  type PluginTransformResultArgs,
  type QueryResult,
  type RootOperationNode,
  type TableNode,
  type UnknownRow,
} from "kysely"
import { getCurrentTenantId, isPlatformContext } from "../biz-tenant"

/**
 * 含 tenant_id 列、需要自动租户隔离的业务表清单（权威来源：prisma/schema.prisma）。
 * 新增含 tenant_id 列的表时，必须同步登记到此处，否则插件不覆盖。
 */
export const TENANT_TABLES = new Set<string>([
  "ai_access_token",
  "ai_channel",
  "ai_chat_conversation",
  "ai_chat_message",
  "ai_model",
  "ai_usage",
  "infra_api_access_log",
  "infra_api_error_log",
  "infra_data_source_config",
  "infra_message_outbox",
  "online_action",
  "online_definition",
  "online_field",
  "online_index",
  "online_managed_table",
  "online_policy",
  "online_record",
  "online_relation",
  "online_release",
  "online_revision",
  "online_schema_change",
  "online_test_session",
  "online_view",
  "online_workflow_binding",
  "system_dept",
  "system_login_log",
  "system_operate_log",
  "system_post",
  "system_role",
  "system_tenant_subscription",
  "system_user",
])

/** 提取查询主表名（处理 TableNode / SchemaNode / AliasedNode / IdentifierNode） */
function tableNameOf(table: unknown): string | undefined {
  if (!table || typeof table !== "object") return undefined
  const node = table as { kind?: string }
  if (node.kind === "TableNode") {
    const t = (table as TableNode).table as IdentifierNode
    return typeof t === "string" ? t : t?.name
  }
  if (node.kind === "SchemaNode") {
    const t = (table as { table: unknown }).table as TableNode
    return tableNameOf(t)
  }
  if (node.kind === "AliasedNode") {
    return tableNameOf((table as { node: unknown }).node)
  }
  if (node.kind === "IdentifierNode") return (table as IdentifierNode).name
  if (typeof (node as { name?: unknown }).name === "string") return (node as IdentifierNode).name
  return undefined
}

function mainTableOf(from: FromNode | TableNode | undefined): string | undefined {
  if (!from) return undefined
  if ((from as FromNode).kind === "FromNode") {
    const froms = (from as FromNode).froms ?? []
    return tableNameOf(froms[0])
  }
  return tableNameOf(from)
}

/** 检测表达式树中是否已引用指定列（用于跳过重复注入） */
class ColumnRefDetector extends OperationNodeTransformer {
  found = false
  constructor(private readonly columnName: string) {
    super()
  }
  override transformColumn(node: ColumnNodeType): ColumnNodeType {
    if (node.column?.name === this.columnName) this.found = true
    return super.transformColumn(node)
  }
}

function containsColumn(expression: ExpressionNode | undefined, column: string): boolean {
  if (!expression) return false
  const detector = new ColumnRefDetector(column)
  detector.transformNode(expression)
  return detector.found
}

function tenantPredicate(tenantId: string): ExpressionNode {
  return BinaryOperationNode.create(ColumnNode.create("tenant_id"), "=", ValueNode.create(tenantId))
}

class TenantIsolationTransformer extends OperationNodeTransformer {
  constructor(private readonly tenantId: string) {
    super()
  }

  override transformSelectQuery(node: SelectQueryNode): SelectQueryNode {
    const table = mainTableOf(node.from)
    if (table && TENANT_TABLES.has(table) && !containsColumn(node.where, "tenant_id")) {
      const predicate = tenantPredicate(this.tenantId)
      return { ...node, where: node.where ? WhereNode.create(AndNode.create(node.where, predicate)) : WhereNode.create(predicate) }
    }
    return super.transformSelectQuery(node)
  }

  override transformUpdateQuery(node: UpdateQueryNode): UpdateQueryNode {
    const table = mainTableOf(node.table)
    if (table && TENANT_TABLES.has(table) && !containsColumn(node.where, "tenant_id")) {
      const predicate = tenantPredicate(this.tenantId)
      return { ...node, where: node.where ? WhereNode.create(AndNode.create(node.where, predicate)) : WhereNode.create(predicate) }
    }
    return super.transformUpdateQuery(node)
  }

  override transformDeleteQuery(node: DeleteQueryNode): DeleteQueryNode {
    const table = mainTableOf(node.table)
    if (table && TENANT_TABLES.has(table) && !containsColumn(node.where, "tenant_id")) {
      const predicate = tenantPredicate(this.tenantId)
      return { ...node, where: node.where ? WhereNode.create(AndNode.create(node.where, predicate)) : WhereNode.create(predicate) }
    }
    return super.transformDeleteQuery(node)
  }

  override transformInsertQuery(node: InsertQueryNode): InsertQueryNode {
    const table = tableNameOf(node.into)
    if (table && TENANT_TABLES.has(table) && node.values && node.values.kind === "PrimitiveValueListNode") {
      const values = node.values as PrimitiveValueListNode
      const columns = values.columns as ColumnNodeType[]
      if (!columns.some((c) => c.column?.name === "tenant_id")) {
        const columnNode = ColumnNode.create("tenant_id")
        const valueNode = ValueNode.create(this.tenantId)
        const nextValues: PrimitiveValueListNode = {
          ...values,
          columns: [...columns, columnNode],
          values:
            values.values.length === 0
              ? [[valueNode]]
              : values.values.map((row) => [...row, valueNode]),
        }
        return { ...node, values: nextValues }
      }
    }
    return super.transformInsertQuery(node)
  }
}

export class TenantIsolationPlugin implements KyselyPlugin {
  transformQuery(args: PluginTransformQueryArgs): RootOperationNode {
    if (isPlatformContext()) return args.node
    const tenantId = getCurrentTenantId()
    if (!tenantId) return args.node
    return new TenantIsolationTransformer(tenantId).transformNode(args.node)
  }

  async transformResult(args: PluginTransformResultArgs): Promise<QueryResult<UnknownRow>> {
    return args.result
  }
}

export const tenantIsolationPlugin = new TenantIsolationPlugin()
