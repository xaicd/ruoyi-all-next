---
inclusion: auto
---

# 三端功能开发与脚手架规则

新增业务功能必须优先遵循仓库级 Skill：`/feature-development-workflow`。固定顺序为：业务需求 → 数据库与索引 → API/权限 → 程序设计 → 实现或受控生成 → 三端动态配置 → 迁移加载与验收。

- 仅在需求、数据/索引、API 和权限设计完成后，才评估能否使用 `npm run feature:generate` 创建三端基础壳；生成器不替代领域设计。
- `src/shared/feature-scaffold/registry.ts` 是脚手架功能三端入口的唯一来源；禁止把同一个生成特性手工复制到后台菜单、商户菜单或 C 端快捷入口。
- 后台权限采用双层模型：先在 `permissions.registry.ts` 注册权限语义、在 `role-permissions.ts` 维护系统角色默认基线；实际菜单与角色菜单授权必须通过迁移、种子或 `AdminRbacService` 持久化到 `AdminMenu`、`AdminRole`、`AdminRoleMenu`，并以数据库运行时加载结果为准。
- 当前 `feature:generate` 不会自动写入这些后台运行态菜单/授权记录；交付功能前必须完成对应数据库配置与加载验收。
- 生成的 Service 仅为可运行的空列表契约。交付前必须实现领域查询、数据权限、事务、日志、错误处理以及必要的审批/履约逻辑。
- 新写接口、详情接口、审批和定时任务仍必须登记 `docs/api-routes.md`，并遵守 Route 薄层规范。
- 完整的受控生成命令、回滚和安全边界见 `docs/guides/feature-codegen.md`；全流程门禁见 `.kiro/skills/feature-development-workflow/SKILL.md`。
