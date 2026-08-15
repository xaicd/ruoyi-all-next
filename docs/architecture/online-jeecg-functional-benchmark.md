# JeecgBoot Online 功能对标与安全设计档案

> 状态：功能学习归档（只读分析）  
> 原始样本：`JeecgBoot/jeecg-boot/db/jeecgboot-mysql-5.7.sql`  
> 使用原则：JeecgBoot Online 仅作为产品能力对标，不复制其不可控后端实现。

## 目的

本档案保留 Online 低代码引擎的功能学习结论，为 `ruoyi-all-next` 后续设计、排期和评审提供依据。目标是实现安全的在线数据模型设计、Puck 页面设计、浏览器真实 Online Test 和从 Published Release 生成代码，而不是实现可执行脚本或任意数据库操作平台。

## 当前实现状态

- 已完成：租户隔离的 Definition / Draft Revision / Immutable Release 生命周期、乐观锁、结构化 Model IR、语义化 Schema Plan、字段 Interaction IR、`SINGLE` / `TREE` / `MASTER_DETAIL` Draft 校验、字段投影，以及仅对 Published `SINGLE + GENERIC_RECORD` Release 开放的 actor-owned sandbox Online Test CRUD。
- Online Test 使用固定 `online_record` 表，不创建动态业务表；每条测试记录均绑定 tenant、Definition、不可变 Release 与测试 Session。新增 migration 尚未部署，必须走审批后的 staging/production runbook。
- 当前唯一写入事实来源是 `revision.model_json + interaction_json`；`online_field` 是同一事务产生的结构化投影，供管理查询、发布快照和后续 Runtime 编译使用，不允许独立写入造成双写漂移。
- 未启用：动态 DDL、任意 SQL/脚本、Puck Runtime、生产 Runtime CRUD、受控报表/图表/仪表盘、工作流执行和 Release 代码生成。

## Jeecg Online 能力地图

| 能力域 | Jeecg 表 | 可观察到的产品能力 | 本项目安全对应 |
| --- | --- | --- | --- |
| 数据模型 | `onl_cgform_head`、`field`、`index` | 表、字段、索引、树、主子表配置 | Definition、Revision、Field、Index、Relation、Model IR |
| 表单交互 | `onl_cgform_field`、`button` | 控件、字典、校验、查询、列表/表单展示、动作 | Field Interaction IR、注册 Action |
| 权限 | `onl_auth_data/page/relation` | 行数据、页面、控件、角色约束 | 服务端 Field/Action/Row Policy |
| 报表 | `onl_cgreport_head/item/param` | 参数化列表、排序、分组、汇总 | 后续受控 Query/Aggregation IR |
| 页面与仪表盘 | `onl_drag_*` | 物料、数据集、布局、组件实例、分享 | OnlineView + Puck allowlist + Release snapshot |
| 图表 | `onl_graphreport_*` | 维度、指标、图表模板、参数 | 后续受控 Chart Definition |

## 已验证的 Jeecg 元数据分组

- **权限：**`onl_auth_data`、`onl_auth_page`、`onl_auth_relation`。
- **表单/模型：**`onl_cgform_head`、`onl_cgform_field`、`onl_cgform_index`、`onl_cgform_button`，以及 Java/JS/SQL 增强表。
- **动态报表：**`onl_cgreport_head`、`onl_cgreport_item`、`onl_cgreport_param`。
- **拖拽页面/数据集：**`onl_drag_comp`、`onl_drag_dataset_*`、`onl_drag_page`、`onl_drag_page_comp`、`onl_drag_share`、`onl_drag_table_relation`。
- **图表：**`onl_graphreport_head`、`item`、`params`、`templet`、`templet_item`。

## 需吸收的设计能力

1. **结构化模型。**字段、索引、关联、树语义和主子表语义应属于版本化 Revision，而不是由页面推断。
2. **结构化交互。**字段应有 widget、字典/lookup、required、readonly、查询操作符、列表/表单/详情可见性和排序等受校验元数据。
3. **策略分层。**字段读写、动作执行和行数据范围需分别建模，并在服务端编译和执行。
4. **页面分离。**数据模型与页面布局分离；页面只引用 Definition、View、Field 和 Action。
5. **逐层扩展。**Runtime CRUD 稳定后，再引入报表、图表、仪表盘、受控共享和发布版代码生成。
