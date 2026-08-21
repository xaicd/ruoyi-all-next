# ruoyi-all-next 域治理声明表

更新时间：2026-08-20

## 1. 说明

本表用于声明每个能力域的：

1. 数据库兼容等级
2. UI 框架治理组合
3. 微服务演进阶段
4. 必用 Skill 绑定
5. 测试基线引用
6. 拆分说明（B/C 阶段必填）

规则：

1. 在能力矩阵中状态为 PARTIAL 或 DONE 的域，必须在本表中有声明。
2. 缺少声明的域不得对外宣称“标准化完成”。

## 2. 声明表

| 域 | 能力状态 | DB Tier | UI Stack | 微服务阶段 | Skill 绑定 | TestRefs | SplitNote |
|---|---|---|---|---|---|---|---|
| system | PARTIAL | Tier-A | React-radix | A | database-compatibility + ui-framework-governance + microservice-evolution | src/modules/system/backend/services/__tests__/online-user.service.test.ts | 单体内聚，先补真实会话存储后再拆分 |
| infra | PARTIAL | Tier-A | React-radix | A | database-compatibility + ui-framework-governance + microservice-evolution | src/modules/infra/backend/services/__tests__/infra-services.test.ts | 单体内聚，保留调度与配置适配层 |
| bpm | PARTIAL | Tier-A | React-radix | A | database-compatibility + ui-framework-governance + microservice-evolution | src/modules/bpm/backend/services/__tests__/process.service.test.ts | 单体内聚，待流程实例增长后独立服务 |
| pay | PARTIAL | MIXED | React-radix | B | database-compatibility + ui-framework-governance + microservice-evolution | src/modules/pay/backend/services/__tests__/pay.module.service.test.ts | 已支持 API-only 独立打包/运行/部署（`npm run domain:up -- pay`）；数据库仍共享，后续再拆支付网关与回调服务 |
| report | PARTIAL | Tier-A | React-radix | A | database-compatibility + ui-framework-governance + microservice-evolution | src/modules/report/backend/services/__tests__/report.module.service.test.ts | 单体内聚，后续按指标计算压力评估拆分 |
| mp | PARTIAL | MIXED | React-radix | B | database-compatibility + ui-framework-governance + microservice-evolution | src/modules/mp/backend/services/__tests__/mp-services.test.ts | 拆账号治理与消息投递链路，降低第三方通道耦合 |
| member | PARTIAL | Tier-A | React-radix | A | database-compatibility + ui-framework-governance + microservice-evolution | src/modules/member/backend/services/__tests__/member.module.service.test.ts | 单体内聚，先统一会员模型再拆分 |
| mall | PARTIAL | MIXED | React-radix | B | database-compatibility + ui-framework-governance + microservice-evolution | src/modules/mall/backend/services/__tests__/mall.module.service.test.ts | 拆交易与促销子域，减少高峰耦合 |
| crm | PARTIAL | MIXED | React-radix | B | database-compatibility + ui-framework-governance + microservice-evolution | src/modules/crm/backend/services/__tests__/crm.module.service.test.ts | 拆客户主数据与跟进任务中心，支撑独立发布节奏 |
| erp | PARTIAL | MIXED | React-radix | B | database-compatibility + ui-framework-governance + microservice-evolution | src/modules/erp/backend/services/__tests__/erp.module.service.test.ts | 拆库存账本与采购订单服务，隔离事务密集链路 |
| wms | PARTIAL | MIXED | React-radix | B | database-compatibility + ui-framework-governance + microservice-evolution | src/modules/wms/backend/services/__tests__/wms.module.service.test.ts | 拆仓库主数据与作业执行链路，隔离高频库存操作 |
| mes | PARTIAL | MIXED | React-radix | B | database-compatibility + ui-framework-governance + microservice-evolution | src/modules/mes/backend/services/__tests__/mes.module.service.test.ts | 拆工单编排与生产报工链路，支撑独立扩展 |
| im | PARTIAL | MIXED | React-radix | B | database-compatibility + ui-framework-governance + microservice-evolution | src/modules/im/backend/services/__tests__/im.module.service.test.ts | 拆会话管理与消息审核链路，避免通信链路耦合 |
| ai | PARTIAL | MIXED | React-radix | B | database-compatibility + ui-framework-governance + microservice-evolution | src/modules/ai/backend/services/__tests__/ai.module.service.test.ts | 拆模型治理与推理网关，控制依赖爆炸 |
| iot | PARTIAL | MIXED | React-radix | B | database-compatibility + ui-framework-governance + microservice-evolution | src/modules/iot/backend/services/__tests__/iot.module.service.test.ts | 拆设备接入与规则引擎，隔离高吞吐链路 |
| online | PARTIAL | MIXED | React-radix | B | database-compatibility + ui-framework-governance + microservice-evolution | src/modules/online/backend/application/online-codegen.adapter.test.ts | 已支持独立打包；跨域 codegen 走 `infraFacade`，字典走 `systemFacade`，数据库仍共享 |
