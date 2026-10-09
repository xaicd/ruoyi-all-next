# Requirements: 开源顶流技能吸收：Archify 架构可视化与 Strix 自主渗透防御

状态：`PLAN_APPROVED`　类型：`enhancement`　特性：`archify-strix-integration`　域名：`infra`

## 1. 目标与背景 (Introduction)

深度吸收开源顶流 tt-a1i/archify (47k★ MIT) 与 usestrix/strix (60k★ Apache-2.0)，生成交互式可机器验证的架构拓扑图谱，构筑基于真实数据库的四大安全渗透防御靶标。


## 2. 术语表 (Glossary)

| 术语 | 定义说明 |
|---|---|
| **开源顶流技能吸收：Archify 架构可视化与 Strix 自主渗透防御** | 当前特性的核心业务领域与交付边界 |
| **Tenant Scope** | 租户隔离上下文，操作严格携带并过滤 tenant_id |
| **Domain Facade** | 跨域调用的唯一权威门面通道，严禁直接 import 外部 Service |
| **Base Audit Columns** | 8 大核心审计列：id, tenant_id, created_by, created_at, updated_by, updated_at, deleted_at, version |

## 3. 角色矩阵 (Actors)

| 角色 | 核心能力与职责 |
|---|---|
| 系统架构师 | 使用 Archify 生成并维护交互式拓扑图（.arch.json / .arch.html），以可视化路径追踪洞察 17 领域全连接与边缘网关流量 |
| 安全与 SRE 工程师 | 依托宿主机穿透调度 Strix 沙箱靶机，基于真实数据库验证四大防御靶标（Zero Fake PoC），保障生产发布门禁 (G5) |

## 4. 用户故事与需求定义 (User Stories & Requirements)

### Requirement 1: 吸收 archify 技能规范至 .agents/skills/archify/，生成全域架构拓扑 docs/03_design/diagrams/ruoyi-architecture.arch.json 与可交互 HTML。
**User Story:** 作为 系统架构师，我希望 吸收 archify 技能规范至 .agents/skills/archify/，生成全域架构拓扑 docs/03_design/diagrams/ruoyi-architecture.arch.json 与可交互 HTML。，以便于达成业务目标。

#### 优先级: `P0`

#### 验收标准 (EARS 规范 Acceptance Criteria)
1. **THE system SHALL** 确保操作在已验签的租户上下文内执行，严禁跨租户越权。
2. **WHEN** 触发该业务操作 **THEN** 系统必须验证参数有效性并记录结构化审计日志。
3. **IF** 参数非法或校验失败 **THEN** 系统必须拒绝并返回 400 统一错误契约。

### Requirement 2: 吸收 strix-penetration-testing 技能规范至 .agents/skills/strix-penetration-testing/，明确四大防御靶标与宿主机穿透准则。
**User Story:** 作为 安全与 SRE 工程师，我希望 吸收 strix-penetration-testing 技能规范至 .agents/skills/strix-penetration-testing/，明确四大防御靶标与宿主机穿透准则。，以便于达成业务目标。

#### 优先级: `P0`

#### 验收标准 (EARS 规范 Acceptance Criteria)
1. **THE system SHALL** 确保操作在已验签的租户上下文内执行，严禁跨租户越权。
2. **WHEN** 触发该业务操作 **THEN** 系统必须验证参数有效性并记录结构化审计日志。
3. **IF** 参数非法或校验失败 **THEN** 系统必须拒绝并返回 400 统一错误契约。

### Requirement 3: 编写 K6 真实压测基准脚本 test/load/k6-load-benchmark.js，与本地独立压测基线（26,877 RPS）对齐，通过 20 道门禁总检。
**User Story:** 作为 系统架构师，我希望 编写 K6 真实压测基准脚本 test/load/k6-load-benchmark.js，与本地独立压测基线（26,877 RPS）对齐，通过 20 道门禁总检。，以便于达成业务目标。

#### 优先级: `P1`

#### 验收标准 (EARS 规范 Acceptance Criteria)
1. **THE system SHALL** 确保操作在已验签的租户上下文内执行，严禁跨租户越权。
2. **WHEN** 触发该业务操作 **THEN** 系统必须验证参数有效性并记录结构化审计日志。
3. **IF** 参数非法或校验失败 **THEN** 系统必须拒绝并返回 400 统一错误契约。


## 5. 核心验收准则 (Acceptance Criteria)

1. **THE system SHALL** 验证：`npm run check` exit=0，20 道门禁全部通过
2. **THE system SHALL** 验证：docs/03_design/diagrams/ruoyi-architecture.arch.html 浏览器可交互加载并展示 17 领域拓扑
3. **THE system SHALL** 验证：`npm run skills:check` 验证 36 项技能规范且无重复目录

## 6. 约束与边界 (Constraints & Non-Goals)

### 约束条件
* **THE system SHALL COMPLY WITH**: 宿主机穿透调用：严禁将 Strix 庞大的外部 Python 代码拷入代码库，必须通过宿主机穿透命令（host-exec）以 Docker 沙箱容器方式调度。
* **THE system SHALL COMPLY WITH**: 真实数据库支撑：所有安全渗透与压测必须依托真实数据库环境，严禁前端伪造 Mock。
* **THE system SHALL COMPLY WITH**: 零商业传染性：引入的开源技术 100% 为 MIT 与 Apache-2.0 商业友好许可。

### 不包含范围 (Non-Goals)
* 不在代码仓库内直接维护 Strix 的 Python 3.12 虚拟环境与底层依赖包
