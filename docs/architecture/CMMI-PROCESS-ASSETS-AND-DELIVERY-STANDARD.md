# CMMI 软件项目过程资产库与全生命周期交付物工程规范
# (CMMI Process Asset Library & Work Product Repository Standard)

> **版本基准**: CMMI V2.0 / V3.0 (DEV 视图) × 现代 Git/DevOps 交付流  
> **核心实践域 (Practice Areas)**: 需求开发与管理 (RDM)、技术解决方案 (TS)、验证与确认 (VV)、配置管理 (CM)、过程与产品质量保证 (PQA)、项目策划与监控 (PLAN/MC)  
> **核心哲学**: **过程资产工程化 (Process-as-Code)、交付证据物理化 (Evidence-First)、全链路双向可追溯 (End-to-End Traceability)**

---

## 一、 为什么必须彻底规范 CMMI 过程文档与交付物？

传统软件企业在落地 CMMI 过程体系时，最常陷入的致命陷阱是：
- ❌ **文档与代码割裂**：需求与设计写在内网共享盘的 Word/Excel 里，代码写在 Git 里，开发进度全靠嘴说；
- ❌ **评审流于形式**：上线前夕为了应付评估，通宵伪造补录数百页评审记录与测试报告；
- ❌ **资产无从追溯**：一个 Bug 出现，找不到当初是谁设计的、哪个需求引入的、测试用例为什么漏测。

在 `ruoyi-all-next` 现代软件工程体系中，我们拒绝纸面形式主义，将 CMMI 的严肃性与现代 Git/AI-Native 的高效性深度融合：
1. **文档即代码 (Docs-as-Code)**：所有过程文档、原型、设计稿与契约一律纳入 Git 统一配置管理；
2. **No Artifact, No Done**：任何阶段（Gate）的结项必须具备物理可检验的工程交付物；
3. **双向可追溯**：从用户需求 ➔ 设计规范 ➔ 原型 ➔ 代码 Commit ➔ 单元测试 ➔ 部署回滚 SOP，形成闭合链路。

---

## 二、 两级过程资产库架构 (Two-Tier Asset Hierarchy)

按照 CMMI 规范，资产库划分为 **组织级 (Organization PAL)** 与 **项目级 (Project Repository)** 两个层级：

```
                      【CMMI 两级过程资产库架构】

 ┌────────────────────────────────────────────────────────────────────────┐
 │ 1. 组织级过程资产库 (Organization Process Asset Library - PAL)          │
 │    • 归宿：企业统一基础规范库 / 本底座通用基建                             │
 │    • 包含：组织标准过程 (OSSP)、通用文档模板、检查单、代码规约、脚手架工具  │
 ├────────────────────────────────────────────────────────────────────────┤
 │ 2. 项目级配置与交付物库 (Project Work Product & Configuration Repo)   │
 │    • 归宿：当前商业工程仓库 (docs/ + packages/ + clients/)              │
 │    • 包含：具体项目立项、需求规格、原型、设计、源代码、测试用例、评审与上线记录 │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## 三、 CMMI 三库分离体系在 Git 工程中的物理映射

CMMI 强调配置项（Configuration Items, CI）必须实行 **开发库 (Dynamic)、受控库 (Controlled)、产品库 (Static)** 的三库分离管理：

```
                 【CMMI 三库在 Git 流水线中的落地映射】

      [日常功能开发]                 [评审通过 / 合并主干]             [版本封版发布]
  ┌───────────────────┐             ┌───────────────────┐          ┌───────────────────┐
  │   1. 开发库 (动态) │  Pull Request│   2. 受控库 (基线) │ Git Tag  │   3. 产品库 (静态) │
  │   (Working Area)  │ ──────────> │ (Controlled Base) │ ───────> │  (Product Area)   │
  │                   │  (同行评审)  │                   │ (生产发布)│                   │
  │ • 分支: feat/*    │             │ • 分支: main      │          │ • Tag: v1.0.0     │
  │ • docs/features/  │             │ • 冻结需求与架构   │          │ • 最终发布镜像     │
  │ • 允许频繁修改与草稿│             │ • 变更需走变更控制│          │ • 严禁任何反向篡改 │
  └───────────────────┘             └───────────────────┘          └───────────────────┘
```

1. **开发库 (Working / Dynamic Area)**：
   - 承载形式：特性开发分支（`feat/<name>`）、工作区 `docs/features/<name>/`；
   - 权限：项目组开发成员具备直接读写权限，允许草稿与反复修改。
2. **受控库 (Controlled / Baseline Area)**：
   - 承载形式：主干分支（`main`）、正式发布的规格目录（`docs/specs/`、各域 `contract/`）；
   - 规则：必须经过同行评审（Peer Review）与自动化门禁验证（`npm run check` 退出码 0），变更必须有 Issue/工单关联。
3. **产品库 (Product / Static Area)**：
   - 承载形式：生产 Release Tag（如 `v1.2.0`）、Docker 镜像产物仓库、正式交付归档包；
   - 规则：永久只读、绝对不可篡改。

---

## 四、 软件项目交付物完整目录结构与分类规范

项目根目录采用标准化七大工作产品（Work Products）分类存放体系：

```
ruoyi-all-next / [基于底座衍生的客户商业项目]
├── docs/
│   ├── 01_management/                  # 【1. 项目管理类工作产品 (PLAN / MC / DAR)】
│   │   ├── project-charter.md          #    项目立项书与范围说明书
│   │   ├── project-plan.md             #    项目综合管理计划 (进度、资源、预算)
│   │   ├── estimation-sheet.xlsx       #    功能点 (FP) 或工时估计模型表
│   │   ├── risk-register.md            #    风险登记册与缓解预案 (RSKM)
│   │   ├── dar-decision-records/       #    决策分析与解决方案记录 (DAR 竞品选型)
│   │   └── project-summary-report.md   #    项目结项与经验教训总结报告 (PCM)
│   │
│   ├── 02_requirements/                # 【2. 需求工程类工作产品 (RDM)】
│   │   ├── user-requirements.md        #    用户原始需求说明书 (URS)
│   │   ├── software-requirements.md    #    软件需求规格说明书 (SRS - EARS 句式)
│   │   ├── rtm-traceability-matrix.md  #    需求双向跟踪矩阵 (RTM: 需求↔设计↔用例)
│   │   └── non-functional-reqs.md      #    非功能性需求规范 (SLO/压测指标/安全性)
│   │
│   ├── 03_design/                      # 【3. 系统设计类工作产品 (TS)】
│   │   ├── architecture-design-hld.md  #    系统总体架构与概要设计说明书 (HLD)
│   │   ├── detailed-design-lld/        #    各子域详细设计说明书 (LLD)
│   │   ├── database-design-erd.md      #    数据库设计报告、物理 ERD 与索引规约
│   │   └── interface-contracts/        #    统一对外接口定义 (OpenAPI 3.1 / Proto)
│   │
│   ├── 04_features/ (或 features/)     # 【4. 迭代特性全息规格工作区 (Sprint Workspaces)】
│   │   └── <feature-name>/             #    具体特性的需求/设计/原型/任务全息内聚包
│   │       ├── brief.json              #    极简声明 Brief
│   │       ├── requirements.md         #    特性级需求
│   │       ├── design.md               #    特性级设计与状态机
│   │       ├── prototype.md            #    原型说明与线框模型
│   │       ├── assets/                 #    【原型视觉层】PNG/SVG 界面设计切图
│   │       ├── prototypes/             #    【原型交互层】HTML 可点击原型/Axure
│   │       ├── tasks.md                #    WBS 任务分解树与 1 Task = 1 Commit
│   │       └── evidence.json           #    过程门禁通过证据记录 (Evidence Ledger)
│   │
│   ├── 05_verification/                # 【5. 验证与确认类工作产品 (VV / Peer Review)】
│   │   ├── test-plan.md                #    软件测试总计划 (功能、性能、安全、兼容)
│   │   ├── test-cases/                 #    测试用例清单与测试矩阵
│   │   ├── peer-review-records/        #    同行评审纪要与检查单 (代码/设计审查)
│   │   ├── test-summary-report.md      #    自动化与手动测试总结报告
│   │   └── defect-tracking-ledger.md   #    缺陷跟踪与收敛趋势台账 (Bugs)
│   │
│   ├── 06_quality_assurance/           # 【6. 过程与产品质量保证工作产品 (PQA / CM)】
│   │   ├── qa-audit-plan.md            #    质量保证检查计划
│   │   ├── process-audit-reports/      #    过程合规性审计报告 (周/月度)
│   │   ├── configuration-audit.md      #    物理与功能配置审计报告 (PCA/FCA)
│   │   └── gate-evidence-trace.json    #    自动化门禁执行与数字指纹证据链
│   │
│   ├── 07_release/                     # 【7. 发布、部署与交付类工作产品 (TRANS)】
│   │   ├── release-notes.md            #    产品版本发布说明书
│   │   ├── user-operation-manual.md    #    用户操作与培训手册
│   │   ├── system-deployment-sop.md    #    生产环境安装部署与配置手册
│   │   └── rollback-runbook.json       #    生产割接故障秒级回滚 SOP 预案
│   │
│   ├── 08_sre/                         # 【8. 站点可靠性工程与稳定性保障 (SRE / CAM / SCON)】
│   │   ├── 01_slo_sli_metrics/         #    SLO/SLI 矩阵、错误预算策略、P1~P4 告警阈值路由
│   │   ├── 02_observability_apm/       #    APM 分布式链路追踪、业务日志 JSON 与不可变审计脱敏规约
│   │   ├── 03_iaas_paas_infra/         #    IaaS 算力网络存储与 PaaS (K8s/DB/Redis/NATS) 拓扑台账
│   │   ├── 04_scheduled_tasks/         #    分布式定时任务注册台账、排他锁设计与漏跑补偿预案
│   │   ├── 05_disaster_recovery/       #    多活容灾双活架构、混沌工程注入用例与演练记录 (RTO/RPO)
│   │   └── 06_incidents_postmortem/    #    7x24 On-Call 排班、1-5-10 应急 SOP 与无指责复盘报告 (5-Whys)
│   │
│   └── 09_operations/                  # 【9. 业务持续运营与服务交付 (BizOps / DataOps / CMMI-SVC)】
│       ├── 01_biz_ops/                 #    租户开通审批、业务活动营销配置 SOP、BPM 审批流治理
│       ├── 02_data_ops/                #    日终/月终财务与业务对账平账台账、指标语义层变更台账
│       ├── 03_inspection/              #    日常系统健康巡检报告 (对齐 npm run agent:ops health)
│       └── 04_agent_ops/               #    AI 数字员工运营台账、自动化造数与清数凭据 (seed/purge)
│
├── packages/plugins/                   # 【领域工程源码实现】(遵循模块化与第一方插件)
└── clients/                            # 【多端客户端源码实现】(Expo / 移动端)
```

### 4.1 本底座已落地的基准工作产品对照表 (Reference Exemplar Work Products in Base)

为杜绝“纸面规范无成果”的空洞现象，本工程在 `docs/01_management` 至 `09_operations` 目录已全面落地 36 项技能驱动的高阶工程交付物范例：

| CMMI 阶段 | 驱动技能 (Skills) | 物理工作产品路径 | 核心业务与技术要点 |
|---|---|---|---|
| **01_management** | `dar-decision-matrix` | `docs/01_management/dar-decision-records/DAR-20261009-MESSAGE-BUS-PROTOCOL.md`<br/>`docs/01_management/project-charter.md`<br/>`docs/01_management/risk-register.md` | 自研 NATS 消息协议 vs Kafka/RabbitMQ 加权权衡矩阵、项目立项书、RSKM 风险登记册 |
| **02_requirements** | `ears-spec-writer` | `docs/02_requirements/srs/SRS-EARS-MALL-ORDER-CAS.md`<br/>`docs/02_requirements/software-requirements.md` (指向 SRS)<br/>`docs/02_requirements/rtm-traceability-matrix.md` | IEEE 29148 / EARS 5态需求规格说明（商城下单与 CAS 原子预占）、需求双向跟踪矩阵 |
| **03_design** | `adr-architect`<br/>`archify`<br/>`database-design` | `docs/03_design/adr/ADR-0001-MULTI-TENANT-KYSELY-AST.md`<br/>`docs/03_design/adr/ADR-0002-FIRST-PARTY-PLUGIN-ISOLATION.md`<br/>`docs/03_design/diagrams/ruoyi-architecture.arch.json`<br/>`docs/03_design/database-design-erd.md` | MADR 架构决策记录、Archify 交互式路径追踪架构图、8 大底座审计字段 ERD 规约 |
| **05_verification** | `mutation-tester`<br/>`automated-testing` | `docs/05_verification/mutation/MUTATION-TESTING-REPORT-INVENTORY-CAS.md`<br/>`docs/05_verification/test-summary-report.md` | Stryker AST 变异测试打假报告（MSI 96.8%，击杀 120/124）、SpaceX 级真实数据库测试报告（416 用例全绿） |
| **06_quality_assurance** | `compliance-auditor` | `docs/06_quality_assurance/audit/PCA-FCA-COMPLIANCE-AUDIT-v1.1.0.md`<br/>`docs/06_quality_assurance/configuration-audit.md` (指向 FCA/PCA)<br/>`docs/06_quality_assurance/gate-evidence-trace.json` | v1.1.0 功能配置审计 (FCA) 与物理配置审计 (PCA) 报告、20 道质量门禁数字凭证链 |
| **07_release** | `devops` | `docs/07_release/RELEASE_NOTES_v1.1.0.md`<br/>`docs/07_release/release-notes.md` (指向 v1.1.0)<br/>`docs/07_release/system-deployment-sop.md`<br/>`docs/07_release/rollback-runbook.json` | v1.1.0 版本发布说明、生产安装部署割接 SOP、秒级自动回滚 Runbook |
| **08_sre** | `sre-slo-manager`<br/>`postmortem-analyzer`<br/>`strix-penetration-testing` | `docs/08_sre/01_slo_sli_metrics/SLO-SLI-ERROR-BUDGET-MATRIX.md`<br/>`docs/08_sre/06_incidents_postmortem/POSTMORTEM-20261009-INVENTORY-RACE-CONDITION.md`<br/>`docs/08_sre/security-reports/STRIX-PENTEST-POC-AUDIT.md` | Google SRE 99.95% SLO 矩阵与多燃烧率告警、无指责 5-Whys 根因复盘报告、Strix 60k★ 自主红队 PoC 审计 (Grade A+) |
| **09_operations** | `financial-reconciliation-agent` | `docs/09_operations/02_data_ops/DAILY-RECONCILIATION-REPORT-20261009.md`<br/>`docs/09_operations/inspection/SYSTEM-HEALTH-INSPECTION-20261009.md` | 银行级三方日终对账与复式记账平衡报告（$\sum\text{Debit}\equiv\sum\text{Credit}$）、全域 17 领域健康巡检报告 |

---

## 五、 原型 (Prototype) 在 CMMI 中的合规性定位

在很多团队的传统误区中，认为 CMMI 只需要厚厚的技术文档，原型“不算数”。

**在现代 CMMI 评估准则中，这是严重错误的**：
1. **RDM (需求开发) 实践域明确要求**：必须具备「操作概念与操作方案 (Operational Concept)」，原型是验证用户需求真实性最高效的输入物；
2. **TS (技术解决方案) 实践域要求**：关键交互与高风险技术点必须进行「概念验证与原型验证 (POC / UI Prototyping)」；
3. **物理归属硬规矩**：
   - 静态视觉原型（切图、设计稿）：归纳在特性的 `assets/*.png`；
   - 动态交互原型（HTML 文件、Axure 站点）：归纳在特性的 `prototypes/*.html`；
   - 原型审查结论：作为需求基线评审的一部分，记录在 `prototype.md` 与同行评审记录中。

---

## 六、 研发全流程过程交付物矩阵表 (Checklist)

| 阶段 / 实践域 | 阶段目标 | 必须产出的物理交付物 (Work Products) | 质量门禁 (Gate) 判定标准 |
|---|---|---|---|
| **P1. 立项与策划 (PLAN/RSKM)** | 范围明确、可行性成立 | • `project-charter.md` (立项书)<br/>• `project-plan.md` (计划)<br/>• `risk-register.md` (风险登记册) | G0：项目立项审批通过，工时与范围基线确立 |
| **P2. 需求与原型 (RDM)** | 需求清晰、交互定稿 | • `requirements.md` (SRS 说明书)<br/>• `prototype.md` + `assets/*.png` + `prototypes/*.html`<br/>• `rtm-traceability-matrix.md` (RTM 矩阵) | G1：需求与原型同行评审签字，无未闭环缺陷 |
| **P3. 架构与设计 (TS/DAR)** | 接口冻结、数据模型就绪 | • `architecture-design-hld.md` (架构)<br/>• `database-design-erd.md` (表结构)<br/>• `packages/plugins/<domain>/contract/` (API 契约) | G2：跨域依赖对齐，API 契约编译检查 100% PASS |
| **P4. 构造与编码 (TS/CM)** | 代码实现、分支合流 | • 业务源码（遵循单函数 <50 行，单文件 <200 行）<br/>• Commit 带 `[T1]` 任务标签<br/>• `tasks.md` 任务推进表 | G3：代码编译 0 报错，静态分析 `npm run check` PASS |
| **P5. 验证与确认 (VV/PQA)** | 零缺陷漏网、状态机收敛 | • `test-summary-report.md` (测试总结报告)<br/>• 自动化单测/集成测试用例 (100% 真实库)<br/>• 同行评审记录单 | G4：全量单测通过，0 Blocker/0 High 遗留缺陷 |
| **P6. 验收与交付 (TRANS/PCM)** | 部署就绪、回滚可控 | • `release-notes.md` (发布说明)<br/>• `system-deployment-sop.md` (部署指南)<br/>• `rollback-runbook.json` (一键回滚 SOP) | G5：安全扫描无高危，压测达标，回滚演练通过 |
| **P7. 站点可靠性保障 (SRE / CAM / SCON)** | 系统稳定、全维可观测、故障可愈 | • `sli-slo-matrix.md` + 错误预算<br/>• `apm-tracing-topology.md` (Trace透传规约)<br/>• `iaas-paas-inventory.md` (三层资产台账)<br/>• `batch-job-registry.md` (定时任务排他锁台账)<br/>• `postmortem-reports/` (无指责复盘报告) | G6_SRE：三层黄金指标覆盖率 100%，APM 链路注入率 100%，容灾演练 RTO 达标 |
| **P8. 持续运营与对账 (BizOps / DataOps / CMMI-SVC)** | 业务顺畅、平账对齐、审批闭环 | • `daily-reconciliation-ledger.md` (平账凭证)<br/>• `tenant-onboarding-ledger.md` (租户台账)<br/>• `bpm-workflow-adjustments.md` (HITL人工节点记录)<br/>• `task-execution-records.jsonl` (数字员工流水) | G7_OPS：对账无长款短款、核心审批流程回滚演练通过、数字员工造数清数通过 |

---

## 七、 落地执行原则 (Summary)

1. **先建目录，后提代码**：启动大型项目或全新业务系统时，严格按上述 `docs/` 目录组织资产，严禁各模块文档乱飞；
2. **轻量自动化，重在可核验**：不追求文档的篇幅冗长，追求每份文档有结构、有版本、有责任人、有 Git Commit 关联；
3. **真实证据沉淀**：每次门禁检查产生的数据（如 `evidence.json`、测试覆盖率、安全扫描结果）统一沉淀为过程质量凭证，随时可迎检外部 CMMI 机构审核或甲方工程验收。

---

## 八、 制品分发矩阵：Git 源码库与 GitHub / Gitee Releases 的协同分工

解决“二进制/安装包/压缩归档严禁入 Git，但用户又需要下载”的唯一工业标准解法，就是**将 Git 代码库与 Release 发行版严格解耦分工**：

```
┌──────────────────────────────────────────────────────────┐
│                   ruoyi-all-next 工程总矩阵              │
└─────────────┬──────────────────────────────┬─────────────┘
              │                              │
     【纯文本源资产】 (Git Tracked)        【二进制分发资产】 (Release Assets)
              │                              │
     ├── 业务与框架源码 (TS/Next.js/React)   ├── 移动端安装包 (*.apk, *.ipa, *.aab)
     ├── Schema/DSL/Prisma Migrations        ├── 离线脱机骨架包 (*-skeleton.tar.gz)
     ├── CMMI 01~09 过程规范文档             ├── 预填充演示/压测数据库快照 (*.db.zip)
     └── 轻量原型线框/切图 (assets/prototypes)├── OpenAPI 契约全景包 (openapi.json)
                                             └── 完整性哈希清单 (SHA256SUMS.txt)
                                                     │
                                   ┌─────────────────┴─────────────────┐
                                   ▼                                   ▼
                           【GitHub Releases】                  【Gitee Releases】
                         (全球开发者/CI/CD生态)               (国内网络直连/政企内网加速)
```

### 1. 为什么必须同时利用 GitHub Releases 与 Gitee Releases？
1. **GitHub Releases（全球开源与 AI 生态）**：
   - 全球开发者、跨国企业与 Cursor/Claude/Cline Agent 默认调用的首选下载点；
   - 深度集成 GitHub Actions 流水线（`.github/workflows/release.yml`），打 Tag 即自动构建发布并生成 Release Notes。
2. **Gitee Releases（国内极速直连与政企客户）**：
   - RuoYi 是 Gitee 最顶级的现象级开源项目（数十万 Star），拥有极其庞大的国内企业开发者群体；
   - 国内开发者与政企内网访问 GitHub 经常出现网络断流、404、5KB/s 龟速。通过 Gitee Releases 分发 APK、SQL 离线包与骨架压缩包，国内用户**百兆光纤免翻墙极速下载**，体验质感直接拉满！

### 2. 自动化发布流水线联动 (Release Pipeline)
- 开发者或产品负责人在主分支打版本标签（如 `git tag v1.0.0 && git push origin v1.0.0`）；
- 触发 `.github/workflows/release.yml`，全自动完成：
  1. 运行 19 项门禁自检与 40 项单元测试（100% PASS 门禁）；
  2. 构建生产应用并打包离线纯净骨架包（自动剔除 `.git`、`node_modules`、运行时 `data/*.db`）；
  3. 生成 SHA256 校验和并上传至 **GitHub Releases**；
  4. 同步 Tag 至 Gitee 仓库镜像，将安装包挂载至 **Gitee 发行版 (Release)**。

