import type { OnlineModelType } from "./online-definition.contract"
import type { OnlineInteractionIR } from "./online-interaction.compiler"
import type { OnlineModelIR } from "./online-schema-plan.contract"

export function validateOnlineModelAggregate(modelType: OnlineModelType, definitionCode: string, model: OnlineModelIR, interaction: OnlineInteractionIR): void {
  const fields = new Map(model.fields.map((field) => [field.code, field]))
  if (model.storage.kind !== "GENERIC_RECORD") throw new Error("当前阶段仅允许 GENERIC_RECORD 存储")
  if (!model.fields.length) throw new Error("数据模型至少需要一个字段")

  if (modelType === "SINGLE") {
    if (interaction.tree || interaction.masterDetail) throw new Error("SINGLE 模型不能配置 tree 或 masterDetail")
    return
  }

  if (modelType === "TREE") {
    if (!interaction.tree || interaction.masterDetail) throw new Error("TREE 模型必须且只能配置 tree 语义")
    const parent = fields.get(interaction.tree.parentField)
    if (!parent) throw new Error(`TREE parentField ${interaction.tree.parentField} 不存在`)
    if (!["string", "integer"].includes(parent.type)) throw new Error("TREE parentField 仅支持 string 或 integer 字段")
    if (interaction.tree.sortField && !fields.has(interaction.tree.sortField)) throw new Error(`TREE sortField ${interaction.tree.sortField} 不存在`)
    return
  }

  if (!interaction.masterDetail || interaction.tree) throw new Error("MASTER_DETAIL 模型必须且只能配置 masterDetail 语义")
  const childCodes = new Set<string>()
  for (const child of interaction.masterDetail.children) {
    if (child.targetDefinitionCode === definitionCode) throw new Error("MASTER_DETAIL 当前阶段不允许定义自引用子表")
    if (!childCodes.add(child.code)) throw new Error(`MASTER_DETAIL 子定义 code 不可重复：${child.code}`)
  }
}
