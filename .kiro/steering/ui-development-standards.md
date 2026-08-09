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


---

## 8. 商户原型导航与业务命名规范（全局强制）

平台商户侧的业务线统一为：**品质电商**、**本地生活**、**家政服务**。底层 `Product` / `ProductSku` 是统一交易模型，但不得将“统一商品”“SPU”“SKU”等技术术语直接作为商户侧栏的信息架构标签。

### 8.1 业务语言与资源归属

- **品质电商**：使用“商品经营 / 商品规格 / 仓配履约”等经营语言。
- **本地生活**：使用“服务经营 / 预订方案 / 履约资源”等经营语言；民宿、酒店、农家乐的客房入口默认称为“客房经营”。
- **家政服务**：使用“家政经营 / 服务方案 / 人员派单”等经营语言。
- 客房、地块、服务人员等是**履约资源**；3D VR、图集、设施、门锁、房态、保洁和排班只在对应资源页维护。商品或服务页仅绑定并展示资源摘要，严禁复制第二套专业资料编辑能力。

### 8.2 四字菜单与动态配置红线

- 商户后台侧栏的**分组名称和功能菜单名称**默认必须为**四个中文字符**；禁止三字、五字、斜杠拼接、英文缩写或技术术语，例如“工作台”“房间/产品”“AI 中心”“统一商品”。
- 四字命名由 `src/frontend/config/merchant-menu-registry.ts` 提供默认值；运营后台在 `/admin/merchant-menus/[type]` 可按商户业态维护菜单开关、菜单名称和分组名称。
- 动态配置使用 `merchant_menu_config_{BusinessType}` / `merchant_menu_override_{merchantId}` 存储，四字校验必须在运营前端、Zod Validator 和 Service 三层执行。
- 商户端只能消费 `/api/merchant/menu` 下发的 `enabledKeys`、`labelOverrides` 和 `groupLabelOverrides`；禁止在 `MerchantLayout` 或页面中按商户类型硬编码替换名称、路由或可见性。
- 新增商户菜单时，必须同时完成：四字默认名称、业态适用范围、运营后台配置预览、动态 API 契约、本文档及菜单功能文档更新。
