// 由 scripts/import-source-tables.ts 从源框架 yudao-module-report 导入，**勿手改**。
// 列可空为启发式推断（Java 基本类型/包装类型），审计底座字段按本仓约定补齐。
import type { CodegenConfig } from "../packages/domains/infra/backend/services/codegen-templates"

export const REPORT_TABLES: CodegenConfig[] = [
  {
    moduleName: "report",
    className: "GoViewProject",
    businessName: "GoViewProject（源框架导入）",
    parentMenuId: "report-dir",
    permissionPrefix: "report:go_view_project",
    table: {
      name: "report_go_view_project",
      comment: "GoViewProject（源框架导入）",
      columns: [
        {"name":"id","type":"bigint","tsType":"number","nullable":false,"comment":"编号，数据库自增","isPk":true,"nullableInferred":true},
        {"name":"name","type":"varchar","tsType":"string","nullable":true,"comment":"项目名称","nullableInferred":true},
        {"name":"pic_url","type":"varchar","tsType":"string","nullable":true,"comment":"预览图片 URL","nullableInferred":true},
        {"name":"content","type":"varchar","tsType":"string","nullable":true,"comment":"报表内容","nullableInferred":true},
        {"name":"status","type":"int","tsType":"number","nullable":true,"comment":"发布状态","nullableInferred":true},
        {"name":"remark","type":"varchar","tsType":"string","nullable":true,"comment":"项目备注","nullableInferred":true},
        {"name":"tenant_id","type":"varchar","tsType":"string","nullable":false,"comment":"租户ID","nullableInferred":false},
        {"name":"created_by","type":"varchar","tsType":"string","nullable":true,"comment":"创建者","nullableInferred":true},
        {"name":"created_at","type":"timestamp","tsType":"string","nullable":false,"comment":"创建时间","nullableInferred":true},
        {"name":"updated_by","type":"varchar","tsType":"string","nullable":true,"comment":"更新者","nullableInferred":true},
        {"name":"updated_at","type":"timestamp","tsType":"string","nullable":false,"comment":"更新时间","nullableInferred":true},
        {"name":"deleted","type":"boolean","tsType":"boolean","nullable":false,"defaultValueTyped":false,"comment":"逻辑删除","nullableInferred":false},
      ],
    },
  },
]
