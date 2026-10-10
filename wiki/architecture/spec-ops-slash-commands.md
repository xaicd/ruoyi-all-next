# 架构百科：SSOT 斜杠指令体系与 SpecKit 兼容矩阵 (/spec-ops.*)

> 对应规则：AGENTS.md Rule 0.9 & Rule 0.10 / .agents/rules/SPEC-FIRST-ENGINEERING-ARTIFACTS.md / .agents/commands/

## 一、 为什么必须采用 .agents/commands 作为单一真源 (SSOT)？
传统 AI 编码工具习惯将斜杠指令（Slash Commands）散落在工具特异性目录中（如 Claude Code 的 `.claude/commands/`、Cursor 的 `.cursor/commands/` 等）。
这种做法直接违背了 **Rule 0: 单一真源与零重复配置** 铁律：
1. **防止工具绑定与心智割裂**：无论研发使用 Cursor、Claude Code、Windsurf、Agy 还是 DigitalStaff 无头 Agent，底座工程的指令集必须完全统一。
2. **符号链接 (Symlink) 适配器模式**：`.agents/commands/` 作为物理权威目录，工具特有路径通过软链接透明指向真源（如 `.claude/commands -> ../.agents/commands`）。

## 二、 9 大 /spec-ops.* 核心斜杠指令矩阵
| 斜杠指令 | 底层执行引擎 | 功能说明 | 核心产物 / 验收标准 |
|---|---|---|---|
| `/spec-ops.new` | `npm run spec:new` | 交互式规格立项 | 生成 `brief.json`、`assets/` 与 `prototypes/` 骨架 |
| `/spec-ops.build` | `npm run spec:build` | 规格资产自动展开 | 生成 8 份标准工程文档、`evidence.json` 与 `runbook.json` |
| `/spec-ops.check` | `npm run spec:check` | 11 阶段 / 6 Gate 门禁扫描 | 输出规格完备度报告，扫描假绿与未完成项 |
| `/spec-ops.tasks` | `scripts/spec-ops.ts tasks` | 原子任务树提取 | 输出白名单任务树，严格贯彻 1 Task = 1 Commit |
| `/spec-ops.socratic` | `npm run socratic:inquire` | 6 阶苏格拉底高阶反向辩证 | 穿透物理存在、真实执行、极端不变量反思 |
| `/spec-ops.archive` | `npm run spec:archive` | 规格生命周期归档 | 移入 `docs/specs/archive/<YYYY-Qx>/<domain>/<name>/` |
| `/spec-ops.gate` | `scripts/spec-ops.ts gate` | CMMI Gate 1~6 物理裁决 | 校验测试覆盖、渗透扫描、容量压测与回滚演练证据 |
| `/spec-ops.ops` | `npm run agent:ops` | 无头 Agent 契约运营 | 接口自动化体检、仿真造数与敏感清数 |
| `/spec-ops.verify` | `npm run task:verify` | Git 提交真实完成度核验 | 从 Git 历史核对白名单与任务完成度，严禁口头完工 |

## 三、 GitHub SpecKit / Tencent CodeBuddy 兼容矩阵
为了让习惯使用开源 `spec-kit` (`specify-cli`) 的 Agent 或开发者无缝过渡，底座建立了物理别名软链接：
- `/speckit.specify` ➔ `/spec-ops.new` (立项规格)
- `/speckit.plan` ➔ `/spec-ops.build` (架构与资产展开)
- `/speckit.tasks` ➔ `/spec-ops.tasks` (任务拆解)
- `/speckit.constitution` ➔ `/spec-ops.socratic` (宪法级辩证反思)
- `/speckit.implement` ➔ `/spec-ops.verify` (落地实施与完成度核验)
