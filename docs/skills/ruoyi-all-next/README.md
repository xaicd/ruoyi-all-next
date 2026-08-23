# ruoyi-all-next Skill 注册表

权威入口。Agent 接到跨阶段需求时先读本文件，再只加载相关阶段 Skill。  
Skill 写法见 [skill-authoring.SKILL.md](./skill-authoring.SKILL.md)。

冲突时：**本仓库 Skill + AGENTS.md + 本仓库文档 > 外部 GitHub Skill**。

## 1. 交付管道

按阶段推进，不允许跳过门禁宣称完成。

| 序 | 阶段 | Skill | 产物 | 未过门禁不得进入 |
|---|---|---|---|---|
| 0 | 写法与启用 | skill-authoring | 合法 SKILL.md | 乱写 Skill |
| 1 | 需求原型 | product-requirements | 问题、范围、验收、非目标 | UI/API 实现 |
| 2 | UI 设计 | ui-design | 渠道、信息架构、状态、token | 堆页面 |
| 3 | API 设计 | api-design | 面、路径、DTO、错误码、权限 | 先写 Route |
| 4 | 数据库设计 | database-design | 表归属、租户、兼容等级 | 手写跨库 SQL |
| 5 | 架构设计 | architecture-design | 单体/拆分、网关、调用面 | 默认上微服务 |
| 6 | 服务治理 | service-governance | 超时重试熔断限流追踪 | 无超时的跨域调用 |
| 7 | 编码 | coding | 分层落地 | 跳过 Validator |
| 8 | 自动化测试 | automated-testing | 关键路径 + 拒绝/回滚 | 标 DONE |
| 9 | 安全 | security | 鉴权、注入、扫描、风控 | 生产发布 |
| 10 | 发布运维 | devops | 部署、域名、证书、更新 | 手改生产 |

六要素（API / Service / Validator / Page / Permission / Log+Test）嵌在 3、7、8，不另起炉灶。

## 2. 启用矩阵

| 用户在做 | 必开 |
|---|---|
| 新增/修改 Skill | skill-authoring |
| 新功能、客户端、业务项目初始化 | product-requirements |
| 管理端/C 端页面或视觉 | ui-design、ui-framework-governance、ui-ux-pro-max |
| 新 HTTP/RPC、改 DTO | api-design |
| 表、迁移、多数据库 | database-design、database-compatibility |
| 拆分、网关、BFF、前后端边界 | architecture-design、microservice-evolution |
| 熔断、限流、追踪、高可用 | service-governance |
| 写业务代码 | coding |
| 补测、CI | automated-testing |
| 鉴权、注入、扫描、风控 | security |
| 部署、域名、证书、发版 | devops |

## 3. 分层

1. **通用层（可选参考）**：格式 [agentskills.io](https://agentskills.io)；目录 [skills.sh](https://skills.sh)。UI：[nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)、[vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)。API/架构用社区 REST 与 ADR Skill，细节以本仓库为准。
2. **项目层（强制）**：本目录 + `AGENTS.md` + `docs/guides` + `docs/architecture`。
3. **证据层**：扫描产物、测试、`npm run check`。未落地不得标 DONE。

## 4. 已有治理 Skill（保持）

| 文件 | 场景 |
|---|---|
| database-compatibility.SKILL.md | 数据库兼容等级 |
| ui-framework-governance.SKILL.md | 管理端模板结构 |
| microservice-evolution.SKILL.md | A/B/C 拆分 |
| ../../../.kiro/steering/ui-ux-pro-max/SKILL.md | 视觉/UX 检索 |

## 5. 客户端

H5 / uni-app / Flutter / desktop-pc 走同一管道。渠道契约：`src/modules/shared/contract/client-channels.json`。  
目录：`clients/<channel>/{app,shared,modules/<domain>}`。禁止为客户端另开 API 前缀。
