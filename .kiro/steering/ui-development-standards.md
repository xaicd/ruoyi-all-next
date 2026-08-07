---
inclusion: auto
---

# UI 设计与开发规范 - 乡村振兴综合服务平台

为了保持 C 端与平台界面的一致性、高奢视觉质感与极佳的用户体验，所有 UI 开发必须遵循以下核心开发规则约束：

---

## 1. 核心设计令牌与色彩约束 (Design System & Color Tokens)

- **设计令牌强约束**：所有颜色必须使用 `src/app/globals.css` 中定义的设计令牌（如 `--color-primary-*` / `--color-surface` / `--radius-*` / `--shadow-*`），**严禁硬编码 HEX 色值**（如 `#ff0000`）。
- **统一齐鲁红品牌色**：C 端页面必须统一使用 `primary-*` 代表品牌色，严禁混用 `green-` / `teal-` / `emerald-` 作为主要品牌风格。
- **微动效与触控反馈**：所有可点击的按钮与卡片必须包含按压缩放反馈（`active:scale-95` 或 `active:scale-[0.98]`，搭配 `transition-transform` 或 `transition-all`）；关键头部或浮框支持玻璃拟态（`backdrop-blur-md`）。

---

## 2. 容器与 Safe-Area 防遮挡红线 (Layout & BottomNav Constraints)

- **标准容器包裹**：所有 C 端主页面必须统一使用 `src/frontend/components/ui-system/PageContainer` 包裹。
- **底部 Safe-Area 留白红线**：
  - 挂载底部导航栏（BottomNav）的所有 C 端页面容器，底部必须显式保留至少 **`pb-28`**（或 `safe-area-bottom`），**严禁任何卡片、按钮或工具栏被底部 BottomNav 遮挡或截断**。
  - 在全屏视频 / 直播模式下，底栏做全透明与渐变暗化融入。

---

## 3. 图片展示与防破页红线 (Image Fallback & Placeholder Policy)

- **零空白/零低质占位红线**：
  - 当数据中的 `coverImage` / `thumbnail` 加载失败或为空时，**绝对禁止展示纯白/灰色空块或低质📦纸箱占位图**。
  - 必须注入符合乡村振兴主题的高清 Fallback 封面与优雅渐变图。
- **骨架屏规范**：数据加载阶段必须统一使用 `Skeleton`（来自 `src/frontend/components/ui-system/`）组件进行结构化占位，杜绝页面大幅抖动。

---

## 4. 抖音短视频 & 沉浸流 UI 规范 (TikTok Feed Standard)

短视频与直播播放大厅必须遵循以下抖音 UI 范式：
1. **100vh 全屏沉浸容器**：使用 100vh 满屏布局，配合 CSS Snap 垂直平滑滑动。
2. **顶部微透明吸顶 Navigation**：多 Tab 横向无缝切换（【直播】【关注】【推荐】），带有高亮红色下划线与动态微红点。
3. **右侧“六连击”沉浸互动侧栏**：
   - 作者头像 + **`+` 关注粉色加号 overlay**；
   - 点赞（爱心 icon + 格式化数字，且全屏支持双击弹射红心粒子）；
   - 评论（点击拉起底部 Drawer 模态框）；
   - 收藏（Bookmark 高亮）与带归因的链接分享；
   - **乡村黑胶唱片/原声旋转**。
4. **乡村地理定位 Pin 胶囊**：显示 **`📍 2.3km | 乡村名`**。
5. **抖音小黄车商品闪卡**：流光边框、`¥`大字价格、灰色划线原价、`乡村直供补贴` 营销角标、销量背书及一键抢购按键。

---

## 5. 商户类型与配送/到店核销模式强约束 (Fulfillment & Verification Red Line)

在结算页（Checkout）与订单履约流程中，必须根据商户类型与商品属性严格区分履约大类，**绝对禁止将到店核销类体验套餐错判为快递配送订单**：

1. **纯到店核销型 (`IN_STORE_VERIFICATION`)**：
   - **包含商户**：露营 (`CAMPING`)、民宿 (`HOMESTAY`)、酒店 (`HOTEL`)、越野 (`OFFROAD`)、体验活动 (`EXPERIENCE`)、农家乐 (`FARMHOUSE`)、采摘 (`PICKING`)、垂钓 (`FISHING`)、游玩/骑行等。
   - **包含商品**：`includesLodging = true`（过夜套餐/住宿）或游玩门票/套餐代金券。
   - **红线约束**：
     - ❌ **绝对不填写快递收货地址** (`needsAddress = false`)；
     - ❌ **绝对不展示 快递配送 / 邮寄 / 包邮运费 / 驿站自提**；
     - ✅ 结算页必须展示**【到店凭码核销】**专属卡片：“支付成功后生成电子核销码，凭码到店体验/入住”。

2. **餐饮外卖 / 到店自提型 (`RESTAURANT_DINE_IN`)**：
   - **包含商户**：餐厅 (`RESTAURANT`)。
   - **履约选项**：外卖配送（即时送到指定地址）或到店自提/堂食。

3. **实物快递配送 / 驿站自提型 (`PHYSICAL_DELIVERY`)**：
   - **包含商户**：特产 (`SPECIALTY`)、自提驿站 (`SERVICE_STATION`)。
   - **包含商品**：农副产品、礼盒、干货等实物电商商品。
   - **履约选项**：快递配送（选收货地址 + 计算快递运费）或驿站自提。

---

## 6. UI 系统组件复用规范 (UI System First)

新页面与重构组件必须优先使用 `src/frontend/components/ui-system/` 中的标注入库组件：
- 页面外层：`PageContainer`
- 内容章节：`Section`
- 卡片容器：`Card`
- 语义徽章：`Tag`
- 骨架屏：`Skeleton`
- 加载/错误状态：`LoadingState` / `ErrorState`

---

## 7. 禁止项 (Strict Prohibitions)

- ❌ **严禁将露营/民宿/体验/套餐/门票等到店核销类商品当作快递订单**，严禁为其推送选收货地址或包邮运费。
- ❌ 禁止在 C 端页面中露出未处理的纯白/灰色空占位图或纸箱📦占位图。
- ❌ 禁止让 C 端 BottomNav 遮挡页面最下方的卡片或去结算按钮。
- ❌ 禁止为底层 Navigation 渲染非标准的硬编码圈号与错乱选中图标。
- ❌ 禁止在 Route Handler 中编写 UI 逻辑。
