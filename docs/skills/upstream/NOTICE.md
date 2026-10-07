# 引入的上游技能（来源与许可）

来源: https://github.com/anthropics/skills （Anthropic 官方 Agent Skills 仓库）

## 已引入（Apache-2.0，保留原许可与归属）

| 技能 | 用途 |
|---|---|
| `mcp-builder` | 编写 MCP 服务器 —— 本仓有 MCP 工具面 |
| `skill-creator` | 编写技能本身 |
| `webapp-testing` | 浏览器/E2E 测试 |
| `frontend-design` | 前端设计与实现 |
| `canvas-design` | 视觉稿/画布设计 |
| `theme-factory` | 主题生成 |
| `brand-guidelines` | 品牌规范 |

每个技能的 `LICENSE.txt` 随目录一并保留（Apache License 2.0）。

## **未引入**（不是开源，或未声明许可）—— 记录在此以免以后有人误引

| 技能 | 原因 |
|---|---|
| `docx` / `pdf` / `pptx` / `xlsx` | frontmatter 明写 **Proprietary**；LICENSE.txt 为 **© 2025 Anthropic, PBC. All rights reserved**。仓库 README 亦说明这四个是 **source-available, not open source**。引入到本仓等于再分发。 |
| `doc-coauthoring` | **没有 LICENSE.txt** —— 未声明许可即默认版权保留，不能引入。 |

> 这条判据来自 AGENTS §3.4 交付链的 **G0 选型门禁（License 合规结论必须有明确结论）**。
> 逐个读 LICENSE.txt 得出，不靠仓库首页的 "Many skills are Apache 2.0" 那句话推断。

---

# 压测与渗透 —— 来源评审（**已撤回引入**）

曾引入 5 个技能（k6-load-testing / web-security-testing / api-security-testing /
security-scanning-security-hardening / owasp-zap），**已全部撤回**，原因:

    来源仓的真实 star 数:  tmolavi/mcp-agent-skills-hub = 8      G1Joshi/Agent-Skills = 14

**标准是 star > 20k**。8 / 14 星的仓不足以作为底座依赖 —— 这不是风格问题，
是这个生态**太新**：Agent Skill 类仓库普遍只有几十星，所谓"精选目录"也不足百星。

## 实测的 star 排序（GitHub API，本轮查证）

| 仓库 | stars | 许可 | 性质 |
|---|---|---|---|
| anthropics/skills | 179,978 | — | **官方 Agent Skills**（本仓已引 7 个通用技能，保留 ✅） |
| swisskyrepo/PayloadsAllTheThings | 81,516 | **MIT** | 渗透**知识库**（不是 skill） |
| danielmiessler/SecLists | 73,984 | **MIT** | 渗透**字典/清单**（不是 skill） |
| OWASP/CheatSheetSeries | 33,518 | CC-BY-SA-4.0 ⚠️ | 安全**规范**（ShareAlike，改写需同许可） |
| grafana/k6 | 31,822 | **AGPL-3.0** ⚠️ | 压测**工具**（用可以，**不要 vendor 代码**） |
| zaproxy/zaproxy | 15,884 | Apache-2.0 | 渗透**工具** |
| G1Joshi/Agent-Skills | 14 | MIT | skills 仓（已撤） |
| tmolavi/mcp-agent-skills-hub | 8 | MIT | skills 仓（已撤） |

## 结论（如实）

**>20k 星的「Agent Skill」几乎不存在** —— 这个生态还太年轻。
>20k 的**是工具与知识库**（k6 / ZAP / SecLists / PayloadsAllTheThings / OWASP Cheatsheets）。

所以正确做法不是"引入顶级 skill"，而是:
1. **压测** —— 用 **grafana/k6**（31.8k，AGPL：**当工具用**，不拷代码进仓）写场景
2. **渗透** —— 知识来自 **OWASP CheatSheetSeries / PayloadsAllTheThings / SecLists**（33k–81k）
3. **技能自研** —— 把上面这些**顶级素材**凝成**本仓自己的** skill
   （外部 skill 不懂我们的交付链、门禁与 `security-scan.cjs`）
