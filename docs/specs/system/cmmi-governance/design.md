# 设计：CMMI 全生命周期交付治理与 8 大工程技能体系

上游：`docs/features/cmmi-governance/requirements.md`（本文件不得反向修改需求）

## 1. 架构

过程资产规约 docs/architecture/CMMI-PROCESS-ASSETS-AND-DELIVERY-STANDARD.md 作为顶层标准，驱动 .agents/skills/ 原生技能与 01~09 标准资产目录，由 scripts/sync-openwiki.cjs 自动同步至 OpenWiki 知识库。

## 2. 数据

| 表 | 说明 |
|---|---|
| `-` | 本特性为系统工程治理规范增强，不涉及新增业务数据库表 |

表定义真源 = 低代码元数据（AGENTS §9.5），不手写 DDL。

## 3. 关键不变量

1. **No Artifact, No Done** —— 每个阶段必须交付真实物理工程资产，严禁口头声明完工
2. **实事求是留空准则** —— 无真实生产事故与流水账单的目录保持严格留空，杜绝伪造假 Demo 糊弄

## 4. UI

* 纯工程治理增强，无管理端与 C 端业务 UI 页面变更

## 5. 运维与运营

* 门禁链：npm run check 验证 20 道质量门禁与技能规范
* 测试：npm run test:matrix 真实数据库测试套件验证
* 知识库同步：npm run openwiki:sync 动态更新 CMMI 百科词条

## 6. 风险

| 风险 | 处理 |
|---|---|
| 过程文档与实际工程代码脱节漂移 | 通过 check-engineering-standards 与 openwiki:check 自动化门禁脚本进行静态校验 |
