---
name: product-requirements
description: 需求与原型收敛。新功能、多端、业务项目初始化、空客户端补齐前先启用。
---

# 需求原型

## 启用

用户给业务目标、原型、页面清单，或说“先做出来”，但范围、渠道、验收未写清时。

## 权威

- `docs/guides/project-profile-bootstrap.md`（平台名/Logo/默认账号）
- `docs/architecture/ruoyi-all-next-client-channels.md`
- `docs/architecture/ruoyi-all-next-capability-matrix.md`
- `docs/features/sprint-prod/{MMDD}.md`（原始需求必须追加）

## 输出（缺一不可）

1. **问题**：谁、在哪一端、完成何事。
2. **渠道**：`admin-web` / `h5` / `uniapp` / `flutter` / `desktop-pc`。
3. **API 面**：admin / app / open。禁止客户端走 internal。
4. **范围与非目标**：本批不做的域、不做的运行时（未交付的 H5 工程不得标 DONE）。
5. **验收**：可点路径、权限拒绝、空/错/加载态。
6. **身份**：品牌只改 `src/modules/shared/contract/project-profile.json` 与 `public/branding/`。

## 清单

1. 原始输入已写入当天 sprint 文档。
2. 未发明 catalog 外的域。
3. 未要求客户端 import Next Service。
4. 管理端六要素已列入后续阶段，而不是“只画个图”。

## 禁止

把原型当 API 真源；为赶进度跳过权限与测试。
