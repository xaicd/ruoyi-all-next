# RuoYi-All-Next 架构持续进化战略路线图 (2026-2027)
# (Evolution Roadmap: AI-Native Software Foundry & NPC Workspace)

> **发布日期**: 2026-10-09  
> **制定角色**: 产品总监 (CPO) × 首席架构师 (Lead Architect)  
> **核心哲学**: 高阶反向思维 (High-Order Inverse Thinking) × DeepSeek Harness 机制 × CMMI Spec-First 物理资产交付  

---

## 一、 顶层演进愿景

`ruoyi-all-next` 已完成了第一阶段（17 原生域迁移、第一方插件解耦、SQLite 零配置、RFC 8615 机器发现面、安全管理员重构）。
下一阶段的核心使命是：**从“企业中后台全栈模板”升维为“全自动化、可自我演进、零假 Mock 的 AI 工业级软件交付工厂”**。

任何演进任务必须满足三项不可动摇的底线：
1. **真实数据库驱动**：100% 由本地 SQLite / 生产 PostgreSQL 支撑，杜绝假测试；
2. **Schema/DSL 声明式优先 (Rule 0)**：拒绝在业务模块中人肉堆砌低效样板代码；
3. **No Artifact, No Done**：工单必须输出 5 选 1 物理工程资产并通过 `npm run check` 门禁。

```
                     【RuoYi-All-Next 四维演进同心环】
  
       ┌────────────────────────────────────────────────────────┐
       │ Ring 4: 微服务阶段 C 旗舰域拆分与可靠 Outbox 异步总线    │
       │  ┌──────────────────────────────────────────────────┐  │
       │  │ Ring 3: C 端移动生态商业化与 Mac 宿主机原生模拟器   │  │
       │  │  ┌────────────────────────────────────────────┐  │  │
       │  │  │ Ring 2: 旗舰业务域（Pay/CRM/Mall）深度状态机 │  │  │
       │  │  │  ┌──────────────────────────────────────┐  │  │  │
       │  │  │  │ Ring 1: 债务彻底清零与代码治理基线收紧  │  │  │  │
       │  │  │  │       (0 Blocker / 0 High / 0 Medium) │  │  │  │
       │  │  │  └──────────────────────────────────────┘  │  │  │
       │  │  └────────────────────────────────────────────┘  │  │
       │  └──────────────────────────────────────────────────┘  │
       └────────────────────────────────────────────────────────┘
```

---

## 二、 四维演进路线与执行阶段

### 环 1：债务彻底清零与代码治理基线收紧 (Ring 1: Backlog Burn-Down)
*当前阶段：已启动并取得突破*

- [x] **AIGW 域测试加固 (Medium 债务清零)**：
  - 新增 `aigw-usage.service.test.ts`，覆盖 Token 计量、多租户隔离与密钥脱敏断言；
  - `evolution-backlog.json` 中 Medium 级别债务降至 0。
- [ ] **遗留控制台日志彻底清剿 (AGENTS.md §4.5)**：
  - 彻底清除历史基线中残留的 8 处 `console.*`，全部迁移至 `domainLog` 与 `auditLog`；
  - 将 `backend-no-console` 门禁从渐进 ratchet 升格为硬性 enforce。
- [ ] **超长服务与仓储解耦 (AGENTS.md §11)**：
  - 对超过 200 行的服务（如 `codegen-table.service.ts`、`user.repository.ts` 等）按子职责策略模式拆分；
  - 保持外部暴露的 `Domain Facade` 契约 100% 向后兼容。

---

### 环 2：旗舰商业域深度状态机与业务闭环 (Ring 2: Flagship Business Domains)
*目标：为 AI Agent 树立高业务复杂度的 4 态状态机标杆*

- [ ] **Pay 支付域全生命周期闭环 (`packages/plugins/plugin-pay`)**：
  - 微信/支付宝真实支付订单创建 -> 预支付凭据签发 -> 异步通知回调签名校验；
  - 4 态状态机断言：`PENDING` (待支付) -> `SUCCESS` (支付成功) -> `REFUND_PENDING` (退款中) -> `REFUNDED` (已退款)；
  - 结合数据库事务与版本乐观锁，实现高并发防重入与幂等性保障。
- [ ] **CRM 客户关系中台闭环 (`packages/plugins/plugin-crm`)**：
  - 营销线索 (Clue) 导入 -> 自动清洗判重 -> 公海池分配 -> 转化为客户与商机；
  - 结合 `system` 域数据权限模型，实现基于部门树与角色的数据范围穿透。
- [ ] **Mall 数字化商城核心交易链 (`packages/plugins/plugin-mall`)**：
  - 商品 SPU/SKU 多级规格 -> 购物车原子计算 -> 优惠券核销 -> 扣减库存回滚事务。

---

### 环 3：C 端移动生态商业化与宿主机模拟自动化 (Ring 3: Mobile & Native Synergy)
*目标：实现 Web/移动端一网通办，打通 Mac 宿主机原生测试*

- [ ] **Expo 移动端商业场景落地 (`clients/expo`)**：
  - 升级 `clients/expo` 为模块化路由结构，新增商城移动端浏览、加购与下单流程；
  - 结合动态 `SchemaFieldRenderer`，支持业务表单移动端零代码自适应。
- [ ] **Mac 宿主机原生模拟器自动化测试流水线**：
  - 利用 `scripts/host-exec.sh` 封装宿主机 Xcode iOS Simulator / Android Emulator 自动化测试脚本；
  - 支持在 CI 阶段一键无头唤起移动端、截图归档并断言渲染正确性。

---

### 环 4：微服务阶段 C 旗舰域独立容器演练 (Ring 4: Microservice Stage C)
*目标：实证从“模块化单体”到“独立微服务容器”的零破坏演进*

- [ ] **Pay 域独立进程部署与流量切分**：
  - 使用 `npm run domain:pack pay` 打包生成 API-only 独立 Docker 镜像；
  - 通过环境变量 `RUOYI_DOMAIN_PAY_UPSTREAM` 引导 BFF 反向代理切换为远程独立服务；
  - 验证前端 API、DTO 响应与权限拦截零感知无缝迁移。
- [ ] **Transactional Outbox 可靠消息投递实装**：
  - 基于真实 SQLite / PostgreSQL 数据库落地 Outbox 事件调度轮询器；
  - 结合 Consumer Inbox 机制，替代仅在内存中的临时总线，实现跨域跨进程可靠最终一致性。

---

## 三、 持续演进度量衡 (KPI & Verification)

每个进化周期的产出，必须通过以下 4 层可量化指标评估：

| 评估维度 | 指标基线 (Baseline) | 演进目标 (Target) | 校验命令 |
|---|---|---|---|
| **技术债务指数** | 0 Blocker, 0 High, 0 Medium, 12 Low | **0 债务 (全清零)** | `node scripts/build-evolution-backlog.cjs` |
| **测试金字塔覆盖** | 17 域全部 ≥2 个自动化测试文件 | 核心域具备 4 态状态机真实 DB 用例 | `npm run test:unit` |
| **工程门禁** | 10 项工程门禁 100% PASS | 10 项工程门禁硬性 Enforce | `npm run check` |
| **平台可用性冒烟** | 登录 200 + 12 项安全穿透 | 跨域端到端全链路冒烟通过 | `npm run smoke:login && npm run security:scan` |
