import fs from "node:fs"
import path from "node:path"
import { CodegenEngineService } from "../src/modules/infra/backend/services/codegen-engine.service"
import type { CodegenConfig } from "../src/modules/infra/backend/services/codegen-templates"

const PARTNER_TABLES: CodegenConfig[] = [
  // 1. 渠道代理商主档案表
  {
    moduleName: "aigw",
    className: "AigwPartner",
    businessName: "渠道代理商",
    parentMenuId: "aigw-dir",
    permissionPrefix: "aigw:partner",
    table: {
      name: "aigw_partner",
      comment: "渠道代理商主档案表",
      columns: [
        { name: "id", type: "varchar", tsType: "string", nullable: false, comment: "代理商ID", isPk: true },
        { name: "partner_code", type: "varchar", tsType: "string", nullable: false, comment: "代理商编号", formValidation: "required", queryType: "LIKE" },
        { name: "name", type: "varchar", tsType: "string", nullable: false, comment: "代理商公司全称", formValidation: "required", queryType: "LIKE" },
        { name: "level", type: "varchar", tsType: "string", nullable: false, comment: "代理等级(GOLD/SILVER/BRONZE/GENERAL)" },
        { name: "registered_capital", type: "int", tsType: "number", nullable: false, comment: "注册资金(万元)" },
        { name: "credit_code", type: "varchar", tsType: "string", nullable: false, comment: "统一社会信用代码", queryType: "LIKE" },
        { name: "contact_name", type: "varchar", tsType: "string", nullable: false, comment: "负责人姓名" },
        { name: "contact_phone", type: "varchar", tsType: "string", nullable: false, comment: "负责人手机号" },
        { name: "region", type: "varchar", tsType: "string", nullable: true, comment: "代理区域" },
        { name: "commission_rate", type: "decimal", tsType: "number", nullable: false, comment: "签约分润比例" },
        { name: "promo_code", type: "varchar", tsType: "string", nullable: false, comment: "专属推广工号/短链码", queryType: "EQ" },
        { name: "balance", type: "decimal", tsType: "number", nullable: false, comment: "当前可提现佣金(元)" },
        { name: "total_commission", type: "decimal", tsType: "number", nullable: false, comment: "累计总佣金(元)" },
        { name: "status", type: "varchar", tsType: "string", nullable: false, comment: "合作状态" },
        { name: "tenant_id", type: "varchar", tsType: "string", nullable: false, comment: "租户ID" },
        { name: "create_time", type: "timestamp", tsType: "string", nullable: false, comment: "创建时间" },
      ],
    },
  },
  // 2. 代理商商机报备与防撞单锁定表
  {
    moduleName: "aigw",
    className: "AigwPartnerLead",
    businessName: "商机报备与锁定",
    parentMenuId: "aigw-dir",
    permissionPrefix: "aigw:partner-lead",
    table: {
      name: "aigw_partner_lead",
      comment: "商机报备与防撞单锁定表",
      columns: [
        { name: "id", type: "varchar", tsType: "string", nullable: false, comment: "商机ID", isPk: true },
        { name: "lead_no", type: "varchar", tsType: "string", nullable: false, comment: "商机报备编号", formValidation: "required", queryType: "LIKE" },
        { name: "partner_id", type: "varchar", tsType: "string", nullable: false, comment: "报备代理商ID", queryType: "EQ" },
        { name: "partner_name", type: "varchar", tsType: "string", nullable: false, comment: "代理商名称", queryType: "LIKE" },
        { name: "customer_name", type: "varchar", tsType: "string", nullable: false, comment: "报备政企客户全称", formValidation: "required", queryType: "LIKE" },
        { name: "credit_code", type: "varchar", tsType: "string", nullable: false, comment: "客户统一信用代码(排他查重)", formValidation: "required", queryType: "EQ" },
        { name: "contact_name", type: "varchar", tsType: "string", nullable: true, comment: "客户联系人" },
        { name: "contact_phone", type: "varchar", tsType: "string", nullable: true, comment: "客户联系电话" },
        { name: "estimated_scale", type: "varchar", tsType: "string", nullable: true, comment: "预计采购规模" },
        { name: "estimated_amount", type: "decimal", tsType: "number", nullable: true, comment: "预估合同金额(元)" },
        { name: "protection_days", type: "int", tsType: "number", nullable: false, comment: "商机保护期(天)" },
        { name: "expire_at", type: "varchar", tsType: "string", nullable: false, comment: "保护到期时间" },
        { name: "status", type: "varchar", tsType: "string", nullable: false, comment: "商机状态(PROTECTED/CONVERTED/EXPIRED/REJECTED)" },
        { name: "converted_enterprise_id", type: "varchar", tsType: "string", nullable: true, comment: "转签约后企业ID" },
        { name: "remark", type: "varchar", tsType: "string", nullable: true, comment: "跟进说明" },
        { name: "tenant_id", type: "varchar", tsType: "string", nullable: false, comment: "租户ID" },
        { name: "create_time", type: "timestamp", tsType: "string", nullable: false, comment: "创建时间" },
      ],
    },
  },
]

console.log(`[PARTNER-CODEGEN] Generating code for ${PARTNER_TABLES.length} partner domain tables...`)
let totalFiles = 0

for (const cfg of PARTNER_TABLES) {
  const outputs = CodegenEngineService.generateCodes(cfg, { includeClients: true })
  for (const out of outputs) {
    const fullPath = path.resolve(process.cwd(), out.path)
    fs.mkdirSync(path.dirname(fullPath), { recursive: true })
    fs.writeFileSync(fullPath, out.content, "utf-8")
    totalFiles++
  }
  console.log(`  -> Generated full-stack package for: ${cfg.className} (${cfg.businessName})`)
}

console.log(`[PARTNER-CODEGEN] Successfully generated ${totalFiles} files across all ${PARTNER_TABLES.length} tables.`)
