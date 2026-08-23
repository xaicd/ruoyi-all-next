---
name: ui-design
description: 管理端与 C 端 UI/UX 设计。融合 Vercel、ui-ux-pro-max、Shadcn 与跨端移动交互顶级规范。
---

# UI/UX 设计与前端组件全端规范 (融合开源顶级标准)

## 1. 适用场景
- 开发管理后台（Admin Web）、C 端移动 H5、UniApp 小程序、Flutter 原生 App、Desktop-PC 桌面端。
- 制定色彩 Token、布局栅格、无障碍访问（a11y）、移动手势交互与性能优化。

## 2. 权威依据与吸收来源
- `AGENTS.md` §3.2, §4.4, §6.1, §14.4
- **Vercel Agent Skills**：Core Web Vitals（LCP < 2.5s, CLS < 0.1, INP < 200ms）、RSC 渲染架构
- **ui-ux-pro-max-skill**：60+ 种现代风格检索、HSL 色彩微调、贝塞尔动效曲线
- **Shadcn/UI & Radix UI**：无头组件（Headless）、键盘无障碍交互、状态与样式完全解耦
- **Wot Design Uni & UniApp 官方**：移动端触控手势、安全区（Safe-Area）沉浸式适配

## 3. 设计系统与色彩 Token 规范
```css
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
```

## 4. 移动端与小程序专属交互规范 (C 端三必做)
1. **安全区域适配（Safe Area Insets）**：
   - 顶部导航必须避让状态栏与小程序胶囊按钮（`padding-top: env(safe-area-inset-top)`）；
   - 底部操作栏必须避让 iPhone 横条（`padding-bottom: env(safe-area-inset-bottom)`）。
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
- 严禁按钮缺失 `cursor: pointer` 与 `:focus-visible` 轮廓线。
- 严禁在小程序端一次性渲染数千条 DOM 导致 `setData` 内存崩溃。
- 严禁在 C 端直接复用未做移动端适配的宽屏数据表格。
