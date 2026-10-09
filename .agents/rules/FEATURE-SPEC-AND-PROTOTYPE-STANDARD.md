# FEATURE-SPEC-AND-PROTOTYPE-STANDARD.md
# 新需求、设计、原型 (HTML/PNG) 与任务统一归类与落地规范

> **生效对象**：所有在 `ruoyi-all-next` 基座上进行业务开发的工程师、产品经理、UI 设计师与 AI Agent  
> **核心宗旨**：彻底解决「原型无处安放、文档散落割裂、需求与任务脱节」的顽疾，推行 **全息上下文高内聚 (Holographic Context Cohesion)**。

---

## 一、 顶层设计原则：全息内聚工作区

在 `ruoyi-all-next` 体系中，一个业务特性（Feature）从需求到交付，**所有过程资产全部收敛在同一个特性目录内**：

- 标准物理路径：`docs/features/<feature-name>/`（亦原生兼容 `.kiro/specs/<feature-name>/`）；
- 严禁将原型图扔在外网云盘、需求写在聊天记录、任务记在口头、代码随意乱提。

```
                【特性专属全息规格包 (Feature Spec Bundle)】

  .kiro/specs/<feature-name>/  或  docs/features/<feature-name>/
  ├── brief.json                 # 【输入源】<500 Tokens 极简 DSL 声明
  ├── requirements.md            # 【需求】业务背景、角色故事、EARS 验收标准
  ├── design.md                  # 【设计】架构拓扑、领域模型、4 态状态机、不变量
  ├── prototype.md               # 【原型导读】文本线框、交互规范、四态定义
  ├── assets/                    # 【原型切图】PNG / SVG / JPG 视觉稿、Figma 导图
  │   ├── wireframe-desktop.png  #    PC 管理端界面截图
  │   ├── wireframe-mobile.png   #    移动端 App 界面截图
  │   └── flow-interaction.svg   #    交互时序流程图
  ├── prototypes/                # 【HTML 动态原型】可真实点击运行的原型站点
  │   ├── index.html             #    单文件 HTML 交互原型
  │   └── (或 axure-site/)       #    Axure 导出的完整 HTML 站点
  └── tasks.md                   # 【任务】WBS 任务树与 [T1]~[Tn] 文件白名单
```

---

## 二、 原型 (Prototype: HTML / PNG) 的安放与管理标准

现实项目中，产品经理与设计师交付的原型 **90% 以上是 PNG/SVG 视觉图或 HTML 交互文件**。

### 1. 静态视觉与切图原型 (`assets/`)
- **存放格式**：`.png`, `.jpg`, `.svg`, `.webp`, `.gif`；
- **文件命名**：采用数字编号与语义命名，例如 `01-order-list.png`、`02-refund-modal.png`；
- **引用规范**：在 `prototype.md` 中使用相对路径嵌入：
  ```markdown
  ## 订单退款界面原型
  ![退款操作弹窗](./assets/02-refund-modal.png)
  > 🎨 Figma 在线设计真源: [点击跳转 Figma 画布](https://www.figma.com/file/xxxx)
  ```
- **AI Agent 多模态协同**：AI 读取该目录的 PNG 图像后，可自动解析页面布局、色彩规范、按钮位置与表单项，直接展开为代码。

### 2. 可交互动态 HTML 原型 (`prototypes/`)
- **单文件原型**：由 v0.dev、Claude、Tailwind 或手写的单个 `.html` 文件，命名为 `prototypes/index.html` 或 `prototypes/<screen>.html`；
- **Axure 完整导出包**：
  - 解压后放入 `prototypes/axure/`；
  - 为防止 Git 仓库因 Axure 冗余资源膨胀，必须在根目录 `.gitignore` 补充忽略规则：
    ```gitignore
    # 忽略 Axure 导出包中巨大且无语义的静态库
    .kiro/specs/**/prototypes/axure/resources/
    docs/features/**/prototypes/axure/resources/
    ```
- **本地预览**：在编辑器中右键 `Open with Live Server` 或双击浏览器打开直接交互测试。

### 3. 文本级线框模型 (`prototype.md`)
- 所有页面必须在 `prototype.md` 中配有 **ASCII 文本线框模型**；
- 文本线框为人类与 AI 提供最明确、无歧义的控件定义、字段字典、页面四态（加载态、空数据态、错误态、成功态）与二次确认防呆逻辑。

---

## 三、 四大阶段标准化作业工作流

```
   ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
   │ 1. 立项与脚手架 │ ────> │ 2. 填写 Brief   │ ────> │ 3. 一键展开资产 │
   │ (feature:new)   │       │ (brief.json)    │       │ (feature:build) │
   └─────────────────┘       └─────────────────┘       └─────────────────┘
                                                                │
                                                                ▼
   ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
   │ 6. 门禁验证交付 │ <──── │ 5. 编码与提交   │ <──── │ 4. 置入原型文件 │
   │ (delivery:check)│       │ (1 Task=1 Commit)       │ (PNG / HTML)    │
   └─────────────────┘       └─────────────────┘       └─────────────────┘
```

1. **立项**：执行 `npm run feature:new -- --name <name> --domain <domain> --title "<title>"`，自动创建全套目录结构（含 `assets/` 与 `prototypes/`）；
2. **填 Brief**：编辑 `brief.json`，声明角色、故事、不变量、页面线框与任务白名单（<500 Tokens）；
3. **展开资产**：执行 `npm run feature:build -- --name <name>`，自动展开生成 `requirements.md`、`design.md`、`prototype.md` 与 `tasks.md`；
4. **置入原型**：将美工切图放入 `assets/`，将 HTML 原型放入 `prototypes/`，在 `prototype.md` 中关联；
5. **编码**：在 `packages/plugins/plugin-<domain>/` 编写代码，每条任务提交时 Commit Message 格式必须为 `git commit -m "feat(domain): [T1] ..."`；
6. **门禁追溯**：执行 `npm run task:verify -- --feature <name>` 验证任务达成。

---

## 四、 违规与避坑红线

- 🚫 **严禁在代码仓库顶层乱建 `temp/`、`mockup/`、`proto/` 平铺目录**：所有原型文件必须统一收敛在所属特性的 `assets/` 或 `prototypes/` 目录下；
- 🚫 **严禁将未压缩的几百兆设计源文件 (.psd / .sketch) 提交至 Git**：设计源文件应存放于企业云盘，Git 只存放压缩后的 `.png` / `.svg` / `.html`；
- 🚫 **严禁无原型依据的凭空手写**：前端开发必须以 `prototype.md`、`assets/` 或 `prototypes/` 为输入真源，确保 UI 符合企业级两字按钮、单行工具栏与四态规范。
