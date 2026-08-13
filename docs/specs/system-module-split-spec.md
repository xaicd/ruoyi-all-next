# System 模块拆分 Spec — ✅ 已完成

## 目标

将现有 system 模块及全项目按代码生成器的 **module + feature** 结构对齐，清理重复路由，确保命名规范一致。

---

## 完成状态

| Phase | 任务 | 状态 |
|-------|------|------|
| Phase 1 | 修正代码生成器模板路径 | ✅ 完成 |
| Phase 2 | System validators 按 feature 拆分 | ✅ 完成 |
| Phase 3 | 全项目 page.tsx 桥接统一 | ✅ 完成 (358个文件) |
| Phase 4 | 清理重复路由 | ✅ 完成 |
| Phase 5 | 清理 mock service + 修复引用 | ✅ 完成 |
| Phase 6 | 规范固化 (steering) | ✅ 完成 |

---

## 代码生成器标准产物

```
spec.json 定义:
  moduleKebab = "system"
  modulePascal = "System"
  featureListKebab = "users"
  featureListPascal = "Users"

生成产物:
  src/modules/system/backend/services/user.service.ts     ← export class SystemUserService
  src/modules/system/backend/validators/user.validators.ts ← export const userListQuerySchema
  src/modules/system/frontend/pages/users.page.tsx        ← export default function SystemUsersPage()
  src/app/(admin-pages)/admin/system/users/page.tsx       ← export { default } from "@/modules/system/frontend/pages/users.page"
  src/app/api/v1/admin/system/users/route.ts              ← import { SystemUserService } from "@/modules/system/backend/services"
```

---

## 命名规范

| 场景 | 规范 | 示例 |
|------|------|------|
| 模块目录 | kebab-case | `modules/system/` |
| Service 类名 | `{Module}{Feature}Service` (PascalCase) | `SystemUserService` |
| Service 文件名 | `{feature}.service.ts` (kebab-case) | `user.service.ts` |
| Validator 文件名 | `{feature}.validators.ts` | `user.validators.ts` |
| Schema 变量名 | `{feature}PageQuerySchema` (camelCase) | `userListQuerySchema` |
| Type 名 | `{Feature}Input` (PascalCase) | `CreateUserInput` |
| Page 文件名 | `{featureKebab}.page.tsx` | `users.page.tsx` |
| 权限常量 | `{MODULE}_{FEATURE}_{ACTION}` | `SYSTEM_USER_VIEW` |

---

## 最终目录结构 (system 模块)

```
src/modules/system/
├── backend/
│   ├── services/
│   │   ├── index.ts                    ← 24 个 Service 类统一 re-export
│   │   ├── area.service.ts
│   │   ├── auth.service.ts
│   │   ├── captcha.service.ts
│   │   ├── dept.service.ts
│   │   ├── dict.service.ts
│   │   ├── ip-area.service.ts
│   │   ├── login-log.service.ts
│   │   ├── mail.service.ts
│   │   ├── menu.service.ts
│   │   ├── notice.service.ts
│   │   ├── notify-message.service.ts
│   │   ├── notify-template.service.ts
│   │   ├── oauth2.service.ts
│   │   ├── online-user.service.ts
│   │   ├── operate-log.service.ts
│   │   ├── permission.service.ts
│   │   ├── post.service.ts
│   │   ├── role.service.ts
│   │   ├── sms.service.ts
│   │   ├── social.service.ts
│   │   ├── tenant.service.ts
│   │   ├── tenant-package.service.ts
│   │   ├── user.service.ts
│   │   └── user-profile.service.ts
│   ├── validators/
│   │   ├── index.ts                    ← 统一 re-export
│   │   ├── common.validators.ts
│   │   ├── auth.validators.ts
│   │   ├── user.validators.ts
│   │   ├── permission.validators.ts
│   │   ├── tenant.validators.ts
│   │   ├── dict.validators.ts
│   │   ├── log.validators.ts
│   │   ├── mail.validators.ts
│   │   ├── sms.validators.ts
│   │   ├── notify.validators.ts
│   │   ├── oauth2.validators.ts
│   │   └── social.validators.ts
│   └── repositories/
└── frontend/
    └── pages/                          ← 30 个 .page.tsx (清理后无重复)
```

---

## 待办 (后续迭代)

- [ ] 补全 mail-template、sms-template、social-client、sms-callback 的 CRUD 接口实现
- [ ] 其他模块 (ai, bpm, crm 等) validators 按 feature 拆分
- [ ] 统一 infra 模块 codegen-engine.service.ts 语法错误修复
