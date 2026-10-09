# 原型：开源顶流技能吸收：Archify 架构可视化与 Strix 自主渗透防御

上游：`design.md`。支持文本线框、视觉切图 (./assets/) 与可交互 HTML 原型 (./prototypes/)。

## 1. 页面线框与文本模型

### Archify 可视化架构视图

```
[Traefik] -> [Next.js BFF] -> [15 Plugins + 2 Platform Domains] -> [SQLite / NATS]
```


## 2. 视觉原型与设计图 (PNG / SVG)

> 提示：将设计切图、Figma 导图、线框截图放入同级 `assets/` 并在下方引用。

<!-- 示例: ![主页面原型](./assets/wireframe-main.png) -->
（若有设计稿截图，请放置于 ./assets/ 目录并在此关联）

## 3. 可交互 HTML 原型 (Interactive Prototype)

> 提示：单文件 HTML 或 Axure 导出包放置于同级 `prototypes/` 目录。

<!-- 示例: 本地交互原型文件: [点击预览 HTML 原型](./prototypes/index.html) -->
（若有 HTML 原型，请放置于 ./prototypes/ 目录）

## 4. 交互要点与防呆设计

* Archify 页面内支持鼠标滚轮缩放、拖拽平移、点击领域节点高亮其输入与输出通信连线

## 5. 状态与四态规范 (4-States)

* 加载中：HTML 原生自包含 JS/CSS 瞬时渲染，无外部 CDN 依赖
* 空数据：拓扑图内置 17 领域完整全息数据
* 出错：若 JSON 格式损坏控制台给出明确解析报错
* 无权限：架构图面向内部团队公开
