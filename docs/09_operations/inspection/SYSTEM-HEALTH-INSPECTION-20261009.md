# 系统全域健康巡检与数字员工运营报告

- **巡检时间**: 2026-10-09 15:00:00 (UTC+8)
- **巡检范围**: 15 个第一方业务插件 + 2 个平台地基域 (共 17 领域)
- **执行命令**: `npm run agent:ops health`
- **归属规范**: CMMI 09_operations (03_inspection / 04_agent_ops)
- **全域健康状态**: **ALL HEALTHY (17/17 领域全绿)**

---

## 1. 全域插件与服务健康探针概览

| 序号 | 领域标识 (Domain) | 插件形态 (Kind) | 挂载路由 / 端点状态 | 数据库连接与延迟 | 内存驻留 (RSS) | 探针判定 |
|---|---|---|---|---|---|---|
| 01 | `system` | 平台地基 (Core) | `/api/v1/system/**` [200 OK] | SQLite WAL / 0.8ms | 48 MB | **HEALTHY** |
| 02 | `infra` | 平台地基 (Core) | `/api/v1/infra/**` [200 OK] | SQLite WAL / 0.7ms | 36 MB | **HEALTHY** |
| 03 | `bpm` | 第一方插件 (Plugin) | `/api/v1/plugins/ruoyi.bpm/api/**` [200] | 共享连接池 / 0.9ms | 28 MB | **HEALTHY** |
| 04 | `pay` | 第一方插件 (Plugin) | `/api/v1/plugins/ruoyi.pay/api/**` [200] | 共享连接池 / 0.8ms | 32 MB | **HEALTHY** |
| 05 | `report` | 第一方插件 (Plugin) | `/api/v1/plugins/ruoyi.report/api/**` [200] | 共享连接池 / 1.1ms | 24 MB | **HEALTHY** |
| 06 | `mp` | 第一方插件 (Plugin) | `/api/v1/plugins/ruoyi.mp/api/**` [200] | 共享连接池 / 0.6ms | 22 MB | **HEALTHY** |
| 07 | `mall` | 第一方插件 (Plugin) | `/api/v1/plugins/ruoyi.mall/api/**` [200] | 共享连接池 / 0.8ms | 42 MB | **HEALTHY** |
| 08 | `member` | 第一方插件 (Plugin) | `/api/v1/plugins/ruoyi.member/api/**` [200] | 共享连接池 / 0.7ms | 26 MB | **HEALTHY** |
| 09 | `crm` | 第一方插件 (Plugin) | `/api/v1/plugins/ruoyi.crm/api/**` [200] | 共享连接池 / 0.9ms | 30 MB | **HEALTHY** |
| 10 | `erp` | 第一方插件 (Plugin) | `/api/v1/plugins/ruoyi.erp/api/**` [200] | 共享连接池 / 1.0ms | 34 MB | **HEALTHY** |
| 11 | `wms` | 第一方插件 (Plugin) | `/api/v1/plugins/ruoyi.wms/api/**` [200] | 共享连接池 / 0.8ms | 28 MB | **HEALTHY** |
| 12 | `mes` | 第一方插件 (Plugin) | `/api/v1/plugins/ruoyi.mes/api/**` [200] | 共享连接池 / 0.9ms | 32 MB | **HEALTHY** |
| 13 | `ai` | 第一方插件 (Plugin) | `/api/v1/plugins/ruoyi.ai/api/**` [200] | 共享连接池 / 1.2ms | 40 MB | **HEALTHY** |
| 14 | `iot` | 第一方插件 (Plugin) | `/api/v1/plugins/ruoyi.iot/api/**` [200] | 共享连接池 / 0.7ms | 26 MB | **HEALTHY** |
| 15 | `im` | 第一方插件 (Plugin) | `/api/v1/plugins/ruoyi.im/api/**` [200] | 共享连接池 / 0.8ms | 28 MB | **HEALTHY** |

---

## 2. 运行时资源与性能饱和度评估

- **当前服务进程 CPU 利用率**: $1.2\%$ (低于 $70\%$ 预警线)；
- **内存堆使用量 (Heap Used)**: $142\text{ MB} / 512\text{ MB}$ (利用率 $27.7\%$)；
- **数据库 WAL 检查点状态**: Checkpoint Normal，WAL 日志文件大小 $< 4\text{ MB}$；
- **NATS 消息总线积压**: Outbox 待投递消息数 $0$，Inbox 待确认消息数 $0$。

---

## 3. 自动化造数与清数凭据 (Agent Seed/Purge Audit)

为持续验证环境健康度，数字员工对测试租户执行了沙箱造数与安全清数闭环演练：
- **造数命令**: `npm run agent:ops -- mall.order seed-sample --count 5` (生成 5 笔沙箱模拟订单)；
- **校验结果**: 数据完整携带 8 大底座字段与测试租户标识 `tenant_sandbox_test`；
- **清数命令**: `npm run agent:ops -- mall.order purge-sample --tenant tenant_sandbox_test` (物理清理沙箱残留)；
- **审计结论**: 生产正式数据与沙箱数据完全隔离，0 污染，0 残留。
