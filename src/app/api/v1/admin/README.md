# /api/v1/admin/

管理后台 API（计划从 /api/admin/ 迁移到这里）。

当前 admin API 仍在 `/api/admin/` 下，后续统一迁移到 `/api/v1/admin/`。

迁移策略：
1. 新增接口直接建在 /api/v1/admin/ 下
2. 旧接口逐步迁移，保留旧路径 redirect
3. 最终下线旧路径
