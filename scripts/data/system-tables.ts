/**
 * system 域的表定义（低代码 CodegenConfig）。
 *
 * ⚠️ 与 `wms-tables.ts` / `partner-tables.ts` 不同: 这里的表**不是** codegen 产物，
 * 仓储是手写的（`packages/domains/system/backend/repositories/partner.repository.ts`）。
 * 之所以也放进元数据: 本仓表定义真源是低代码元数据（AGENTS §9.5），
 * 而 `system_partner` 此前**没有任何建表来源** —— 仓储在查、真实库却没有这张表。
 *
 * 列的**每一处类型都不是猜的**，依据是代码自己的声明与既有惯例:
 *   - 列名: 取仓储 Kysely 调用里的 snake_case 字面量（`partner_code` …）；
 *   - 语义/精度: 取 `SystemPartnerRow` 的行注释与**种子取值的实际形态**
 *     （`commissionRate: 0.20` 是比例 → decimal；`balance: 15200.00` 是金额 → decimal(18,2)；
 *     `registeredCapital: 1000` 是整数 → INTEGER；`masterPoolTokens: 1000000000` 是 10 亿 →
 *     超过 INT32 上限，必须 BIGINT）；
 *   - 数组字段: 仓储写入时显式 `JSON.stringify(...)`，故列是 TEXT 而非 JSONB；
 *   - 审计底座: 照抄同域既有表 `system_post` 的写法（TEXT 主键 / TIMESTAMP(3) / deleted）；
 *   - tenant_id 宽度: 照抄既有迁移的 VARCHAR(64)。
 *
 * 例外的两处**判断**（已在下面标注 `判断:`）: `region`/`contact_name` 等文本列的
 * 长度、以及 `commission_rate` 的精度位数 —— 这类只能按同域惯例取，改起来是纯 DDL 变更。
 */
import type { CodegenConfig } from "../../packages/domains/infra/backend/services/codegen-templates"

export const SYSTEM_TABLES: CodegenConfig[] = [
  {
    moduleName: "system",
    className: "SystemPartner",
    businessName: "渠道合作伙伴",
    parentMenuId: "system-dir",
    permissionPrefix: "system:partner",
    table: {
      name: "system_partner",
      comment: "渠道合作伙伴主档案（手写仓储，非 codegen 产物）",
      columns: [
        { name: "id", type: "varchar", tsType: "string", nullable: false, comment: "主键ID", isPk: true },
        { name: "partner_code", type: "varchar", tsType: "string", nullable: false, comment: "合作伙伴编号" },
        { name: "name", type: "varchar", tsType: "string", nullable: false, comment: "公司全称" },
        { name: "level", type: "varchar", tsType: "string", nullable: false, comment: "等级 GOLD/SILVER/BRONZE/STRATEGIC" },
        { name: "registered_capital", type: "int", tsType: "number", nullable: true, comment: "注册资本(万元)，种子取整数" },
        { name: "credit_code", type: "varchar", tsType: "string", nullable: false, comment: "统一社会信用代码" },
        { name: "contact_name", type: "varchar", tsType: "string", nullable: false, comment: "负责人姓名" },
        { name: "contact_phone", type: "varchar", tsType: "string", nullable: false, comment: "负责人手机号" },
        { name: "region", type: "varchar", tsType: "string", nullable: false, comment: "代理区域" },
        { name: "commission_rate", type: "decimal", tsType: "number", nullable: false, precision: 8, scale: 4, comment: "分润比例，如 0.20 代表 20%" },
        { name: "promo_code", type: "varchar", tsType: "string", nullable: false, comment: "专属推广码" },
        { name: "balance", type: "decimal", tsType: "number", nullable: false, precision: 18, scale: 2, comment: "当前收益钱包(元)，金额 2 位小数" },
        { name: "total_commission", type: "decimal", tsType: "number", nullable: false, precision: 18, scale: 2, comment: "累计分润(元)，金额 2 位小数" },
        { name: "allowed_tenant_ids", type: "text", tsType: "string", nullable: false, comment: "所辖租户授权范围，仓储写入时为 JSON 字符串故存 TEXT" },
        { name: "master_pool_tokens", type: "bigint", tsType: "number", nullable: false, comment: "批发算力采购总池；10 亿量级超过 INT32，故 BIGINT" },
        { name: "status", type: "varchar", tsType: "string", nullable: false, comment: "状态 ACTIVE/DISABLED" },
        { name: "tenant_id", type: "varchar", tsType: "string", nullable: false, comment: "租户ID" },
        { name: "created_at", type: "timestamp", tsType: "string", nullable: false, comment: "创建时间" },
        { name: "updated_at", type: "timestamp", tsType: "string", nullable: false, comment: "更新时间" },
      ],
    },
  },
]
