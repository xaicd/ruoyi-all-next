# Generated feature registration — {{moduleKebab}}/{{featureListKebab}}

The ZIP deliberately does **not** modify shared registries. Review and register these resources explicitly after inspecting the generated files.

## Permission codes

```ts
{{permissionPrefix}}:query
{{permissionPrefix}}:create
{{permissionPrefix}}:update
{{permissionPrefix}}:delete
```

## Admin menu

```ts
{
  key: "{{moduleKebab}}-{{featureListKebab}}",
  label: "{{moduleLabel}}{{featureListLabel}}",
  path: "/admin/{{moduleKebab}}/{{featureListKebab}}",
  requiredPermission: {{featureListPascal}}PermissionCodes.query,
}
```

## Safety checklist

- Register menu/button permissions before exposing the route.
- Replace the generated in-memory service with a reviewed tenant-aware repository.
- Keep generated output in a reviewable ZIP; do not enable server-side arbitrary directory writes.
