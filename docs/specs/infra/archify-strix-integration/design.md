# 设计：开源顶流技能吸收：Archify 架构可视化与 Strix 自主渗透防御

上游：`docs/features/archify-strix-integration/requirements.md`（本文件不得反向修改需求）

## 1. 架构

Archify 输出静态声明式 JSON 与单文件交互 HTML，挂载于 docs/03_design/diagrams/；Strix 作为外部红队智能体靶向测试本地 BFF 与插件路由，防御基线与测试结果收敛至 docs/architecture/artifacts/。

## 2. 数据

| 表 | 说明 |
|---|---|
| `-` | 本特性为基础设施技能与安全架构增强，不涉及业务表新建 |

表定义真源 = 低代码元数据（AGENTS §9.5），不手写 DDL。

## 3. 关键不变量

1. **真实防御纵深不变量** —— 无论外部如何伪造请求头或制造并发竞争，Kysely AST 租户隔离与 CAS 乐观锁防线严格不可穿透

## 4. UI

* Archify 交互式单文件 HTML 架构图（docs/03_design/diagrams/ruoyi-architecture.arch.html），支持点击节点高亮链路、按领域过滤与组件拖拽

## 5. 运维与运营

* 门禁链：npm run check 验证门禁合规与 OpenWiki 百科同步
* 压测基准：test/load/k6-load-benchmark.js 支持本地与 CI 自动化压测执行
* 红队渗透：host-exec 穿透调用 ghcr.io/usestrix/strix-sandbox:latest 容器

## 6. 风险

| 风险 | 处理 |
|---|---|
| 外部容器工具体积过大占用空间 | 遵循容器环境与宿主机穿透准则，不在本仓库内存储任何镜像层或大二进制包 |
