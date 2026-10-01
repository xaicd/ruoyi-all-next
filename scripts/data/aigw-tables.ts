/**
 * aigw 域中**非 codegen 产物**的表定义（低代码 CodegenConfig）。
 *
 * ⚠️ 为什么不并进 `partner-tables.ts`: 那个模块是 `scaffold-partner-domain.ts` 的输入，
 * 跑脚手架会**重写** codegen 产物。而这几张表的仓储是**手写的**，不能被覆盖 —— 所以单列。
 *
 * ⚠️ 列定义不是推出来的，是**从兄弟工程 `rome-all` 的迁移逐列转录**的
 * （gitee: xaicd/rome-all，与本仓同源、DDL 历史的另一分支）。转录前核对过:
 * 列名与 `packages/plugins/plugin-aigw/backend/repositories/*.repository.ts` 里的
 * `*Row` 接口**一一对应**（camelCase ↔ snake_case），长度与默认值照抄。
 *
 * 同源依据: 两边共享 clients/ deploy/ sql/ Dockerfile.domain；差别只在布局
 * （rome-all 用 `platform/`，本仓用 `packages/` + 插件）。本仓曾丢掉这两张表的 DDL，
 * 而 rome-all 保有它们。
 *
 * 与源仅有一处**有意偏差**（其余逐列照抄）: `tenant_id` 本仓写作 `VARCHAR(64)` 而非
 * 源里的 `TEXT` —— 本仓既有 30+ 张表都是这个宽度，单独一张用 TEXT 会成为例外。
 * 语义差别仅在于超长租户 ID 会被拒；tenant_id 由平台生成，不会超。
 */
import type { CodegenConfig } from "../../packages/domains/infra/backend/services/codegen-templates"

export const AIGW_TABLES: CodegenConfig[] = [
  {
    moduleName: "aigw",
    className: "AigwEnterprise",
    businessName: "入驻企业",
    parentMenuId: "aigw-dir",
    permissionPrefix: "aigw:enterprise",
    table: {
      name: "aigw_enterprise",
      comment: "AI 网关入驻企业（转录自 rome-all 迁移）",
      columns: [
        { name: "id", type: "varchar", tsType: "string", nullable: false, comment: "主键ID", isPk: true },
        { name: "tenant_id", type: "varchar", maxLength: 64, tsType: "string", nullable: false, comment: "租户ID" },
        { name: "name", type: "varchar", maxLength: 200, tsType: "string", nullable: false, comment: "企业名称" },
        { name: "code", type: "varchar", maxLength: 100, tsType: "string", nullable: false, comment: "企业编码" },
        { name: "credit_code", type: "varchar", maxLength: 64, tsType: "string", nullable: true, comment: "统一社会信用代码" },
        { name: "province", type: "varchar", maxLength: 50, tsType: "string", nullable: false, defaultValueTyped: "山东省", comment: "省份" },
        { name: "city", type: "varchar", maxLength: 50, tsType: "string", nullable: false, defaultValueTyped: "济南市", comment: "城市" },
        { name: "industry", type: "varchar", maxLength: 100, tsType: "string", nullable: false, defaultValueTyped: "互联网/软件", comment: "行业" },
        { name: "contact_name", type: "varchar", maxLength: 50, tsType: "string", nullable: true, comment: "联系人" },
        { name: "contact_phone", type: "varchar", maxLength: 20, tsType: "string", nullable: true, comment: "联系电话" },
        { name: "status", type: "varchar", maxLength: 20, tsType: "string", nullable: false, defaultValueTyped: "ACTIVE", comment: "状态" },
        { name: "created_at", type: "timestamp", tsType: "string", nullable: false, defaultSql: "CURRENT_TIMESTAMP", comment: "创建时间" },
        { name: "updated_at", type: "timestamp", tsType: "string", nullable: false, comment: "更新时间" },
      ],
    },
  },
  {
    moduleName: "aigw",
    className: "AigwQuota",
    businessName: "企业配额",
    parentMenuId: "aigw-dir",
    permissionPrefix: "aigw:quota",
    table: {
      name: "aigw_quota",
      comment: "AI 网关企业 token 配额（转录自 rome-all 迁移）",
      columns: [
        { name: "id", type: "varchar", tsType: "string", nullable: false, comment: "主键ID", isPk: true },
        { name: "tenant_id", type: "varchar", maxLength: 64, tsType: "string", nullable: false, comment: "租户ID" },
        { name: "enterprise_id", type: "text", tsType: "string", nullable: false, comment: "企业ID（rome-all 用 TEXT，保持忠实）" },
        { name: "enterprise_name", type: "varchar", maxLength: 200, tsType: "string", nullable: false, comment: "企业名称" },
        { name: "monthly_token_cap", type: "int", tsType: "number", nullable: false, defaultValueTyped: 0, comment: "月度 token 上限" },
        { name: "used_token_count", type: "int", tsType: "number", nullable: false, defaultValueTyped: 0, comment: "已用 token 数" },
        { name: "warn_threshold_ratio", type: "int", tsType: "number", nullable: false, defaultValueTyped: 80, comment: "预警阈值(%)" },
        { name: "auto_throttle", type: "boolean", tsType: "boolean", nullable: false, defaultValueTyped: false, comment: "是否自动限流" },
        { name: "status", type: "varchar", maxLength: 20, tsType: "string", nullable: false, defaultValueTyped: "ACTIVE", comment: "状态" },
        { name: "created_at", type: "timestamp", tsType: "string", nullable: false, defaultSql: "CURRENT_TIMESTAMP", comment: "创建时间" },
        { name: "updated_at", type: "timestamp", tsType: "string", nullable: false, comment: "更新时间" },
      ],
    },
  },
]
