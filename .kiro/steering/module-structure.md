---
inclusion: auto
---

# 模块结构规范 (Module Structure Convention)

## 代码生成器对齐标准

所有模块必须遵循以下目录结构，与代码生成器 (`codegen/module-pack`) 产出一致。

## 目录结构

```
src/
├── modules/{moduleKebab}/
│   ├── backend/
│   │   ├── services/
│   │   │   ├── index.ts                         ← 统一 re-export
│   │   │   └── {feature}.service.ts             ← export class {Module}{Feature}Service
│   │   ├── validators/
│   │   │   ├── index.ts                         ← 统一 re-export
│   │   │   └── {feature}.validators.ts          ← export const {feature}Schema = z.object(...)
│   │   └── repositories/ (可选)
│   │       └── {feature}.repository.ts
│   └── frontend/
│       └── pages/
│           └── {featureKebab}.page.tsx           ← export default function {Module}{Feature}Page()
├── app/(admin-pages)/admin/{moduleKebab}/{featureKebab}/
│   └── page.tsx                                  ← 桥接: export { default } from "@/modules/{moduleKebab}/frontend/pages/{featureKebab}.page"
└── app/api/v1/admin/{moduleKebab}/{featureKebab}/
    ├── route.ts                                  ← GET/POST 列表+创建
    └── [id]/route.ts                             ← GET/PUT/DELETE 详情+更新+删除
```

## 命名规范

| 场景 | 规范 | 示例 |
|------|------|------|
| 模块目录 | kebab-case | `modules/system/` |
| Feature 目录 | kebab-case | `users/`, `dict-data/` |
| Service 类名 | `{Module}{Feature}Service` (PascalCase) | `SystemUserService` |
| Service 文件名 | `{feature}.service.ts` (kebab-case) | `user.service.ts` |
| Validator 文件名 | `{feature}.validators.ts` | `user.validators.ts` |
| Schema 变量名 | `{feature}PageQuerySchema` (camelCase) | `userPageQuerySchema` |
| Type 名 | `{Feature}PageQueryInput` (PascalCase) | `UserPageQueryInput` |
| Page 组件文件名 | `{featureKebab}.page.tsx` | `users.page.tsx` |
| Page 组件函数名 | `{Module}{Feature}Page` (PascalCase) | `SystemUsersPage` |
| 权限常量 | `{MODULE}_{FEATURE}_{ACTION}` (UPPER_SNAKE) | `SYSTEM_USER_VIEW` |

## 桥接规则

### page.tsx 桥接（必须）

所有 `app/(admin-pages)/admin/{module}/{feature}/page.tsx` 只做桥接，不写任何业务逻辑：

```tsx
export { default } from "@/modules/{moduleKebab}/frontend/pages/{featureKebab}.page"
```

### API route 引用（必须）

API route 必须从 `@/modules/{module}/backend/services` 和 `@/modules/{module}/backend/validators` 导入：

```ts
import { SystemUserService } from "@/modules/system/backend/services"
import { userListQuerySchema } from "@/modules/system/backend/validators"
```

## services/index.ts 规范

每个模块的 `services/index.ts` 必须统一导出所有 Service 类：

```ts
export { SystemUserService } from "./user.service"
export { SystemRoleService } from "./role.service"
// ...
```

## validators/index.ts 规范

每个模块的 `validators/index.ts` 必须统一导出所有 validator 文件：

```ts
export * from "./common.validators"
export * from "./user.validators"
export * from "./role.validators"
// ...
```

## 共享常量

- 权限常量: `src/modules/shared/backend/constants/permissions.ts`
- 菜单配置: `src/modules/shared/backend/constants/admin-menu.ts`

新增 feature 时必须同步更新这两个文件。

## 禁止项

- ❌ page.tsx 中写业务组件（必须桥接到 modules 下的 .page.tsx）
- ❌ API route 直接引用 `.service.ts` 文件路径（必须从 index 导入）
- ❌ 在 modules 之外创建 Service/Validator 文件
- ❌ Service 类名不带模块前缀（如 `UserService` 应为 `SystemUserService`）
- ❌ 存在重复命名的路由（如同时有 `sms-channel/` 和 `sms-channels/`）
