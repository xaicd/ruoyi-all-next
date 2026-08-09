# API Route 规范

## 原则

1. **一个资源一个 route.ts**，用 HTTP 方法区分 CRUD 操作
2. **操作型接口**（非 CRUD 语义）也合并到资源级 route，用 HTTP 方法语义化

## CRUD 资源（标准模式）

```
src/app/api/v1/admin/{domain}/{resource}/
├── route.ts           → GET(列表) + POST(创建)
└── [id]/route.ts      → GET(详情) + PUT(更新) + DELETE(删除) + PATCH(部分更新/状态变更)
```

示例：
```
GET    /api/v1/admin/system/users          → 分页列表
POST   /api/v1/admin/system/users          → 创建用户
GET    /api/v1/admin/system/users/:id      → 获取详情
PUT    /api/v1/admin/system/users/:id      → 更新用户
DELETE /api/v1/admin/system/users/:id      → 删除用户
PATCH  /api/v1/admin/system/users/:id      → 状态变更/密码重置（body.action 区分）
```

## 非 CRUD 资源（操作型）

认证、导出、导入等操作型接口，合并到一个 route.ts 用 HTTP 方法区分：

```
src/app/api/v1/admin/system/auth/route.ts
  POST   → 登录
  GET    → 获取当前用户权限信息
  PUT    → 刷新 token
  DELETE → 退出登录
```

## 树形资源

```
src/app/api/v1/admin/system/depts/route.ts
  GET    → 默认返回树形，?mode=list 返回平铺
  POST   → 创建
```

## HTTP 方法语义

| 方法 | 用途 | 幂等 |
|---|---|---|
| GET | 查询（列表/详情/树） | 是 |
| POST | 创建 | 否 |
| PUT | 全量更新 | 是 |
| PATCH | 部分更新/状态变更/特殊操作 | 视情况 |
| DELETE | 删除 | 是 |

## PATCH body.action 约定

当一个资源有多种「部分更新」操作时，通过 `body.action` 区分：

```json
// 状态变更
{ "action": "updateStatus", "status": "DISABLED" }

// 密码重置
{ "action": "resetPassword", "password": "newPass123" }

// 手动触发（任务）
{ "action": "trigger" }
```

## 禁止事项

1. 禁止在 route.ts 中写业务逻辑，只做：解析参数 → 鉴权 → 调 Service → 统一响应
2. 禁止为每个「操作」建独立目录（如 ~~auth/login/route.ts~~）
3. 禁止在 GET 请求中修改数据
4. 禁止跳过 Validator 直接传参给 Service

## 统一响应格式

```typescript
// 成功
{ success: true, data: T }

// 失败
{ success: false, error: "错误信息" }

// 分页
{ success: true, data: { items: T[], total: number, page: number, pageSize: number } }
```

## HTTP 状态码

| 状态码 | 含义 |
|---|---|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 参数错误 |
| 401 | 未登录/token 过期 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 409 | 冲突（如删除有子节点的部门） |
