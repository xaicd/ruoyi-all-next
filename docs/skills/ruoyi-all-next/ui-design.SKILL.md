---
name: ui-design
description: 管理端与 C 端 UI/UX。画页面、改布局、做 H5/uni-app/Flutter/桌面壳时启用。
---

# UI 设计

## 同时启用

- `ui-framework-governance.SKILL.md`（管理端结构）
- `.kiro/steering/ui-ux-pro-max/SKILL.md`（检索风格/色板/UX；C 端强制）

## 权威

- `docs/architecture/ruoyi-all-next-client-channels.md`
- `src/modules/shared/frontend/templates`
- `clients/<channel>/{app,shared,modules/<domain>}`

## 渠道

| 渠道 | 放哪 | 设计重点 |
|---|---|---|
| admin-web | `src/modules/<domain>/frontend` | 筛选/工具栏/表格/分页；权限显隐 |
| h5 / uniapp / flutter | `clients/<channel>/.../modules/<domain>` | 拇指区、加载/空/错、会员 JWT |
| desktop-pc | `clients/desktop-pc` 壳 + 管理端页 | 窗口/托盘；业务 UI 不复制一套 Admin |

## 清单

1. 先跑 ui-ux-pro-max 设计系统再写样式，禁止无名彩虹渐变和 emoji 图标。
2. 品牌文案/Logo 来自 `GET /api/v1/open/meta/project-profile`。
3. 可点击元素有 cursor 与 focus；对比度足够。
4. 管理端复用 template，不把新域堆进 `app/`。
5. 域目录名 = `domain-catalog`；域间不互相 import 内部文件。
6. 有布局改动则按真实交互验证，不只截一张图。

## 禁止

为每个端各做一套 DTO；uni-app 根 `pages/` 堆业务。
