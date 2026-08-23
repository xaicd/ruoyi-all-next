const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'docs', 'skills', 'ruoyi-all-next');
const dstDir = path.join(__dirname, '..', '.agents', 'skills');

const enhancedSkills = {
  'ui-design': `---
name: ui-design
description: 管理端与 C 端 UI/UX 设计。融合 Vercel、ui-ux-pro-max、Shadcn 与跨端移动交互顶级规范。
---

# UI/UX 设计与前端组件全端规范 (融合开源顶级标准)

## 1. 适用场景
- 开发管理后台（Admin Web）、C 端移动 H5、UniApp 小程序、Flutter 原生 App、Desktop-PC 桌面端。
- 制定色彩 Token、布局栅格、无障碍访问（a11y）、移动手势交互与性能优化。

## 2. 权威依据与吸收来源
- \`AGENTS.md\` §3.2, §4.4, §6.1, §14.4
- **Vercel Agent Skills**：Core Web Vitals（LCP < 2.5s, CLS < 0.1, INP < 200ms）、RSC 渲染架构
- **ui-ux-pro-max-skill**：60+ 种现代风格检索、HSL 色彩微调、贝塞尔动效曲线
- **Shadcn/UI & Radix UI**：无头组件（Headless）、键盘无障碍交互、状态与样式完全解耦
- **Wot Design Uni & UniApp 官方**：移动端触控手势、安全区（Safe-Area）沉浸式适配

## 3. 设计系统与色彩 Token 规范
\`\`\`css
:root {
  /* HSL 调色板: 沉稳专业、高对比度、无刺眼纯色 */
  --primary: 217 91% 60%;         /* 主色科技蓝 */
  --primary-foreground: 0 0% 100%;
  --background: 210 40% 98%;      /* 浅灰底色 */
  --card: 0 0% 100%;
  --border: 214 32% 91%;
  --muted: 215 16% 47%;
  
  /* 阴影层次系统 (微拟物/层级感) */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);

  /* 动效曲线 (流畅自然) */
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
}
\`\`\`

## 4. 移动端与小程序专属交互规范 (C 端三必做)
1. **安全区域适配（Safe Area Insets）**：
   - 顶部导航必须避让状态栏与小程序胶囊按钮（\`padding-top: env(safe-area-inset-top)\`）；
   - 底部操作栏必须避让 iPhone 横条（\`padding-bottom: env(safe-area-inset-bottom)\`）。
2. **移动端经典手势支持**：
   - **下拉刷新（Pull to Refresh）**：顶部平滑阻尼下拉与回弹；
   - **无限触底加载（Infinite Scroll）**：距底部 100px 提前预加载下一页数据，并展示 Loading Spinner；
   - **空态与骨架屏（Skeleton Loading）**：首屏加载必出骨架屏，禁止突兀白屏。
3. **触控热区与无障碍（A11y）**：
   - 所有可点击按钮/图标最小触控尺寸不得小于 **44x44px**；
   - 颜色对比度符合 WCAG 2.1 AA 标准（文本与背景对比度 >= 4.5:1）。

## 5. 管理端三段式页面标准
1. **搜索栏（SearchForm）**：折叠/展开多条件，支持回车直接触发查询。
2. **工具栏与表格（Table & Toolbar）**：支持批量操作、列筛选显隐、单行双击预览。
3. **弹窗表单（FormModal）**：支持 ESC 关闭、表单校验高亮聚焦第一个错误项。

## 6. 绝对禁止项
- 严禁按钮缺失 \`cursor: pointer\` 与 \`:focus-visible\` 轮廓线。
- 严禁在小程序端一次性渲染数千条 DOM 导致 \`setData\` 内存崩溃。
- 严禁在 C 端直接复用未做移动端适配的宽屏数据表格。
`,

  'api-design': `---
name: api-design
description: 版本化 HTTP/RPC 契约。融合 Microsoft REST Guidelines 与 OpenAPI 3.1 业界标准。
---

# API 契约与接口设计规范 (融合微软与 OpenAPI 标准)

## 1. 适用场景
- 新增或重构对外 HTTP API、DTO 数据传输对象、参数校验。
- 编写跨端客户端 API 调用层与微服务 RPC 通信契约。

## 2. 权威依据与吸收来源
- \`AGENTS.md\` §3.1, §3.3, §4.1, §4.3
- **Microsoft REST API Guidelines**：统一命名、错误模型、幂等重试机制、批量操作规范
- **OpenAPI 3.1 Specification**：JSON Schema 验证、多端自动代码生成契约
- **W3C Trace Context**：分布式全链路请求头传递

## 3. 标准 URL 命名与 HTTP 动词映射

| 动作类型 | HTTP 动词 | URL 示例 | 语义说明 |
|---|---|---|---|
| 列表分页查询 | \`GET\` | \`/api/v1/admin/mall/spu\` | 支持 \`page\`, \`pageSize\`, \`keyword\` |
| 获取单个详情 | \`GET\` | \`/api/v1/admin/mall/spu/:id\` | 资源不存在返回 404 |
| 创建新资源 | \`POST\` | \`/api/v1/admin/mall/spu\` | 成功返回 200/201 及新实体 |
| 完整更新资源 | \`PUT\` | \`/api/v1/admin/mall/spu/:id\` | 必须包含完整实体字段 |
| 局部状态变更 | \`PATCH\` | \`/api/v1/admin/mall/spu/:id/status\` | 仅更新状态字段 |
| 删除指定资源 | \`DELETE\` | \`/api/v1/admin/mall/spu/:id\` | 支持单删或批量 (\`?ids=1,2,3\`) |
| 复杂非 CRUD 操作 | \`POST\` | \`/api/v1/admin/pay/order/:id/refund\` | 使用特定动词子路径 |

## 4. 幂等性与防重提交机制 (Idempotency)
针对资金支付、订单创建等写接口，客户端必须在请求头中携带：
- \`Idempotency-Key: <UUID / NanoID>\`
- 服务端在 Redis 中缓存该 Key 的执行结果 5 分钟，若检测到重复 Key，直接返回初次执行结果，避免重复扣款/建单。

## 5. 统一标准响应与错误对象模型
\`\`\`typescript
export interface ApiResponse<T = any> {
  code: number          // 0 为成功，非 0 业务错误码 (如 40001)
  data: T               // 业务负载数据
  msg: string           // 用户可读的友好提示文案
  traceId?: string      // W3C 链路追踪 ID (用于日志定位)
}

// 错误响应时的字段级详细 Issue (遵循 RFC 7807)
export interface ApiErrorDetail {
  field: string         // 出错字段 (如 "mobile")
  message: string       // 校验失败原因 (如 "手机号格式不正确")
}
\`\`\`

## 6. 绝对禁止项
- 严禁在 URL 中出现大写字母或下划线（统一小写短横线 kebab-case）。
- 严禁成功请求返回非 200 HTTP 状态码但包含业务错误数据。
- 严禁客户端直接传入未做 Zod 校验与类型清洗的裸对象。
`,

  'service-governance': `---
name: service-governance
description: 超时重试、熔断降级、隔板舱壁、限流防刷、链路追踪。融合 Resilience4j 与 OpenTelemetry 顶级规范。
---

# 服务治理与高可用保障规范 (融合 Resilience4j & OpenTelemetry)

## 1. 适用场景
- 生产环境流量管控、服务间同步 RPC 与异步消息调用。
- 熔断降级、防刷限流、分布式链路追踪与指标监控。

## 2. 权威依据与吸收来源
- \`AGENTS.md\` §3.3, §4.5
- **Resilience4j / Hystrix**：熔断状态机（CircuitBreaker）、隔板隔离（Bulkhead）、指数退避重试
- **OpenTelemetry & W3C Trace Context**：分布式追踪 \`traceparent\` 标准协议
- **Redis Sliding Window Rate Limiter**：分布式高精度滑动窗口限流

## 3. 分布式断路器三态机 (Circuit Breaker State Machine)
\`\`\`
       [ CLOSED (正常通信) ]
             │  失败率 > 50% (样本 >= 10)
             ▼
       [ OPEN (熔断开路，快速失败) ]
             │  休眠窗口等待 5000ms
             ▼
    [ HALF-OPEN (半开探测，放行 3 个探针请求) ]
        ├── 探测成功 ──► [ CLOSED (自动恢复) ]
        └── 探测失败 ──► [ OPEN (继续熔断) ]
\`\`\`

## 4. 带抖动的指数退避重试策略 (Exponential Backoff with Jitter)
- 严禁所有重试请求在同一毫秒发起导致“惊群效应”打崩下游。
- 公式：\`WaitTime = min(MaxWait, BaseWait * 2^attempt) + RandomJitter(0~100ms)\`。
- 只对只读幂等接口进行重试，写接口必须搭配 \`Idempotency-Key\`。

## 5. 分布式限流多层防护网
1. **全局网关限流**：单 IP 每秒最多 100 次请求（防基础 DDoS / 爬虫）。
2. **鉴权端点限流**：\`/auth/login\`、\`/auth/send-code\` 单 IP 每分钟最多 5 次（防撞库与短信轰炸）。
3. **业务写接口限流**：单用户每秒最多 2 次（防连击与恶意刷单）。
4. 超限统一返回 \`HTTP 429 Too Many Requests\` 并附带 \`Retry-After: 60\`。

## 6. 全链路追踪规范 (W3C Trace Context)
- 网关生成或继承标准 \`traceparent\`：\`00-{traceId}-{spanId}-{flags}\`。
- 所有应用层日志、RPC 调用、异步事件投递必须自动注入该 \`traceId\`。

## 7. 绝对禁止项
- 严禁无超时时间（Timeout = 0）的跨网络请求。
- 严禁在发生熔断时直接吞掉异常不抛出告警。
- 严禁单机内存计数作为多副本集群环境下的全局限流方案。
`,

  'devops': `---
name: devops
description: 容器化编排、Traefik 网关、SSL 证书自动签发轮换、平滑发布。融合云原生 CNCF 与 Docker 顶级标准。
---

# DevOps 运维部署与发布规范 (融合 CNCF 云原生标准)

## 1. 适用场景
- Docker Multi-Stage 极小化镜像构建。
- Traefik 边缘路由、Let's Encrypt SSL 证书自动签发与全自动轮换。
- 生产环境健康检查探针、平滑滚动发布与版本回滚。

## 2. 权威依据与吸收来源
- \`AGENTS.md\` §9, §10
- **Docker Multi-Stage Build**：多阶段构建极小化生产镜像（剥离 devDependencies，体积缩减 70%）
- **Traefik Proxy 3.x**：基于 Docker Label 的全自动服务发现与 ACME TLS 自动化
- **Kubernetes Pod Lifecycle Standards**：Startup / Liveness / Readiness 三探针体系

## 3. 多阶段构建极小化 Dockerfile 范式
\`\`\`dockerfile
# 1. 依赖安装阶段
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2. 源码构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. 生产极小化运行阶段 (仅包含 Standalone 产物)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3100
CMD ["node", "server.js"]
\`\`\`

## 4. 容器健康检查三探针 SOP
1. **启动探针（Startup Probe）**：验证应用冷启动完成（端口监听就绪）。
2. **存活探针（Liveness Probe）**：定时请求 \`GET /api/v1/open/health\`，连续 3 次失败则自动重启容器。
3. **就绪探针（Readiness Probe）**：验证数据库与 Redis 连接池正常，就绪后才接入外部流量。

## 5. Traefik 生产级域名与 SSL 自动续期
- 配置文件中开启 ACME TLS Challenge，Let's Encrypt 证书在到期前 30 天由 Traefik 后台无感自动续签。
- 全站强制启用 **HSTS（HTTP Strict Transport Security）** 与 **TLS 1.3** 加密套件。

## 6. 绝对禁止项
- 严禁生产镜像以 \`root\` 超级用户权限运行主进程（必须使用 \`USER node\`）。
- 严禁把数据库密码或私钥打入 Docker 镜像层（必须通过环境变量或 Secret 挂载）。
- 严禁更新服务时直接 \`down\` 导致服务完全中断（必须使用滚动更新 \`--no-deps -d app\`）。
`
};

for (const [skillName, content] of Object.entries(enhancedSkills)) {
  const docsPath = path.join(srcDir, skillName + '.SKILL.md');
  fs.writeFileSync(docsPath, content.trim() + '\n', 'utf8');

  const agentSubDir = path.join(dstDir, skillName);
  if (!fs.existsSync(agentSubDir)) fs.mkdirSync(agentSubDir, { recursive: true });
  const agentPath = path.join(agentSubDir, 'SKILL.md');
  fs.writeFileSync(agentPath, content.trim() + '\n', 'utf8');

  console.log('Deeply enhanced skill with open-source industry standards:', skillName);
}

console.log('All skills successfully upgraded with top-tier open-source patterns!');
