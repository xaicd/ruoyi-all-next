# Registry Snippets for {{moduleKebab}}

## permissions.ts

```ts
{{modulePermissionConst}}: "{{moduleKebab}}:{{featureListKebab}}:view",
```

## admin-menu.ts

```ts
{
  key: "{{moduleKebab}}-{{featureListKebab}}",
  label: "{{moduleLabel}}{{featureListLabel}}",
  path: "/admin/{{moduleKebab}}/{{featureListKebab}}",
  requiredPermission: PERMISSIONS.{{modulePermissionConst}},
}
```

## capability-matrix.md row suggestion

```md
| {{moduleKebab}} | {{moduleLabel}}领域能力 | PARTIAL | 由 codegen 模板包生成最小闭环骨架 |
```
