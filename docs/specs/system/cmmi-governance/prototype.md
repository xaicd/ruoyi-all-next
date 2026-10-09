# 原型：CMMI 全生命周期交付治理与 8 大工程技能体系

上游：`design.md`。支持文本线框、视觉切图 (./assets/) 与可交互 HTML 原型 (./prototypes/)。

## 1. 页面线框与文本模型

### 纯治理无页面

```
无
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

* 无前端交互

## 5. 状态与四态规范 (4-States)

* 加载中：不适用
* 空数据：无真实数据目录保持严格留空
* 出错：门禁检测异常时退出码非 0 阻断构建
* 无权限：不适用
