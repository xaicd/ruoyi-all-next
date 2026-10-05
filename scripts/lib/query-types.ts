/**
 * 「可查字段」的推导规则（**单一实现**，导入器与补齐脚本共用）。
 *
 * 为什么不放在 import-source-tables.ts 里导出: 那个文件顶层就跑 CLI ——
 * 别的脚本一 import 就会执行它（"导入即执行"，本仓已经踩过这个坑，AGENTS §19 有记）。
 */
/**
 * 推导"可查字段"（生成的仓储 FILTERS 与前端搜索栏都用它）。
 *
 * 为什么必须自动推导: 340 张表靠人逐列标不现实；而不标的后果是
 * **过滤参数被静默忽略**（生成的 FILTERS 为空），表现为"查了没过滤" ——
 * 实测在 erp_stock 上踩到（三条测试数值互相污染）。
 *
 * 这是**启发式**，所以刻意保守: 只认最常见的几类，并**限 5 个**，
 * 避免搜索栏被淹。真需要更精确时，由人在元数据里手工覆盖。
 */
const NON_QUERYABLE = new Set([
  "id", "tenant_id", "created_at", "updated_at", "created_by", "updated_by", "deleted", "creator", "updater",
])
const EQ_SUFFIX = /(_id|_ids)$/
const LIKE_NAMES = new Set(["name", "title", "code", "no", "sn", "subject", "mobile", "phone", "email", "keywords"])
const EQ_NAMES = new Set(["status", "type", "state", "category", "category_id", "level", "source", "biz_type", "kind"])

export function deriveQueryType(columnName: string): string | undefined {
  if (NON_QUERYABLE.has(columnName)) return undefined
  if (EQ_SUFFIX.test(columnName)) return "="
  if (LIKE_NAMES.has(columnName)) return "LIKE"
  if (EQ_NAMES.has(columnName)) return "="
  return undefined
}

