# ruoyi-all-next 同步任务看板（执行版）

更新时间：2026-08-02

## 1. 规则

1. 任务状态只能使用：`TODO`、`DOING`、`DONE`
2. 一个域必须按“六要素”逐项打勾
3. 一个域未完成前，不得跳过到下一域宣称全量同步

六要素：

1. API
2. Service
3. Page
4. Permission + Menu
5. Log + Audit
6. Test

## 2. P0 任务（先闭环）

| 域 | 状态 | API | Service | Page | Permission | Log/Audit | Test | 备注 |
|---|---|---|---|---|---|---|---|---|
| system-online-users | DOING | DONE | DONE | DONE | DONE | DONE | DONE | 已有骨架，需接真实会话存储 |
| system-login-logs | DOING | DONE | DONE | DONE | DONE | DONE | TODO | 需接登录事件落库 |
| system-operate-logs | DOING | DONE | DONE | DONE | DONE | DONE | TODO | 需接操作日志索引 |
| infra-configs | DOING | DONE | DONE | DONE | DONE | DONE | DONE | 需接配置持久层 |
| infra-job-center | DOING | DONE | DONE | DONE | DONE | DONE | DONE | 需接真实调度引擎 |
| infra-api-logs | DOING | DONE | DONE | DONE | DONE | DONE | DONE | 需接请求日志流水 |
| bpm-process-definitions | DOING | DONE | DONE | DONE | DONE | TODO | TODO | 需接真实流程定义持久层与发布能力 |
| bpm-tasks | DOING | DONE | DONE | DONE | DONE | DONE | TODO | 需接真实任务引擎与实例状态机 |

## 3. P1 任务（通用中台）

| 域 | 状态 | 备注 |
|---|---|---|
| bpm | TODO | 流程定义、审批任务、表单设计 |
| pay | TODO | 支付应用、支付单、退款单、回调 |
| report | TODO | 报表与大屏模板化 |
| mp | DOING | 已完成账号/粉丝/消息发送骨架，待接真实微信渠道 |
| member | TODO | 会员与积分体系 |

## 4. P2 任务（行业域）

| 域 | 状态 | 备注 |
|---|---|---|
| mall | TODO | 商品交易促销统计拆域 |
| crm | DOING | 已完成客户/线索/跟进骨架，待接商机转化流程 |
| erp | DOING | 已完成商品/订单/库存调整骨架，待接进销存台账闭环 |
| wms | TODO | 仓储作业 |
| mes | TODO | 生产执行 |
| ai | TODO | 模型与调用治理 |
| iot | TODO | 设备网关与告警 |
| im | TODO | 会话与消息 |
