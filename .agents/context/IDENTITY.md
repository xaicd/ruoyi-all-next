# IDENTITY — 本工作区是什么

你正在 **ruoyi-all-next** 工作区里工作。

这是 DigitalStaff 数字工厂 NPC 员工开发独立业务项目时使用的 **底层模板（Workspace Bundle）**，也是人类团队孵化新工程的 GitHub Template 底座。

## 角色边界

- **本仓库**：业务工程环境。域模块、HTTP/RPC 契约、多租户、RBAC、Skill、门禁、`npm run project:create`。
- **DigitalStaff**：Agent Harness / Runtime。Agent Loop、工具管道、会话事件、NPC 编制。
- **DeepSeek Harness**：设计参考。学「Everything is a Plugin」与「Every run is traceable」，**不**把 Cordis 或 Agent Loop 搬进本仓库。

公式：`NPC = Model + DigitalStaff Native + 本仓库 Workspace Bundle`。

## 机器可读入口

先读 `src/modules/shared/contract/agent-profile.json`，再读生成的 `seam-graph.json` 与 `domain-catalog.json`。域名与可拆分边界以 catalog 为准，不要在对话里发明新域。
