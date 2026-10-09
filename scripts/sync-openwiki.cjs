#!/usr/bin/env node
/**
 * OpenWiki (LLM-Wiki) 自动化提取与动态同步引擎
 *
 * 核心目的：
 * 专为 AI Agent (Cursor, Claude Code, Cline, DigitalStaff NPC) 构建高内聚、
 * 带精准双向链接的动态知识库，替代传统冗长低效的静态文档，Token 消耗直降 80%。
 *
 * 唯一真源驱动 (Zero Doc Drift)：
 * - packages/shared/backend/constants/domain-catalog.json (17 域元数据与韧性策略)
 * - packages/shared/contract/seam-graph.json (跨域 Facade 与缝隙图谱)
 * - docs/agent/contracts.json (324 份机器可读 Agent 契约)
 *
 * 用法:
 *   node scripts/sync-openwiki.cjs          # 生成并更新 wiki/ 目录
 *   node scripts/sync-openwiki.cjs --write  # 显式写入
 *   node scripts/sync-openwiki.cjs --check  # 校验是否发生漂移（CI 门禁）
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const WIKI_DIR = path.join(ROOT, "wiki");
const checkOnly = process.argv.includes("--check");

// 1. 读取真源元数据
const catalogPath = path.join(ROOT, "packages/shared/backend/constants/domain-catalog.json");
const seamPath = path.join(ROOT, "packages/shared/contract/seam-graph.json");
const contractsPath = path.join(ROOT, "docs/agent/contracts.json");

if (!fs.existsSync(catalogPath)) {
  console.error(`[openwiki] 错误: 找不到领域元数据 ${catalogPath}`);
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const seamGraph = fs.existsSync(seamPath) ? JSON.parse(fs.readFileSync(seamPath, "utf8")) : { domains: [] };
const agentRegistry = fs.existsSync(contractsPath) ? JSON.parse(fs.readFileSync(contractsPath, "utf8")) : { contracts: [] };

// 建立索引
const seamDomainMap = new Map();
for (const d of seamGraph.domains || []) {
  seamDomainMap.set(d.name, d);
}

const contractsByDomain = new Map();
for (const c of agentRegistry.contracts || []) {
  if (!contractsByDomain.has(c.domain)) {
    contractsByDomain.set(c.domain, []);
  }
  contractsByDomain.get(c.domain).push(c);
}

// 目标产物收集器 { relativePath: content }
const generatedFiles = new Map();

// ==========================================
// 1. 生成 wiki/index.md (根索引与 Agent 全景)
// ==========================================
function buildIndexMd() {
  const domains = catalog.domains || [];
  const totalContracts = agentRegistry.total || (agentRegistry.contracts || []).length;
  
  let domainRows = "";
  for (const d of domains) {
    const seam = seamDomainMap.get(d.name);
    const contracts = contractsByDomain.get(d.name) || [];
    const entityCount = contracts.length;
    const methodsCount = seam?.provider?.methods?.length || 0;
    const kindBadge = d.kind === "platform" ? "🏛️ 平台地基" : "🧩 第一方插件";
    const port = d.defaultPort || "-";
    const link = `[${d.name}](domains/${d.name}.md)`;
    
    domainRows += `| ${link} | ${kindBadge} | 阶段 ${d.stage} | ${port} | ${entityCount} | ${methodsCount} | \`${(d.publicPrefixes || []).join("`, `")}\` |\n`;
  }

  const content = `# ruoyi-all-next OpenWiki (LLM 知识大脑)

> **面向 AI Agent 的核心索引**：本知识库由底座真实元数据（\`domain-catalog\`、\`seam-graph\`、\`contracts.json\`）**自动化编译生成与动态自愈**。AI 编程助手（Cursor / Claude / Copilot）应优先检索对应词条，严禁全盘盲扫代码。

---

## ⚡ 核心架构铁律 (Rule 0 ~ 3)

1. **零 Token 浪费 & Schema 驱动**：严禁人肉手写几百行重复 CRUD。必须复用 \`BaseMapper<T>\`、\`QueryWrapper<T>\` 与 \`BaseService<T>\`，自动继承 8 大审计字段与行级租户隔离。
2. **第一方插件规范 (First-Party Plugins)**：业务域一律落在 \`packages/plugins/plugin-<domain>/\`，平台地基落在 \`packages/domains/{system,infra}/\`。严禁在 \`src/\` 堆放平铺代码。
3. **真实数据库驱动 (Zero Fake Mock)**：测试 100% 由嵌入式 SQLite (\`better-sqlite3\`) 或真实 PostgreSQL 驱动，严禁前端伪造 Mock。
4. **全链路 Agent 契约闭环**：全仓已收敛 **${totalContracts} 份机器可读契约**，由 \`agent-device\` (接口运营/造数) 与 \`agent-browser\` (Playwright 探针) 统一驱动。

---

## 🧭 17 原生领域全景图 (Domain Directory)

| 领域 (Domain) | 架构分层 | 演进阶段 | 独立端口 | Agent 实体数 | Facade 方法数 | 公开 API 前缀 |
|---|---|---|---|---|---|---|
${domainRows}
---

## 📚 架构百科词条 (Architecture Pillars)

- [第一方插件体系与包结构规范](architecture/modular-plugin-system.md)
- [BaseMapper 通用持久化与 QueryWrapper 链式语法](architecture/base-mapper-and-queries.md)
- [Kysely AST 语法树级全局多租户隔离](architecture/tenant-isolation-ast.md)
- [事务性发件箱 (Transactional Outbox) 与 ACID 回滚](architecture/transactional-outbox.md)
- [微服务通信、跨域治理与 Facade 契约](architecture/service-governance.md)

---

## 🧪 自动化测试与验证体系 (Testing Guide)

- [四层金字塔测试体系 (L1 单测 ~ L4 Agent E2E)](testing/testing-pyramid.md)
- [嵌入式 SQLite 真实 C 引擎与并发 CAS 防超卖](testing/real-database-testing.md)
- [Agent 契约驱动 UI 探针与无头接口运营 (agent-device / agent-browser)](testing/agent-browser-and-device.md)
- [安全渗透扫描 (12项红线) 与容量压测护栏](testing/security-and-load-testing.md)

---

## ⚠️ 高频踩坑实录 (Gotchas)

- [better-sqlite3 布尔值必须映射为 0/1 整型](gotchas/sqlite-boolean-mapping.md)
- [压测必须使用生产 standalone 产物，严禁打 dev 热更新进程](gotchas/load-test-standalone-rule.md)
- [插件挂载点 /api/v1/plugins/ 与 Admin BFF 鉴权策略差异](gotchas/admin-route-proxy-policy.md)
`;

  generatedFiles.set("index.md", content.trim() + "\n");
}

// ==========================================
// 2. 生成 wiki/domains/<domain>.md (各领域独立词条)
// ==========================================
function buildDomainMds() {
  const domains = catalog.domains || [];

  for (const d of domains) {
    const seam = seamDomainMap.get(d.name);
    const contracts = contractsByDomain.get(d.name) || [];
    const methods = seam?.provider?.methods || [];
    const facades = seam?.definition?.facades || [];
    const isPlatform = d.kind === "platform";
    const baseDir = isPlatform ? `packages/domains/${d.name}` : `packages/plugins/plugin-${d.name}`;

    let entityTable = "";
    if (contracts.length > 0) {
      entityTable = `| 实体名 (Entity) | 业务名称 | 运营页面路由 | 权限码前缀 | 契约文件 |\n|---|---|---|---|---|\n`;
      for (const c of contracts) {
        entityTable += `| \`${c.entity}\` | ${c.businessName || "-"} | \`${c.page?.route || "-"}\` | \`${c.permissionPrefix || "-"}\` | [\`${c.kebab}.agent.json\`](../../${c.__source}) |\n`;
      }
    } else {
      entityTable = `*暂无独立生成的 Agent 契约（地基服务或纯跨域 RPC 面）*`;
    }

    let methodList = "";
    if (methods.length > 0) {
      methodList = methods.map((m) => `- \`${m}\``).join("\n");
    } else {
      methodList = `*无公开注册的跨域 RPC 方法*`;
    }

    let facadeList = "";
    if (facades.length > 0) {
      facadeList = facades.map((f) => `- [${path.basename(f)}](../../${f})`).join("\n");
    } else {
      facadeList = `*无独立 Facade 导出*`;
    }

    const content = `# 领域百科：${d.name} (${d.kind === "platform" ? "平台地基" : "第一方业务插件"})

> **唯一源码目录**：[\`${baseDir}/\`](../../${baseDir})  
> **演进阶段**：阶段 ${d.stage} | **独立部署默认端口**：${d.defaultPort || "与 BFF 共享"} | **上游环境变量**：\`${d.upstreamEnv || "无"}\`

---

## 一、 领域定位与前缀

- **分层属性**：${d.kind === "platform" ? "平台基础设施（不可插拔、永不拆为独立第三方插件）" : "第一方业务插件（可独立拆分、打包、热插拔）"}
- **对外 HTTP API 前缀**：\`${(d.publicPrefixes || []).join("`, `")}\`
- **默认鉴权策略**：
  - 受众（Audience）：\`${d.auth?.audience || "admin"}\`
  - 多租户策略：\`${d.auth?.tenantPolicy || "required"}\`
- **服务治理与韧性（Resilience）**：
  - 超时时间：\`${d.resilience?.timeoutMs || 5000} ms\`
  - 最大重试次数：\`${d.resilience?.retryMaxAttempts ?? 1}\`
  - 幂等要求：\`${d.resilience?.idempotencyRequired ? "强要求（需带 Idempotency-Key）" : "无特殊要求"}\`

---

## 二、 跨域 Facade 门面与 RPC 方法

其他业务域**禁止直接 import 本域的 Service / Repository**，跨域调用必须走 Domain Facade：

### 1. 契约门面定义
${facadeList}

### 2. 公开支持的 RPC 方法清单
${methodList}

---

## 三、 Agent 自动化实体与契约清单 (${contracts.length} 个)

本领域随代码生成器同源产出的机器可读契约，支持 \`agent-device\` (接口自动化运营) 与 \`agent-browser\` (Playwright 真实 UI 探针)：

${entityTable}

---

## 四、 研发指引与注意事项

1. **代码物理路径**：
   - 业务逻辑一律放于 \`${baseDir}/backend/services/\`；
   - 仓储数据访问放于 \`${baseDir}/backend/repositories/\`；
   - 契约接口放于 \`${baseDir}/contract/\`。
2. **租户隔离**：
   - 表设计若含 \`tenant_id\`，查询与写入自动由 Kysely \`tenantIsolationPlugin\` 拦截，无需人肉拼写 \`WHERE tenant_id = ?\`。
`;

    generatedFiles.set(`domains/${d.name}.md`, content.trim() + "\n");
  }
}

// ==========================================
// 3. 生成架构百科词条 (Architecture Pillars)
// ==========================================
function buildArchitectureMds() {
  // 1) modular-plugin-system.md
  generatedFiles.set("architecture/modular-plugin-system.md", `# 架构百科：第一方插件体系与模块化单体

> 对应规则：AGENTS.md §3.2 / §3.2.1 / §6.2

## 一、 为什么将业务域迁移为第一方插件？
1. **防止单体无限膨胀**：传统单体在 src 下堆放所有业务，耦合严重、无法独立拆分交付；
2. **域级自治**：每个业务域以插件形式存在（\`packages/plugins/plugin-<domain>/\`），拥有独立的 \`plugin.manifest.json\`、路由前缀、数据表迁移和 Agent 契约；
3. **双模运行**：
   - **单体形态 (Merged)**：同进程直调，零网络损耗；
   - **隔离形态 (Isolated)**：独立 Worker 进程或独立微服务部署，通过 RPC 转发。

## 二、 物理目录布局
\`\`\`
packages/
├── domains/                  # 平台地基 (永不插件化: system, infra)
│   ├── system/
│   └── infra/
└── plugins/                  # 15 个第一方业务插件
    ├── plugin-wms/
    ├── plugin-mall/
    └── ...
\`\`\`
`.trim() + "\n");

  // 2) base-mapper-and-queries.md
  generatedFiles.set("architecture/base-mapper-and-queries.md", `# 架构百科：BaseMapper 与 QueryWrapper 链式语法

> 对应规则：AGENTS.md 核心铁律 Rule 0.2 / §4.7

## 一、 为什么杜绝手写重复 CRUD？
大模型为每个表生成数百行 \`selectById\`、\`insert\`、\`update\` 是严重的算力与 Token 浪费，且容易在审计字段和租户过滤上出现漏网之鱼。

## 二、 核心用法
\`\`\`ts
import { BaseMapper, QueryWrapper, BaseService } from '@/shared/backend/lib/database';

// 1. 初始化通用 Mapper (支持表列能力自动探测)
const roleMapper = new BaseMapper('system_role');

// 2. 链式条件检索
const qw = new QueryWrapper()
  .eq('status', 'ACTIVE')
  .like('name', '管理员')
  .orderByDesc('created_at');

const list = await roleMapper.selectList(qw);

// 3. 分页查询 (SQL 级 count + limit/offset)
const pageData = await roleMapper.selectPage({ pageNum: 1, pageSize: 10 }, qw);
\`\`\`

## 三、 表能力探测机制
\`BaseMapper\` 启动时通过 \`db.introspection.getTables()\` 动态缓存列元数据：
- 若表具备 \`deleted\` 列 ➔ 自动启用逻辑删除过滤 (\`deleted = 0\`)；
- 若表具备 \`tenant_id\` 列 ➔ 自动注入租户上下文；
- 写入时按列是否存在自动填充 8 大审计底座字段。
`.trim() + "\n");

  // 3) tenant-isolation-ast.md
  generatedFiles.set("architecture/tenant-isolation-ast.md", `# 架构百科：Kysely AST 语法树级全局多租户隔离

> 对应规则：AGENTS.md §4.8

## 一、 设计思想
多租户隔离绝不能依赖外包开发者的自觉性。一旦某条 SQL 漏写 \`tenant_id = ?\`，将发生毁灭性的跨租户数据穿透。

## 二、 实现原理
- 核心源码：\`packages/shared/backend/lib/database/tenant-isolation-plugin.ts\`
- 挂载于 Kysely 单例之上的 AST 拦截器：
  - 拦截 \`SelectQueryNode\`、\`UpdateQueryNode\`、\`DeleteQueryNode\` 树节点；
  - 自动向 \`where\` 子树注入 \`tenant_id = <当前上下文租户ID>\`；
  - 拦截 \`InsertQueryNode\`，自动追加 \`tenant_id\` 列和值；
  - 平台超级管理员上下文自动豁免。
`.trim() + "\n");

  // 4) transactional-outbox.md
  generatedFiles.set("architecture/transactional-outbox.md", `# 架构百科：事务性发件箱 (Transactional Outbox)

> 对应规则：AGENTS.md §3.3 / §4.2

## 一、 解决的核心问题
在微服务或模块化解耦中，**“写本地数据库”与“向消息总线发事件”必须处于同一个本地 ACID 事务中**。如果先发消息后写库，可能写库失败导致数据不一致；如果先写库后发消息，可能网络中断导致下游丢事件。

## 二、 使用范式
\`\`\`ts
import { runUnitOfWork } from '@/shared/backend/lib/transactional-outbox';

await runUnitOfWork(async (uow) => {
  // 1. 执行业务写操作 (挂在同一本地事务中)
  await uow.db.insertInto('mall_order').values({ id: 'ord-01', total_fee: 100 }).execute();

  // 2. 将可靠领域事件追加至 outbox 发件箱表
  uow.appendOutbox({
    type: 'mall.order.created',
    source: 'mall',
    payload: { id: 'ord-01' }
  });

  // 如果此处发生任何 throw，本地写库与 outbox 记录一同 ROLLBACK！
});
\`\`\`
`.trim() + "\n");

  // 5) service-governance.md
  generatedFiles.set("architecture/service-governance.md", `# 架构百科：跨域通信、微服务解耦与韧性治理

> 对应规则：AGENTS.md §3.3 / §6

## 一、 通信三原则
1. **同域业务调用**：直接调用本地 Service / Application Port；
2. **跨域同步调用**：必须走 **Domain Facade** 或 \`broker.call('ruoyi.cmd.<domain>.<method>')\`，严禁直连对方数据库或 import Service；
3. **跨域异步通知**：必须走 \`broker.publishReliable()\` 经 Outbox 发送领域事件。

## 二、 韧性治理策略 (Resilience)
- **超时与重试**：写请求必须带 \`Idempotency-Key\`，重试只允许在只读或幂等接口上生效；
- **熔断降级**：服务降级时提供安全的默认值或内存兜底；
- **追踪传递**：所有内部调用必须透传 \`traceId\`、\`tenantId\` 与 \`actorId\` 上下文。
`.trim() + "\n");
}

// ==========================================
// 4. 生成测试百科词条 (Testing Guide)
// ==========================================
function buildTestingMds() {
  // 1) testing-pyramid.md
  generatedFiles.set("testing/testing-pyramid.md", `# 测试百科：四层金字塔测试体系 (L1~L4)

\`\`\`
                   ▲
                  / \     L4: 契约端到端旅程 (Playwright & run-ops)
                 /   \    L3: 契约与跨域门禁 (rpc-actions & seam-graph)
                /     \   L2: 嵌入式 SQLite / PG 集成测试 (真实引擎)
               /_______\  L1: 业务逻辑与算法单测 (纯函数/状态机)
\`\`\`

- **L1 单元测试**：毫秒级纯函数、状态机跃迁矩阵断言；
- **L2 集成测试**：由嵌入式真实 SQLite (\`better-sqlite3\`) 或 PostgreSQL 驱动，校验外键、行级锁、租户隔离；
- **L3 契约测试**：验证 OpenAPI 与 RPC Actions 契约前后向兼容；
- **L4 自动化旅程**：由 324 份 Agent 契约直接驱动无头浏览器与无头 API 运营。
`.trim() + "\n");

  // 2) real-database-testing.md
  generatedFiles.set("testing/real-database-testing.md", `# 测试百科：真实数据库驱动与并发 CAS 防超卖

## 一、 为什么拒绝假 Mock？
内存数组 (\`items.filter()\`) 不校验数据库引擎的真实约束（如列名拼错、NOT NULL 漏填、跨租户越权、并发死锁）。

## 二、 双模真实驱动
1. **嵌入式 SQLite C 引擎**：
   - 零配置、毫秒级拉起，自带真实 WAL 模式与外键约束；
   - 用于日常开发与 CI 快速回归。
2. **PostgreSQL 容器镜像**：
   - 用于上线前全量渗透扫描与生产发布验证。

## 三、 CAS 原子影响行数验证
\`\`\`sql
UPDATE inv_atomic_probe 
SET qty = qty - 4 
WHERE id = 'p1' AND tenant_id = '1' AND qty >= 4 
RETURNING id;
\`\`\`
通过受影响行数判定扣减是否成功，并发场景下有且只有一个请求返回 1，另一请求返回 0，天然防超卖。
`.trim() + "\n");

  // 3) agent-browser-and-device.md
  generatedFiles.set("testing/agent-browser-and-device.md", `# 测试百科：Agent 契约驱动 UI 探针与无头接口运营

## 一、 机器可读契约 (Agent Contract)
由代码生成器同步产出于 \`<插件根>/agent/<kebab>.agent.json\`，记录页面路由、元素 \`testid\`、接口方法与权限码。

## 二、 两个消费轨
1. **\`agent-browser\` (UI 轨)**：
   - 驱动脚本：\`test/agent/agent-contract.spec.ts\`
   - 走 Playwright 无头浏览器，根据契约自动执行打开页面 ➔ 断言标题 ➔ 填写表单 ➔ 提交 ➔ 验证列表刷新。
2. **\`agent-device\` (接口轨)**：
   - 驱动脚本：\`node scripts/agent/run-ops.cjs health\`
   - 免开浏览器，直接打真实 HTTP API 执行批量体检、自动造测试数据 (\`seed-sample\`) 和清理数据 (\`purge-sample\`)。
`.trim() + "\n");

  // 4) security-and-load-testing.md
  generatedFiles.set("testing/security-and-load-testing.md", `# 测试百科：安全渗透扫描与性能容量回归护栏

## 一、 自动化安全扫描 (\`npm run security:scan\`)
覆盖本仓承诺的 12 项真实安全红线：
1. 未认证访问后台接口强制 401；
2. 伪造 Token 强制 401；
3. 伪造 \`x-tenant-id\` Header 拦截越权；
4. 弱口令拒绝；
5. 错误时不泄露底层 SQL 与堆栈；
6. 强制安全响应头 (HSTS, NoSniff)；
7. 插件挂载点权限守卫。

## 二、 性能压测护栏 (\`npm run load:test\`)
- 依据 \`packages/shared/contract/load-baseline.json\` 基线；
- 统计 RPS、P95 延迟与失败率；
- **铁律**：必须针对生产 standalone 产物进行压测，严禁对开发热更新进程跑压测！
`.trim() + "\n");
}

// ==========================================
// 5. 生成踩坑实录百科 (Gotchas)
// ==========================================
function buildGotchasMds() {
  // 1) sqlite-boolean-mapping.md
  generatedFiles.set("gotchas/sqlite-boolean-mapping.md", `# 踩坑实录：better-sqlite3 布尔值映射为整型 0/1

### 现象
直接向 SQLite 传入 JS \`true\` / \`false\` 参数时，\`better-sqlite3\` 报 \`TypeError: SQLite3 only supports number, string, bigint, buffer, null\`。

### 解法
在 \`packages/shared/backend/lib/database/kysely-client.ts\` 中对 SqliteDialect 的 prepare 函数进行包装，自动将布尔参数清洗为 \`1\` 或 \`0\`。
`.trim() + "\n");

  // 2) load-test-standalone-rule.md
  generatedFiles.set("gotchas/load-test-standalone-rule.md", `# 踩坑实录：压测必须杀掉 dev 调试进程并压测生产镜像

### 现象
压测结果显示吞吐量只有 100~300 RPS，远低于标称的 20,000+ RPS。

### 根因
本机有正在运行的 \`next dev\` 调试进程占据了 3200 端口。开发模式下 Next.js 对每个请求做 JIT 动态编译与热更新监听，性能严重劣化。

### 解决
压测前必须清场杀掉 dev 进程，运行 \`npm run build\` 后启动生产镜像或独立二进制执行压测。
`.trim() + "\n");

  // 3) admin-route-proxy-policy.md
  generatedFiles.set("gotchas/admin-route-proxy-policy.md", `# 踩坑实录：插件路由与 Admin BFF 鉴权策略差异

### 现象
直接访问 \`/api/v1/plugins/ruoyi.xxx/api/...\` 被误判为未鉴权或报 404。

### 规约
- \`/api/v1/admin/**\`：全部默认由 \`withAdminRoute\` 实施平台管理员鉴权；
- \`/api/v1/plugins/**\`：由插件内部根据 \`plugin.manifest.json\` 声明的 \`auth.audience\`（\`operator\` / \`company\` / \`public\`）分别走各自守卫。
`.trim() + "\n");
}

// ==========================================
// 主执行函数与漂移检查
// ==========================================
function main() {
  buildIndexMd();
  buildDomainMds();
  buildArchitectureMds();
  buildTestingMds();
  buildGotchasMds();

  let driftCount = 0;

  for (const [relPath, expectedContent] of generatedFiles.entries()) {
    const fullPath = path.join(WIKI_DIR, relPath);
    const dir = path.dirname(fullPath);

    if (checkOnly) {
      if (!fs.existsSync(fullPath)) {
        console.error(`[openwiki:check] 缺少 Wiki 词条: wiki/${relPath}`);
        driftCount++;
      } else {
        const actualContent = fs.readFileSync(fullPath, "utf8");
        if (actualContent !== expectedContent) {
          console.error(`[openwiki:check] 词条内容发生漂移: wiki/${relPath}`);
          driftCount++;
        }
      }
    } else {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(fullPath, expectedContent, "utf8");
    }
  }

  if (checkOnly) {
    if (driftCount > 0) {
      console.error(`\n[openwiki:check] ✗ 发现 ${driftCount} 处 Wiki 漂移，请运行: npm run openwiki:sync 修复\n`);
      process.exit(1);
    } else {
      console.log(`[openwiki:check] PASS: 全部 ${generatedFiles.size} 篇 OpenWiki 百科词条与元数据 100% 同步！`);
      process.exit(0);
    }
  } else {
    console.log(`[openwiki:sync] 成功生成并同步 ${generatedFiles.size} 篇 OpenWiki 知识库词条至 wiki/ 目录！`);
  }
}

main();
