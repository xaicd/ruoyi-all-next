---
name: ui-design
description: 管理端与 C 端 UI/UX 设计。画页面、改布局、做多端适配时启用。
---

# UI/UX 设计与前端组件规范

## 1. 适用场景
- 开发管理端（Admin Web）列表页、详情页、配置表单或仪表盘。
- 开发 C 端与移动端（H5、UniApp、Flutter、Desktop PC）页面与交互。
- 调整系统主题、排版、色彩 Token、微动效与响应式布局。

## 2. 权威依据
- `AGENTS.md` §3.2 (客户端包结构约束：`clients/<channel>/src/{app,shared,modules/<domain>}`)
- `AGENTS.md` §4.4 (权限与菜单可见性一致性)
- `AGENTS.md` §6.1 (UI Framework 与 UI-UX-Pro-Max 治理规范)
- `AGENTS.md` §14.4 (前端模板与对标规范)
- `docs/architecture/ruoyi-all-next-client-channels.md` (渠道规范)
- `src/modules/shared/frontend/templates` (通用管理端模板)

## 3. 设计系统规范与色彩 Token
- **严禁使用刺眼的纯原色与杂乱渐变**，必须使用遵循 HSL 色彩空间的高质感调色板：
  - `Primary`: 沉稳科技蓝 / 雅致主色
  - `Success`: 自然柔和绿
  - `Warning`: 琥珀暖橙
  - `Danger`: 砖红 / 珊瑚红
  - `Neutral`: 层次清晰的灰阶体系（Background / Card / Border / Text）
- **现代化 UI 质感要求**：
  - 微拟物与毛玻璃（Glassmorphism，适度 `backdrop-filter: blur`)
  - 细腻的多层柔和投影（`box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05)`）
  - 120ms~200ms 的平滑过渡动效（Ease-out 贝塞尔曲线）

## 4. 管理端标准三段式布局
```
┌─────────────────────────────────────────────────────────────┐
│ 1. 顶部检索区 (SearchForm: 关键词/状态/下拉/重置/查询按钮)     │
├─────────────────────────────────────────────────────────────┤
│ 2. 工具栏区 (Toolbar: 新增/批量删除/导出/列显隐/刷新)          │
├─────────────────────────────────────────────────────────────┤
│ 3. 数据表格区 (DataTable: 排序/选择/字段展示/行操作按钮)       │
├─────────────────────────────────────────────────────────────┤
│ 4. 分页控制区 (Pagination: 总数/每页条数/页码跳转)            │
└─────────────────────────────────────────────────────────────┘
```

## 5. 多端交互状态完备性 (4 态必齐)
任何列表或异步组件必须覆盖以下四种状态：
1. **Loading 态**：使用骨架屏（Skeleton）或平滑 Spinner，禁止白屏。
2. **Empty 态**：图文结合的空状态提示，并提供快速“创建/重试”引导按钮。
3. **Error 态**：友好错误提示文案，支持一键重试，不抛出底层红屏堆栈。
4. **Success 态**：数据优雅渲染，操作成功附带轻量 Toast / Notification 反馈。

## 6. 绝对禁止项
- 禁止在页面中直接写死品牌名称或 Logo，必须从 `GET /api/v1/open/meta/project-profile` 读取。
- 禁止 C 端页面直接套用臃肿的桌面后台表格。
- 禁止按钮无 `cursor: pointer`，禁止可交互元素缺失 hover / focus / active 反馈。
