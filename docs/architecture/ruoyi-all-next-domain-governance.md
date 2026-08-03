# ruoyi-all-next 域治理声明表

更新时间：2026-08-03

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
| system | PARTIAL | Tier-A | React-radix | A | database-compatibility + ui-framework-governance + microservice-evolution | apps/ruoyi/ruoyi-all-next/src/backend/services/__tests__/system-online-user.service.test.ts | 单体内聚，先补真实会话存储后再拆分 |
| infra | PARTIAL | Tier-A | React-radix | A | database-compatibility + ui-framework-governance + microservice-evolution | apps/ruoyi/ruoyi-all-next/src/backend/services/__tests__/infra-services.test.ts | 单体内聚，保留调度与配置适配层 |
| bpm | PARTIAL | Tier-A | React-radix | A | database-compatibility + ui-framework-governance + microservice-evolution | apps/ruoyi/ruoyi-all-next/src/backend/services/__tests__/bpm-process.service.test.ts | 单体内聚，待流程实例增长后独立服务 |
| pay | PARTIAL | MIXED | React-radix | B | database-compatibility + ui-framework-governance + microservice-evolution | apps/ruoyi/ruoyi-all-next/src/backend/services/__tests__/domain-governance-baseline.test.ts | 优先拆支付网关与回调服务，避免交易链路耦合 |
| report | PARTIAL | Tier-A | React-radix | A | database-compatibility + ui-framework-governance + microservice-evolution | apps/ruoyi/ruoyi-all-next/src/backend/services/__tests__/domain-governance-baseline.test.ts | 单体内聚，后续按指标计算压力评估拆分 |
| mp | PARTIAL | MIXED | React-radix | B | database-compatibility + ui-framework-governance + microservice-evolution | apps/ruoyi/ruoyi-all-next/src/backend/services/__tests__/mp.service.test.ts | 拆账号治理与消息投递链路，降低第三方通道耦合 |
| member | PARTIAL | Tier-A | React-radix | A | database-compatibility + ui-framework-governance + microservice-evolution | apps/ruoyi/ruoyi-all-next/src/backend/services/__tests__/domain-governance-baseline.test.ts | 单体内聚，先统一会员模型再拆分 |
| mall | PARTIAL | MIXED | React-radix | B | database-compatibility + ui-framework-governance + microservice-evolution | apps/ruoyi/ruoyi-all-next/src/backend/services/__tests__/domain-governance-baseline.test.ts | 拆交易与促销子域，减少高峰耦合 |
| crm | PARTIAL | MIXED | React-radix | B | database-compatibility + ui-framework-governance + microservice-evolution | apps/ruoyi/ruoyi-all-next/src/backend/services/__tests__/crm.service.test.ts | 拆客户主数据与跟进任务中心，支撑独立发布节奏 |
| erp | PARTIAL | MIXED | React-radix | B | database-compatibility + ui-framework-governance + microservice-evolution | apps/ruoyi/ruoyi-all-next/src/backend/services/__tests__/erp.service.test.ts | 拆库存账本与采购订单服务，隔离事务密集链路 |
| wms | PARTIAL | MIXED | React-radix | B | database-compatibility + ui-framework-governance + microservice-evolution | apps/ruoyi/ruoyi-all-next/src/backend/services/__tests__/wms.service.test.ts | 拆仓库主数据与作业执行链路，隔离高频库存操作 |
| mes | PARTIAL | MIXED | React-radix | B | database-compatibility + ui-framework-governance + microservice-evolution | apps/ruoyi/ruoyi-all-next/src/backend/services/__tests__/mes.service.test.ts | 拆工单编排与生产报工链路，支撑独立扩展 |
| im | PARTIAL | MIXED | React-radix | B | database-compatibility + ui-framework-governance + microservice-evolution | apps/ruoyi/ruoyi-all-next/src/backend/services/__tests__/im.service.test.ts | 拆会话管理与消息审核链路，避免通信链路耦合 |
| ai | PARTIAL | MIXED | React-radix | B | database-compatibility + ui-framework-governance + microservice-evolution | apps/ruoyi/ruoyi-all-next/src/backend/services/__tests__/domain-governance-baseline.test.ts | 拆模型治理与推理网关，控制依赖爆炸 |
| iot | PARTIAL | MIXED | React-radix | B | database-compatibility + ui-framework-governance + microservice-evolution | apps/ruoyi/ruoyi-all-next/src/backend/services/__tests__/domain-governance-baseline.test.ts | 拆设备接入与规则引擎，隔离高吞吐链路 |
