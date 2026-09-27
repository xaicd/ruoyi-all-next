---
name: ui-framework-governance
description: 管理端页面模板、结构与交互治理：筛选区/工具栏/表格区/分页区结构、shared/template 复用、权限可见性一致性与空/错/载三态。新增后台页面或组件、评审 UI 规范时启用。
---

# ui-framework-governance

## Purpose

统一 all-next 管理端页面在模板、结构和可维护性上的 UI 治理。

## Use When

1. 新增后台页面或组件。
2. 新增模板涉及页面交互结构。
3. 需要评审是否符合统一 UI 规范。

## Checklist

1. 页面结构包含筛选区、工具栏、表格区、分页区。
2. 复用 shared/template，不重复造轮子。
3. 权限可见性与行为控制一致。
4. 空状态、错误态、加载态完整。
