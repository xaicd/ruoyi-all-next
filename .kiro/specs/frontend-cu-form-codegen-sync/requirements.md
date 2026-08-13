# Requirements Document

## Introduction
将现有后台真实 C/U 表单从 page-local 实现拆到 `frontend/components/<PascalEntity>Form.tsx`，并把手写页面、运行时代码生成器、module-pack、source generator 与注入器收敛到一份目录和交互契约。目标是后续生成代码不会重新引入 page 内表单或直接请求。

## Glossary
- **C/U Form**：同一个组件承载创建（Create）与编辑（Update）表单。
- **Page**：列表、查询、分页、表格和 Form 开关的编排组件。
- **API client**：`frontend/api/<entity>.api.ts`，唯一允许调用 shared `request` 的前端业务层。
- **标准 CRUD**：有真实 create/update API 的后台实体；不包括登录、只读页面和单一动作 POST。
- **生成契约**：生成器、模板包、注入器共同遵守的输出路径、命名、导入、路由和表单行为。

## Requirements

### Requirement 1: 统一前端结构
**User Story:** 作为维护者，我希望真实后台 C/U 使用一致的目录和职责，以便查找、复用和生成代码。

#### Acceptance Criteria
1. WHEN 一个标准 CRUD 被迁移 THEN 它必须包含 `frontend/api/<entity>.api.ts`、`frontend/components/<PascalEntity>Form.tsx` 和 `frontend/pages/<entity>-list.page.tsx`。
2. WHEN 列表页面渲染 THEN Page 只负责查询、筛选、表格、分页、删除确认、Form 打开/关闭及成功刷新。
3. THE Page SHALL NOT 包含具体字段 JSX、表单 state、关联候选请求或 payload 映射。
4. THE Form SHALL 负责 create/edit 初值、字段 state、输入 DTO 映射、取消、提交中和提交失败反馈。
5. THE API client SHALL 导出 typed page/get/create/update/delete；Page 与 Form 不得直接调用 `request`。

### Requirement 2: 关联字段和既有业务边界
**User Story:** 作为租户或平台管理员，我希望拆分表单不改变关联选择、权限和数据范围。

#### Acceptance Criteria
1. WHEN Form 需要关联候选 THEN 它必须经 API client 从真实 API 加载，并展示 loading、可恢复 error 和 empty 状态。
2. THE Form SHALL 保留现有的字段默认值、编辑禁用规则、数值/日期转换和后端 validator 契约。
3. THE Form SHALL NOT 绕过服务端对租户、套餐、安全菜单、部门树、角色、岗位、状态或敏感字段的校验。
4. WHEN edit Form 不允许更改业务键 THEN 它必须禁用该字段或不将该字段放入 update payload。

### Requirement 3: 代码生成器同步
**User Story:** 作为开发者，我希望所有可用生成入口生成相同的 C/U Form 结构，避免手写与生成结果分叉。

#### Acceptance Criteria
1. WHEN CRUD generator 生成前端 THEN 它必须同时生成 typed API client、async `<ClassName>Form`、list page、app bridge 及 `/api/v1/admin` route。
2. THE runtime engine、module-pack、source generator 和 injector SHALL 使用同一版本化生成契约或共同 fixture 验证。
3. WHEN 配置带 subModule THEN module、subModule、API BASE、route、app bridge、imports 与输出目录必须使用同一规范化路径。
4. THE generator SHALL 明确 CRUD 与 TREE、MASTER_CHILD、WORKFLOW、SINGLETON 的能力边界；不支持时必须拒绝或采用专用 renderer。

### Requirement 4: 受控注入
**User Story:** 作为维护者，我希望导入生成结果是可预览、可审计且默认不覆盖人工代码的。

#### Acceptance Criteria
1. THE injector SHALL 限制写入 manifest 声明的 `src/**` 白名单。
2. WHEN 使用 `--dry-run` THEN injector 必须只报告目标路径、内容变化和冲突，不写文件。
3. WHEN 目标已存在或输入越界 THEN injector 必须报告冲突或拒绝，并以非零状态结束；默认不得覆盖。
4. WHEN 注入成功 THEN injector 必须执行路径与 import 契约检查。

### Requirement 5: 迁移范围和验收
**User Story:** 作为项目负责人，我希望优先改造实际可用的 C/U 页面，并能明确哪些页面不适用。

#### Acceptance Criteria
1. THE migration SHALL 覆盖 system：users、roles、depts、menus、posts、dicts、tenants、tenant-packages；infra：configs、db-configs；crm：customers。
2. THE migration SHALL 先评估 job-center；它若不是标准实体 C/U，必须记录专用方案而不是强行套通用 Form。
3. THE migration SHALL 将代码生成导入、模板引擎、页面构建器、登录、工作流和主子表标为不适用或另建设计。
4. WHEN 每一批迁移完成 THEN 必须执行定向 Vitest、受影响类型检查、生成/注入 smoke 和 `git diff --check`。
5. THE project SHALL 把既有全仓类型错误作为独立基线记录，不能被本 Spec 的结果掩盖。
