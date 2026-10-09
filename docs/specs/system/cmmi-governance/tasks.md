# Tasks: CMMI 全生命周期交付治理与 8 大工程技能体系

上游：`design.md`。规格变化必须退回规划阶段（§6.1）。

## 1. 任务依赖波次图 (Task Dependency Graph - Kiro Waves)

```json
{
  "waves": [
    { "id": "wave-1", "title": "地基与契约准备", "tasks": ["T1"], "dependsOn": [] },
    { "id": "wave-2", "title": "核心服务与数据流落地", "tasks": ["T2"], "dependsOn": ["wave-1"] },
    { "id": "wave-3", "title": "端到端测试与集成验证", "tasks": ["T3"], "dependsOn": ["wave-2"] }
  ]
}
```

## 2. 交互式任务清单 (Interactive Execution Tasks)

- [ ] **T1**: 沉淀 8 大 CMMI 原生工程技能至 .agents/skills/ 并接入单一真源校验
  - 归属: `main`
  - 文件白名单: `.agents/skills/`
  - 验收要求: 必须携带提交标识 `[T1]` 并附带真实测试验证

- [ ] **T2**: 规范 docs/01~09 标准目录拓扑，落地真实交付资产并执行零假 Demo 留空清理
  - 归属: `main`
  - 文件白名单: `docs/01_management/, docs/03_design/, docs/05_verification/, docs/06_quality_assurance/, docs/07_release/, docs/08_sre/`
  - 验收要求: 必须携带提交标识 `[T2]` 并附带真实测试验证

- [ ] **T3**: 更新 CMMI 交付规约与 OpenWiki 百科词条，跑通 20 道质量门禁总检
  - 归属: `main`
  - 文件白名单: `docs/architecture/CMMI-PROCESS-ASSETS-AND-DELIVERY-STANDARD.md, scripts/sync-openwiki.cjs, wiki/cmmi/cmmi-lifecycle.md`
  - 验收要求: 必须携带提交标识 `[T3]` 并附带真实测试验证


## 3. CMMI 双向追溯与 Git 提交核实矩阵 (RTM & Git Trace)

> **两条硬规矩**（对齐 CMMI「主线-支线任务树」与「1 Task = 1 Commit」）:
> 1. **归属**必须写 `main`（主线）或某个已存在的任务 ID —— **不允许孤儿任务**
> 2. **文件白名单**必填（逗号分隔）；`-` 表示该任务不改文件（纯验证类）
>
> 完成度**不看"状态"列**，而是从 git 推导: commit message 带 `[T<ID>]`（方括号，避免误匹配）
> 且改动文件落在白名单内，才算这条任务真的做了（`npm run task:verify`）。

| ID | 归属 | 任务 | 文件白名单 | 状态 |
|---|---|---|---|---|
| T1 | main | 沉淀 8 大 CMMI 原生工程技能至 .agents/skills/ 并接入单一真源校验 | .agents/skills/ | 未开始 |
| T2 | main | 规范 docs/01~09 标准目录拓扑，落地真实交付资产并执行零假 Demo 留空清理 | docs/01_management/, docs/03_design/, docs/05_verification/, docs/06_quality_assurance/, docs/07_release/, docs/08_sre/ | 未开始 |
| T3 | main | 更新 CMMI 交付规约与 OpenWiki 百科词条，跑通 20 道质量门禁总检 | docs/architecture/CMMI-PROCESS-ASSETS-AND-DELIVERY-STANDARD.md, scripts/sync-openwiki.cjs, wiki/cmmi/cmmi-lifecycle.md | 未开始 |

## 4. 依赖说明

T1 → T2 → T3

## 5. 阶段状态

* 规划：`PLAN_APPROVED`（由 brief 展开）
* 开发：待开始
* 独立测试：待开始
