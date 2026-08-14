# /api/v1/admin/

管理后台版本化 API 的唯一 Route Handler 根目录。

- 所有 `/api/v1/admin/**` 请求先经 `src/proxy.ts` 的 Node 认证边界；默认需要有效管理员 JWT。
- 匿名例外只能在 `admin-route-policy.ts` 以精确路径和方法登记；不得按目录或前缀放开。
- Route 必须声明资源级 permission/platform policy。新 Route 必须使用 `withAdminRoute`，以在完整 `runWithTenantContext` 生命周期内执行业务逻辑；旧 Route 按 `docs/architecture/artifacts/admin-route-policy-baseline.json` 逐批迁移。
- 执行 `npm run admin:routes:manifest` 更新策略基线，`npm run admin:routes:check` 会拒绝未审阅的 Route、方法或保护级别变化。
- 新接口不得创建旧 `/api/admin/**` 路径。
