---
inclusion: auto
---

# 编码规范 - 乡村振兴综合服务平台

## 核心架构原则 之一：商户类型与履约/到店核销严格隔离 (Core Fulfillment Architecture)

系统必须严格根据 **商户类型 (BusinessType)** 与 **商品属性 (Product Attributes)** 划分为三大隔离履约域：

1. **纯到店核销域 (`IN_STORE_VERIFICATION`)**：
   - 包含 `CAMPING`(露营过夜套餐), `HOMESTAY`(民宿), `HOTEL`(酒店), `OFFROAD`(越野), `EXPERIENCE`(体验), `FARMHOUSE`(农家乐), `PICKING`(采摘), `FISHING`(垂钓) 等。
   - **架构约束**：绝对不填写收货地址 (`needsAddress = false`)，绝对不产生物流运费/包邮，绝对不显示快递配送/驿站自提；支付后自动签发电子核销码到店凭码使用。
2. **餐饮外卖/堂食域 (`RESTAURANT_DINE_IN`)**：
   - 包含 `RESTAURANT`(餐厅)。履约选项为外卖配送或到店自提/堂食。
3. **实物包裹配送域 (`PHYSICAL_DELIVERY`)**：
   - 包含 `SPECIALTY`(特产), `SERVICE_STATION`(自提驿站) 及实物电商商品。填写快递收货地址，计算物流运费。

---

## 核心原则：薄层路由 + Service 分层

所有 API 路由必须遵循薄层模式，业务逻辑在 Service 层。

## 目录结构规范

所有新代码必须按以下分层放置：

### 后端（src/backend/）
- `src/backend/services/*.service.ts` - 业务逻辑（纯函数，不依赖 Request/Response）
- `src/backend/services/admin/*.service.ts` - 管理后台 Service
- `src/backend/validators/*.validator.ts` - 请求参数验证（Zod Schema）
- `src/backend/utils/route-handler.ts` - 统一错误处理（handleRouteError）

### 前端（src/frontend/）
- `src/frontend/components/business/` - 业务通用组件
- `src/frontend/components/form/` - 表单组件
- `src/frontend/components/layout/` - 布局组件（PageHeader, BrandBanner）
- `src/frontend/hooks/` - 客户端 Hooks（use-api.ts）
- `src/frontend/services/` - API 调用封装
- `src/frontend/stores/` - 前端状态

### 共享（src/shared/）
- `src/shared/types/` - 前后端共享类型
- `src/shared/constants/` - 前后端共享常量（business.ts）
- `src/shared/utils/` - 前后端共享工具函数（order.ts）

### 基础设施（src/lib/）
- `src/lib/` - 数据库、缓存、认证、加密等基础设施
- `src/app/api/` - API Route Handler（薄层，不超过 40 行）

## 新增 API 的标准流程

1. 创建 Validator：`src/backend/validators/xxx.validator.ts`
2. 创建/扩展 Service：`src/backend/services/xxx.service.ts`
3. 创建薄层 Route：`src/app/api/xxx/route.ts`
4. 更新导出：`src/backend/services/index.ts`

## API Route Handler 规范

```typescript
// ✅ 正确：薄层 Route Handler（不超过 40 行）
import { apiResponse, parseBody } from "@/lib/api-response"
import { auth } from "@/lib/auth"
import { XxxService } from "@/backend/services"
import { createXxxSchema } from "@/backend/validators/xxx.validator"
import { handleRouteError } from "@/backend/utils/route-handler"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return apiResponse({ success: false, error: "请先登录" }, { status: 401 })
    }

    const body = await parseBody(request)
    const input = createXxxSchema.parse(body)
    const result = await XxxService.create(session.user.id, input)

    return apiResponse({ success: true, data: result })
  } catch (error) {
    return handleRouteError(error)
  }
}
```

```typescript
// ✅ 正确：管理后台路由（含鉴权 + 数据隔离）
import { withAuth } from "@/lib/rbac"
import { XxxService } from "@/backend/services"
import { handleRouteError } from "@/backend/utils/route-handler"

export const GET = withAuth(async (request: any) => {
  try {
    const { scope, userRole, userId } = request.authContext
    const result = await XxxService.listForAdmin({ scope, userRole, userId }, query)
    return apiResponse({ success: true, ...result })
  } catch (error) {
    return handleRouteError(error)
  }
}, { roles: ["PLATFORM_ADMIN", "TOWN_ADMIN", "VILLAGE_ADMIN"] })
```

```typescript
// ❌ 错误：在 Route Handler 中写业务逻辑
export async function POST(request: NextRequest) {
  const product = await prisma.product.findUnique(...)  // ❌ 不要在路由层查数据库
  if (product.stock < quantity) { ... }                  // ❌ 不要在路由层写业务判断
}
```

## Service 层规范

- 每个 Service 是一个 class，方法为 static
- 方法签名：`static async methodName(userId: string, input: ValidatedInput)`
- 错误处理：抛出 `Errors.XXX()`（从 `@/lib/errors` 导入）
- 日志：使用 `logger.child("ServiceName")`
- 并发控制：在 Service 内部处理限流和锁
- 数据隔离：在 Service 内部调用 `buildXxxWhere(scope)`

## 错误处理规范

```typescript
// Service 层：抛出预定义错误
throw Errors.NOT_FOUND("订单")
throw Errors.RATE_LIMITED()
throw Errors.STOCK_INSUFFICIENT()
throw Errors.VALIDATION_ERROR("日期格式无效")
throw Errors.FORBIDDEN("无权操作此订单")
throw Errors.MISSING_PARAMS(["merchantId", "type"])
throw Errors.ALREADY_EXISTS("手机号")

// Route 层：统一捕获
} catch (error) {
  return handleRouteError(error)
}
```

## Validator 规范

```typescript
// src/backend/validators/xxx.validator.ts
import { z } from "zod"

export const createXxxSchema = z.object({
  field: z.string().min(1, "字段不能为空"),
  phone: z.string().regex(/^1[3-9]\d{9}$/, "手机号格式不正确"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export type CreateXxxInput = z.infer<typeof createXxxSchema>
```

## 前端组件规范

- 使用 `"use client"` 标记客户端组件
- Props 接口命名：`ComponentNameProps`
- 使用 `cn()` 合并 className
- 从 `@/frontend/components/business` 导入业务组件
- 从 `@/shared/constants/business` 导入常量映射

## 设计体系（C 端）

C 端页面必须使用统一的设计令牌与 ui-system 组件。

**品牌主色**：齐鲁红，定义在 `src/app/globals.css` 的 `@theme inline`：`--color-primary-50` ~ `--color-primary-900`，所有 `bg-primary-*` / `text-primary-*` / `border-primary-*` 自动可用。

**设计令牌**：
- 颜色：`--color-primary-*` / `--color-earth-*` / `--color-rural-*` / `--color-success` / `--color-warning` / `--color-danger` / `--color-info`
- 中性色：`--color-bg`、`--color-surface`、`--color-text-primary` / `secondary` / `tertiary`、`--color-border` / `--color-border-light`
- 圆角：`--radius-sm/md/lg/xl`
- 阴影：`--shadow-sm/md/lg`

**UI 系统组件**（`src/frontend/components/ui-system/`，新页面必须优先使用）：

| 组件 | 用途 |
|------|------|
| `PageContainer` | 页面外层容器（最大宽度 / 底部留白 / 背景模式） |
| `Section` | 章节容器（标题 / 副标题 / 操作 / 查看更多） |
| `Card` | 标准卡片（圆角 / 阴影 / 可点击 / padding） |
| `LoadingState` | 通用加载态（含全屏） |
| `ErrorState` | 通用错误态（含操作按钮） |
| `Tag` | 语义色徽章（primary / success / warning / danger / info / neutral） |
| `Skeleton` | 骨架屏 |

```tsx
import { PageContainer, Section, Card, Tag, LoadingState } from "@/frontend/components/ui-system"

export default function MyPage() {
  return (
    <PageContainer withBottomNav maxWidth="lg">
      <Section title="推荐商户" moreHref="/merchants">
        <Card hoverable onClick={() => router.push("/merchants/1")}>...</Card>
      </Section>
    </PageContainer>
  )
}
```

**C 端公共导航**：
- `PublicPageHeader`（`src/frontend/components/public/PageHeader.tsx`）：返回 + 首页 + 标题，三种 variant（light / dark / transparent）
- `BottomNav`（`src/frontend/components/public/BottomNav.tsx`）：5 Tab 移动端底部导航，`md:hidden`，PC 端通过顶部 nav 导航

详细文档：`docs/design-system.md`

## 数据库操作规范

- 写操作必须在 Service 层
- 高并发写操作使用 `withLock()` + `updateMany()` 乐观锁
- 查询必须有分页（最大 100 条）
- 利用已有索引字段查询
- 事务使用 `prisma.$transaction()`

## 禁止项

- ❌ 在 API Route Handler 中写业务逻辑
- ❌ Route Handler 超过 40 行
- ❌ 硬编码密码、Token、密钥
- ❌ 不完整的代码片段
- ❌ 使用 `any` 类型（除非确实无法推断）
- ❌ 直接操作数据库而不经过 Service 层
- ❌ 在客户端暴露服务端环境变量
- ❌ 使用 `console.log` 替代 `logger`
- ❌ C 端页面硬编码 `green-` / `teal-` / `emerald-` 等品牌色（统一使用 `primary-*`）
- ❌ 重复实现页面容器、章节标题、卡片、加载/错误态等通用结构（请使用 `ui-system`）

## 后台菜单与图标规范

在 `src/frontend/config/admin-menu.ts` 中配置新菜单的 Lucide 图标时，必须遵循以下步骤以防图标无法渲染：

1. **导入与注册**：
   * 打开 `src/frontend/components/admin/AdminLayout.tsx`，在文件头部的 `lucide-react` 导入语句中包含该图标（如 `Globe`）。
   * 将图标组件添加到 `const ICONS` 对象映射中。

2. **自动检测与拦截**：
   * 本项目包含一个自动化检测测试 `src/frontend/config/__tests__/admin-menu-icons.test.ts`。所有在菜单注册表中使用但未在 `AdminLayout.tsx` 注册的图标将触发测试失败，并阻断 CI/CD 构建流程。
   * 开发环境下如果忘记注册，菜单图标会自动降级显示为 `HelpCircle` 问号，并且控制台会抛出详细的 `console.warn` 提示说明。

