# 需求：开源顶流技能吸收：Archify 架构可视化与 Strix 自主渗透防御

状态：`PLAN_APPROVED`　类型：`enhancement`　特性：`archify-strix-integration`　域名：`infra`

## 1. 目标

深度吸收开源顶流 tt-a1i/archify (47k★ MIT) 与 usestrix/strix (60k★ Apache-2.0)，生成交互式可机器验证的架构拓扑图谱，构筑基于真实数据库的四大安全渗透防御靶标。


## 2. 角色

| 角色 | 能力 |
|---|---|
| 系统架构师 | 使用 Archify 生成并维护交互式拓扑图（.arch.json / .arch.html），以可视化路径追踪洞察 17 领域全连接与边缘网关流量 |
| 安全与 SRE 工程师 | 依托宿主机穿透调度 Strix 沙箱靶机，基于真实数据库验证四大防御靶标（Zero Fake PoC），保障生产发布门禁 (G5) |

## 3. 用户故事（按优先级）

1. **P0** 吸收 archify 技能规范至 .agents/skills/archify/，生成全域架构拓扑 docs/03_design/diagrams/ruoyi-architecture.arch.json 与可交互 HTML。
2. **P0** 吸收 strix-penetration-testing 技能规范至 .agents/skills/strix-penetration-testing/，明确四大防御靶标与宿主机穿透准则。
3. **P1** 编写 K6 真实压测基准脚本 test/load/k6-load-benchmark.js，与本地独立压测基线（26,877 RPS）对齐，通过 20 道门禁总检。

## 4. 约束

* 宿主机穿透调用：严禁将 Strix 庞大的外部 Python 代码拷入代码库，必须通过宿主机穿透命令（host-exec）以 Docker 沙箱容器方式调度。
* 真实数据库支撑：所有安全渗透与压测必须依托真实数据库环境，严禁前端伪造 Mock。
* 零商业传染性：引入的开源技术 100% 为 MIT 与 Apache-2.0 商业友好许可。

## 5. 验收标准

1. `npm run check` exit=0，20 道门禁全部通过
2. docs/03_design/diagrams/ruoyi-architecture.arch.html 浏览器可交互加载并展示 17 领域拓扑
3. `npm run skills:check` 验证 36 项技能规范且无重复目录

## 6. 不做什么

* 不在代码仓库内直接维护 Strix 的 Python 3.12 虚拟环境与底层依赖包
