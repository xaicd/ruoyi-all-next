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


## `onl_cgform_*` 表结构的完整安全映射

本节以 Jeecg SQL 中实际存在的全部七张 `onl_cgform_*` 表为基准。它们用于产品能力对标；本系统不复制其动态执行机制。

| Jeecg 元数据表 | 观察到的职责 | 本系统持久化事实来源与投影 | 安全处理 |
| --- | --- | --- | --- |
| `onl_cgform_head` | 表单类型、分类、主键策略、分页/选择、树、模板与主题属性 | `OnlineDefinition` 身份 + `OnlineRevision.interaction_json.settings` | 只接受固定枚举；不保存任意模板、URL 或自由扩展 JSON |
| `onl_cgform_field` | 字段类型、长度/精度、默认值、备注、控件、可见性、只读、字典、查询及校验 | `OnlineRevision.model_json.fields` + `interaction_json.fields`；同步到 `online_field` | 字典仅保存受控 code；控件、formatter、operator、rule key 均为 allowlist |
| `onl_cgform_index` | 普通/唯一索引和有序字段列表 | `model_json.indexes`；同步到 `online_index` | 仅生成语义 Schema Plan；无 SQL、无 apply、无动态 DDL |
| `onl_cgform_button` | 受页面位置、排序、样式约束的按钮定义 | `interaction_json.actions`；同步到 `online_action` | 仅内置 CRUD / 导入导出 / 工作流动作类型；无表达式、无任意 handler |
| `onl_cgform_enhance_java` | Java 增强 | 不持久化 | 明确禁止用户配置 Java 类、类名或事件代码 |
| `onl_cgform_enhance_js` | JavaScript、字段联动和页面生命周期增强 | 不持久化 | 用受控字段 IR、固定 formatter 和注册服务端动作替代；禁止脚本 |
| `onl_cgform_enhance_sql` | SQL 增强 | 不持久化 | 明确禁止 SQL、动态查询、配置化数据库写入 |

### Draft → Release 数据一致性

每次 Draft 保存以 `model_json + interaction_json` 为唯一可编辑事实来源；同一 Kysely transaction 会重新生成 `online_field`、`online_index`、`online_relation` 和 `online_action` 投影。关联目标必须属于当前 tenant，并且目标 Definition 的当前 Draft 中存在被引用字段。

Draft 校验会再次编译模型、字段交互、查询/校验、索引、关联、内置动作和 Puck allowlist。发布时，归一化的模型/交互配置及四类投影一并进入不可变 `online_release.snapshot_json`；随后原样克隆到下一个 Draft。Runtime 仍只读取已发布 Release，绝不读取可变 Draft 或页面输入。

## 截图学习：页面级 Online 表单开发体验

> 样本：用户提供的 Jeecg Online 页面截图。以下仅记录可见产品功能，不推断、复制或依赖其未公开后端实现。

### 1. Online 表单资产列表（不是单一编辑器）

截图显示 Online 表单开发首先是一个可治理的资产列表：

- 多条件检索：表名、表类型、表描述，带查询、重置和高级查询入口。
- 创建与批量操作：新增、清空已选、导入数据库表。
- 表单级操作入口：编辑、更多操作、代码生成，以及受控的自定义按钮/增强能力入口。
- 可观测列表列：表类型、表名、表描述、版本、同步状态、创建时间和操作。
- 在左侧信息架构中，Online 表单开发与报表、数据源规则、系统校验规则、生成器案例并列，而非隐藏在一个 Puck 页面里。

**本项目吸收方式：**Online Definition 应有独立的列表管理页、检索、类型筛选、状态、Draft/Release 版本、最近更新时间、设计入口、复制、归档、沙箱测试和 Release 代码生成入口。业务用户先管理“在线表单资产”，再进入具体设计工作区。

### 2. 新建/编辑表单头部属性

截图中的表单头部是明确的产品配置区，包含：

- 表名、表描述、表类型（单表/树表/主子表）。
- 表单分类。
- 主键策略。
- 查询模式。
- 主题模板、表单布局样式、滚动条。
- 是否显示复选框、是否分页、是否为树。

**本项目安全对应：**

| 页面能力 | 受控 Online IR | 处理原则 |
| --- | --- | --- |
| 表名/描述/类型 | Definition `code`、`name`、`modelType` | tenant 内唯一；不等同于可执行物理表名 |
| 表单分类 | `definition.category`（后续） | 受控枚举/分类树，不影响权限 |
| 主键策略 | `model.identity`（后续） | 仅支持平台注册的 UUID/雪花/数据库序列策略 |
| 查询模式/分页/复选 | `interaction.list`（后续） | 只影响 Runtime UI；服务端分页始终生效 |
| 主题/表单布局/滚动 | `OnlineView` Puck props | 仅表现层 allowlist，不保存 CSS/HTML |
| 是否树 | `TREE + tree.parentField` | 必须经模型语义验证，不能只靠页面开关 |

### 3. 数据库属性页签：字段物理语义

截图中的“数据库属性”以表格编辑字段名称、备注、长度、小数位、默认值、字段类型、主键、允许空值，并可新增字段和排序。

**本项目吸收方式：**当前 Model IR 已承载字段编码、类型、nullable、length、default、index；下一轮 UI 要以字段网格呈现，不再默认暴露 JSON。需要补充：字段备注、精度/小数位、受控 identity、系统字段模板和字段排序。所有变更仍先产生语义 Schema Plan；不得改成浏览器动态 DDL 或强制同步。

### 4. 页面属性页签：列表、表单与查询交互

截图中的“页面属性”是字段在 UI 上的配置网格，包含表单显示、列表显示、排序、可编辑、控件类型、控件长度、是否查询、查询类型、默认值、扩展参数和自定义转换器。

**本项目吸收方式：**扩展 Interaction IR，分离：

- 列表：visible、display order、sortable、column width、summary。
- 表单：visible、widget、layout/span、readonly、placeholder、default。
- 查询：enabled、operator、query widget、排序、默认条件。
- 详情：visible、display order、format。

其中 widget、operator、format 必须是固定枚举；所谓“扩展参数”只能是组件的严格 props schema；“转换器”只能引用平台注册的 formatter key，不能保存 JavaScript。

### 5. 校验字段页签

截图显示字段可配置校验规则、必填校验，以及字典表/字典编码/字典文本映射。

**本项目吸收方式：**新增 `Validation IR`：required、min/max、length、pattern、enum/dictionaryRef、referenceRef、messageKey。编译为服务端 Zod command schema，并可导出前端提示 schema。字典和引用必须通过 tenant-scoped registry 解析；不接受任意表名、任意 SQL 或自定义表达式。

### 6. 外键与索引页签

截图分别提供外键字段、主表名、主表字段配置，以及索引名称、索引字段、索引类型的编辑页。

**本项目吸收方式：**

- 外键变为 Definition/Field 之间的显式 Relation Binding，必须同租户、目标 Release/Definition 存在，并由 `TREE`/`MASTER_DETAIL` 编译器校验。
- 索引保持结构化 `Index IR`，需支持唯一/普通索引和字段顺序。
- 两者都只能进入语义 Schema Plan，不能在 Online 页面直接执行 SQL/DDL；当前阶段仍不提供 apply。

### 7. 查询配置页签

截图中的查询配置为字段指定控件类型、字典信息、默认值和启用状态，说明“查询模型”应独立于表单展示属性。

**本项目吸收方式：**将现有 `query.enabled + operator` 扩展为独立 `Query IR`，声明可查询字段、固定查询组件、操作符、排序白名单、默认筛选和字典绑定。Runtime 必须根据 Release Query IR 构建参数化 Kysely 查询，不能拼接 SQL。

### 8. 增强、导入与代码生成

列表截图可见自定义按钮、JS/SQL/Java 增强、导入数据库表、代码生成等入口。

**安全替代：**

- 保留“内置动作”和“注册 server action”，删除用户保存的 JavaScript、Java、SQL 和任意 URL 增强。
- “导入数据库表”只能走受控 schema introspection：限定同一配置的数据源、只读、白名单 schema、人工确认后导入为 Draft Model IR；不得直接绑定任意连接字符串或自动改库。
- “代码生成”只允许从已发布、已校验、无待执行 Schema Plan 的 Release 生成，并提供 dry-run/预览/ZIP；不覆盖手工文件。

### 推荐的本项目页面信息架构

```text
Online 开发
├── Online 表单管理（资产列表：查询、筛选、状态、版本、创建、复制、归档）
├── 表单设计工作区
│   ├── 基础属性
│   ├── 数据模型（字段、系统字段、主键、索引、关系）
│   ├── 页面属性（列表、表单、详情、查询）
│   ├── 校验与字典
│   ├── 页面设计（受控 Puck）
│   └── 发布治理（校验、Schema Plan、Release、回滚、沙箱测试）
├── Online 测试（仅 Published Release）
├── Release 代码生成（后续）
└── 受控数据源导入（后续、只读 introspection）
```

该信息架构是后续 UI 重构基准：先实现可治理的表单资产和结构化多页签设计，再逐步接入 Runtime、策略、树/主子和代码生成。
