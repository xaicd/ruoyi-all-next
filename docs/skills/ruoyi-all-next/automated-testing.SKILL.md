---
name: automated-testing
description: 自动化测试与门禁。新域、鉴权、事务、治理、发版前启用。
---

# 自动化测试

## 权威

- `AGENTS.md` §8
- 域测试：`src/modules/<domain>/backend/services/__tests__/`

## 最低集

1. 新域至少 1 条关键路径测试。
2. 日志规范 → 断言 event/audit。
3. 权限 → 未登录 401、无权限 403。
4. 事务 → 失败回滚。
5. 客户端契约 → `client-channels` / `client-package-layout` 测试保持绿色。

## 命令

```bash
npx vitest run <file>
npm test
npm run check
npm run ruoyi:matrix:check:strict
npm run ruoyi:governance:check:strict
npm run microservice:check
```

## 清单

1. 测试不 import 他域 Service/Repository；跨域用 Facade spy。
2. HTTP 与 broker 共用 schema 时，测一份输入即可覆盖两面。
3. 不把生产密钥写入测试。
4. UI 有浏览器工具则走真实点击，不只截图。

## 禁止

用手动点一下代替门禁；改治理文件却不跑 `check`；测试里 `console.log` 当断言。
