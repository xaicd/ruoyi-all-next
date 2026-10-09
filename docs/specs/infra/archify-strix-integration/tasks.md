# 任务：开源顶流技能吸收：Archify 架构可视化与 Strix 自主渗透防御

上游：`design.md`。规格变化必须退回规划阶段（§6.1）。

> **两条硬规矩**（对齐 CMMI「主线-支线任务树」与「1 Task = 1 Commit」）:
> 1. **归属**必须写 `main`（主线）或某个已存在的任务 ID —— **不允许孤儿任务**
> 2. **文件白名单**必填（逗号分隔）；`-` 表示该任务不改文件（纯验证类）
>
> 完成度**不看"状态"列**，而是从 git 推导: commit message 带 `[T<ID>]`（方括号，避免误匹配）
> 且改动文件落在白名单内，才算这条任务真的做了（`npm run task:verify`）。

| ID | 归属 | 任务 | 文件白名单 | 状态 |
|---|---|---|---|---|
| T1 | main | 接入 Archify 技能规范并生成交互式架构拓扑产物 | .agents/skills/archify/, docs/03_design/diagrams/ | 未开始 |
| T2 | main | 接入 Strix 渗透测试技能规范并定义四大核心防御靶标规约 | .agents/skills/strix-penetration-testing/ | 未开始 |
| T3 | main | 集成 K6 负载压测场景脚本并跑通 20 道门禁核验 | test/load/k6-load-benchmark.js, wiki/ | 未开始 |

## 依赖

T1 → T2 → T3

## 阶段状态

* 规划：`PLAN_APPROVED`（由 brief 展开）
* 开发：待开始
* 独立测试：待开始
