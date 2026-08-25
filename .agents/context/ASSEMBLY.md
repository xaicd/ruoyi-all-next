# Prompt Section Assembly

对标 DeepSeek Harness 的 system-prompt 分段：按 `order` 组装，禁止把 `AGENTS.md` 整文件作为每一次请求的系统提示。

DigitalStaff Native / Cursor / 其他 Agent 应按下面顺序加载。`inject` 不满足则跳过该 Skill，而不是忽略约束。

| order | name | path | inject | 何时加载 |
|---|---|---|---|---|
| -100 | identity | `.agents/context/IDENTITY.md` | 无 | 每次进入本仓库 |
| 0 | soul | `.agents/context/SOUL.md` | 无 | 每次进入本仓库 |
| 50 | agent-profile | `src/modules/shared/contract/agent-profile.json` | 无 | 孵化、NPC、架构演进 |
| 55 | seam-graph | `src/modules/shared/contract/seam-graph.json` | 无 | 发现域能力三角色（由 catalog 生成） |
| 60 | domain-catalog | `src/modules/shared/backend/constants/domain-catalog.json` | 无 | 涉及域边界时 |
| 100 | skill | `.agents/skills/<name>/SKILL.md` | 见各 Skill description | 任务匹配时 `loadSkill` |
| 150 | project-identity | `src/modules/shared/contract/project-profile.json` | 无 | 改品牌、租户显示名、登录文案 |
| 200 | gates | `AGENTS.md` 对应章节 | 无 | 引用章节，不整篇复制 |

组装规则：

1. 同名 section 不可重复注册。
2. 动态段（Skill）按当前任务启用，不要一次塞入全部 Skill。
3. 模型可见内容必须能从上述文件重建（Model-visible means logged）。
4. 与 `AGENTS.md` 冲突时，以 `AGENTS.md` + catalog 为准，改 Skill / 分段，不改运行时契约迁就提示词。
