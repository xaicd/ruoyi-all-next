# 风险登记册与缓解预案 (Risk Register & Mitigation Plan)

- **登记日期**: 2026-10-09
- **归属规范**: CMMI 01_management (RSKM - 风险管理)
- **风险等级评定**: 高 (High) / 中 (Medium) / 低 (Low)

---

## 1. 核心技术与架构风险台账

| 风险编号 | 风险描述与潜在影响 | 概率 | 影响 | 风险等级 | 预防与防御机制 | 应急触发与缓解预案 | 责任人 | 状态 |
|---|---|---|---|---|---|---|---|---|
| **RSK-001** | **跨租户数据越权与穿透**<br>开发者编写未经 AST 租户过滤器拦截的原始 SQL，导致 A 租户查询到 B 租户敏感数据。 | 低 | 极高 | **高** | 1. 强制使用 `BaseMapper` 与 Kysely 查询构建器；<br>2. 门禁 `npm run domain:check` 阻断裸 SQL；<br>3. Strix 渗透测试自主验证越权拦截。 | 立即阻断对应服务端口；锁定异常 Session；启动 SRE P1 级响应并在 10 分钟内完成热修补。 | @sec-team | 已受控 |
| **RSK-002** | **高并发秒杀库存透支 (Race Condition)**<br>多并发线程绕过版本乐观锁直接扣减，造成库存超卖负数。 | 中 | 极高 | **高** | 1. 强制使用数据库原子 CAS 原语 (`WHERE version = ?`)；<br>2. 变异测试 100 线程并发压力断言；<br>3. 压测护栏 `npm run load:test` 验证。 | 触发对账 Agent 自动挂账；冻结超出库存的订单进入人工审核池；启动资金冲正流程。 | @mall-lead | 已受控 |
| **RSK-003** | **微服务与插件间隐式循环依赖**<br>业务插件跨域直接 import 其他插件 Service，形成网状死锁与无法独立打包。 | 中 | 高 | **中** | 1. 门禁 `npm run microservice:check` 实时拦截；<br>2. 强制使用 Domain Facade 与 NATS 消息契约。 | 门禁直接在 CI 构建阶段中断报错（Exit Code 1），杜绝污染代码合并至 main 主干。 | @architect | 已受控 |
| **RSK-004** | **单元测试假 Mock 与纸面覆盖率欺骗**<br>开发者在单测中 mock 核心 Service 的返回值，导致单测全绿但实际入库崩溃。 | 中 | 高 | **中** | 1. 全域推行真实 SQLite WAL / 真实数据库测试；<br>2. 引入 `mutation-tester` 变异测试（MSI $\ge 85\%$）；<br>3. 门禁 `npm run test:matrix`。 | 变异体存活（Mutant Survived）直接作为门禁阻断项，强制补充边界与负向断言。 | @qa-lead | 已受控 |
| **RSK-005** | **生产环境配置漂移与锁文件篡改**<br>第三方依赖由于锁文件未冻结在构建期自动升级破坏性版本。 | 低 | 高 | **中** | 1. 强制使用 `pnpm-lock.yaml` 并执行 `--frozen-lockfile`；<br>2. 实施发布数字指纹 `fingerprint:verify`。 | CI 流水线若发现锁文件哈希不匹配直接中断构建，拒绝打包不可信镜像。 | @devops | 已受控 |
