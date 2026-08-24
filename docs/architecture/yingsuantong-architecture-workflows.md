# 「应算通」AI 算力与智能体中枢平台——全景业务运行流程白皮书

本文档确立了**「应算通」**在**中国移动 MOMA 平台**、**智能体应用生态 (ISV)** 与 **政企客户** 之间的权威中枢定位与 6 大端到端核心运行业务流程。

---

## 1. 核心定位与四层架构全景图 (Authoritative 4-Layer Topology)

```mermaid
flowchart TD
    subgraph Layer1 ["【第一层：上游算力供给方】中国移动 MOMA 智算中枢"]
        M1["中国移动智算中心 / 天翼云息壤 GPU 集群"]
        M2["MOMA 纳管大模型 (DeepSeek-R1 / V3 / 九天-72B)"]
        M3["移动豆 (Beans) 计量中枢 & 模型厂商结算体系"]
    end

    subgraph Layer2 ["【第二层：撮合运营与中枢平台】应算通平台 (我们)"]
        P1["🔑 统一鉴权中心 (手机号 SSO / OAuth 2.0)"]
        P2["🧭 智能体选择与分发调度器 (WorkBuddy / Qoder / Trae)"]
        P3["🏛️ 政企私有 MCP 连接器 & 行业 Skill 资产管理中枢"]
        P4["⚡ 物理台账实时计量扣减 & 毫秒级增量统计引擎"]
        P5["📊 算力与移动豆实时监测大屏 (7日增量/水位告警)"]
        P6["💰 四方清分结算与对公发票自动化引擎"]
    end

    subgraph Layer3 ["【第三层：智能体应用生态】ISV 原生客户端 (无需自研客户端)"]
        A1["腾讯 WorkBuddy (政企协同办公 / 公文 / 会议纪要)"]
        A2["阿里 Qoder (智能代码研发 / 架构设计 / 单测生成)"]
        A3["字节 Trae / 行业专属定制 Agent"]
    end

    subgraph Layer4 ["【第四层：下游消费与分销】政企大客户 & 全域销售"]
        C1["政企客户管理员 (登录 Web 政企门户分配员工手机号与额度)"]
        C2["政企员工 (在 WorkBuddy / Qoder 输入手机号无缝使用)"]
        S1["运营商政企客户经理 / 实体营业厅推介"]
    end

    M1 & M2 & M3 <-->|"算力纳管 / 移动豆回调"| Layer2
    Layer2 <-->|"API Key 鉴权 / MCP 下发 / 会话指向"| Layer3
    Layer4 <-->|"手机号开户 / 份额分配 / 账单出具"| Layer2
    C2 <-->|"日常工作与工具调用"| Layer3
```

---

## 2. 六大端到端核心运行业务流程

---

### 流程一：供给侧通道入驻与 ISV 生态接入流程

运营人员在平台配置上游算力与接入下游智能体软件：

```mermaid
sequenceDiagram
    autonumber
    actor Admin as 平台运营人员
    participant Channel as MOMA渠道管理
    participant ISV as 智能体生态管理
    participant Moma as 移动 MOMA 平台

    Admin->>Channel: 1. 配置中国移动 MOMA 平台 API 端点与 Key
    Channel->>Moma: 2. 连通性探测 (验证 deepseek-v3-moma / r1 响应)
    Moma-->>Channel: 3. 返回 200 OK & 移动豆扣减规则 (1000 Token = 1 移动豆)
    
    Admin->>ISV: 4. 接入腾讯 WorkBuddy (配置 appCode, 30% 分润比例)
    Admin->>ISV: 5. 接入阿里 Qoder (配置 appCode, 35% 分润比例)
    Admin->>ISV: 6. 绑定智能体指向的 MOMA 算力模型
```

---

### 流程二：套餐打包与政企私有 MCP 资产上架流程

将通用模型算力包装为具备行业壁垒的「政企融合解决方案」：

```mermaid
sequenceDiagram
    autonumber
    actor Ops as 运营商/政企产品经理
    participant Package as 算力套餐管理
    participant MCPHub as 政企私有 MCP 资产库

    Ops->>MCPHub: 1. 上架政企专属 MCP (如: 广东省政务公文流转 MCP, 医保核验 MCP)
    Ops->>Package: 2. 制定【政企旗舰协同版套餐】：
    Note over Package: 包含: 5,000万 Token/月 + 50个 WorkBuddy 席位 + 政务公文 MCP 权限
    Ops->>Package: 3. 制定【国央企数智研发套餐】：
    Note over Package: 包含: 1亿 Token/月 + 100个 Qoder 席位 + 内网 GitLab MCP 权限
```

---

### 流程三：政企签约开户与手机号份额分配流程（Web 门户）

政企大客户签约后，管理员在 Web 端完成员工手机号导入与额度授权：

```mermaid
sequenceDiagram
    autonumber
    actor GovAdmin as 政企客户信息化管理员
    participant Portal as 应算通政企门户 (Web端)
    participant MemberRepo as 成员与份额仓储
    participant Ledger as 物理台账

    GovAdmin->>Portal: 1. 登录政企控制台 (查看可用 5000万 Token 算力池)
    GovAdmin->>Portal: 2. 批量导入员工手机号 (如: 13800000001 李总, 13911112222 张工)
    GovAdmin->>Portal: 3. 为张工分配 2000万 Token 月度上限，勾选开通 [Qoder + Trae]
    GovAdmin->>Portal: 4. 为李总分配 1000万 Token 月度上限，勾选开通 [WorkBuddy]
    Portal->>MemberRepo: 5. 保存授权记录并初始化移动豆余额
    Portal->>Ledger: 6. 锁定政企预付费算力池份额
```

---

### 流程四：第三方客户端手机号 SSO 统一鉴权流程

政企员工打开第三方智能体客户端，通过手机号秒级鉴权并自动挂载算力与 MCP：

```mermaid
sequenceDiagram
    autonumber
    actor Employee as 政企员工 (张工)
    participant AgentApp as 阿里 Qoder / 腾讯 WorkBuddy 客户端
    participant AuthApi as 应算通统一鉴权网关 (/agent-verify)
    participant Core as 应算通中枢

    Employee->>AgentApp: 1. 打开智能体客户端，输入手机号 (13911112222)
    AgentApp->>AuthApi: 2. POST /api/v1/admin/aigw/auth/agent-verify
    AuthApi->>Core: 3. 校验该手机号政企授权、应用清单与剩余 Token 水位
    Core-->>AuthApi: 4. 校验通过 (剩余 1800万 Tokens, 折合 18,000 移动豆)
    AuthApi-->>AgentApp: 5. 下发会话 SessionToken + MOMA 指向 + 注入政企私有 MCP
    AgentApp-->>Employee: 6. 客户端提示「中国移动政企算力专区已就绪」，进入工作界面
```

---

### 流程五：日常交互、工具调用 (Tool Calling) 与毫秒级扣减流程

员工日常使用智能体，流量透明回流，产生精准计量与大屏呈现：

```mermaid
sequenceDiagram
    autonumber
    actor Employee as 政企员工 (张工)
    participant AgentApp as Qoder / WorkBuddy
    participant Relay as 应算通智能网关 (/api/relay)
    participant Moma as 移动 MOMA 平台
    participant Ledger as 物理台账
    participant Dashboard as 实时监测大屏

    Employee->>AgentApp: 1. 提问: "请帮我重构这段高并发逻辑并生成单测"
    AgentApp->>AgentApp: 2. 触发政企私有 MCP 工具调用 (Tool Calling)
    AgentApp->>Relay: 3. 携带 SessionToken 转发推理请求 (2,450 Tokens)
    Relay->>Moma: 4. 路由至本地 MOMA 纳管 DeepSeek-R1 深度推理集群
    Moma-->>Relay: 5. 返回推理结果 (耗时 24ms)
    Moma->>Moma: 6. 移动 MOMA 扣减 2.45 移动豆
    Relay->>Ledger: 7. 物理台账增量扣减 2,450 Tokens (balanceAfter 实时更新)
    Relay->>Dashboard: 8. 广播增量事件 -> 实时监测大屏毫秒级刷新
    Relay-->>AgentApp: 9. 返回生成代码与分析
    AgentApp-->>Employee: 10. 展现完整成果
```

---

### 流程六：月末四方自动清分与对公发票结算流程

月末系统全自动完成各方分润对账，杜绝人工坏账：

```mermaid
sequenceDiagram
    autonumber
    participant Engine as 四方清分结算引擎
    participant Pipeline as 清分流水记录
    participant Invoice as 对公发票开具
    participant Bank as 资金对账中心

    Note over Engine: 月末 24:00 自动触发全网对账
    Engine->>Pipeline: 1. 汇总政企客户实际消费 100,000 元
    Engine->>Pipeline: 2. 计算各方应收应付明细：
    Note over Pipeline: ① 移动 MOMA 算力与移动豆成本: 40,000 元 (40%)
    Note over Pipeline: ② 腾讯 WorkBuddy / 阿里 Qoder 软件分润: 30,000 元 (30%)
    Note over Pipeline: ③ 运营商政企渠道销售毛利: 20,000 元 (20%)
    Note over Pipeline: ④ 应算通中枢技术平台服务费: 10,000 元 (10%)
    Engine->>Invoice: 3. 自动生成增值税对公发票 (抬头: 广东省政务信息化中心)
    Engine->>Bank: 4. 输出三方机构结算对账单并归档
```

---

## 3. 运营与技术关键指标 (SLO)

1. **统一鉴权延迟**：P99 < 50ms（手机号秒级无感验权）；
2. **算力路由转发额外开销**：< 10ms（纯流式透明转发）；
3. **计量削峰防击穿**：采用物理台账 + 增量聚合缓冲，支持 10万+ QPS 并发实时扣减；
4. **清分对账准确率**：100% 具备物理流水凭证（`aigw_tenant_quota_ledger` 严格一一对应）。
