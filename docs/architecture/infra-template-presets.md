# Infra Template Presets

This directory stores built-in low-code template assets for the `next-react` stack.

## Current preset families

- `next-react-admin-route.template.ts`
- `next-react-admin-service.template.ts`
- `next-react-admin-validator.template.ts`
- `next-react-admin-page.template.ts`
- `next-react-admin-client.template.ts`
- `next-react-admin-types.template.ts`
- `next-react-admin-tree-page.template.ts`
- `next-react-admin-tree-service.template.ts`
- `next-react-admin-tree-route.template.ts`
- `next-react-admin-tree-validator.template.ts`
- `next-react-admin-tree-client.template.ts`
- `next-react-admin-tree-types.template.ts`
- `next-react-admin-workflow-page.template.ts`
- `next-react-admin-workflow-route.template.ts`
- `next-react-admin-workflow-service.template.ts`
- `next-react-admin-workflow-validator.template.ts`
- `next-react-admin-workflow-client.template.ts`
- `next-react-admin-workflow-types.template.ts`
- `next-react-admin-domain-page.template.ts`
- `next-react-admin-domain-client.template.ts`
- `next-react-admin-domain-types-index.template.ts`
- `next-react-admin-route-index.template.ts`
- `next-react-admin-form-component.template.ts`
- `next-react-admin-detail-drawer.template.ts`
- `next-react-admin-filter-bar.template.ts`
- `next-react-admin-table-columns.template.ts`
- `next-react-admin-store-slice.template.ts`
- `next-react-admin-hook.template.ts`
- `next-react-admin-permission-const.template.ts`
- `next-react-admin-locale.template.ts`
- `next-react-admin-login-page.template.ts`
- `next-react-admin-home-page.template.ts`
- `next-react-admin-profile-page.template.ts`
- `next-react-admin-error-page.template.ts`
- `next-react-admin-iframe-page.template.ts`
- `next-react-admin-redirect-page.template.ts`
- `next-react-admin-router-access.template.ts`
- `next-react-admin-toolbar-component.template.ts`
- `next-react-admin-report-page.template.ts`
- `next-react-admin-wms-page.template.ts`
- `next-react-admin-mes-page.template.ts`
- `next-react-admin-im-page.template.ts`
- `next-react-admin-layout-shell.template.ts`
- `next-react-admin-plugin-registry.template.ts`
- `next-react-admin-app-config.template.ts`
- `next-react-admin-theme-styles.template.ts`
- `next-react-admin-utils-format.template.ts`
- `next-react-admin-assets-manifest.template.ts`
- `next-react-admin-domain-list-page.template.ts`
- `next-react-admin-domain-detail-page.template.ts`
- `next-react-admin-domain-api-index.template.ts`
- `next-react-admin-domain-view-index.template.ts`
- `next-react-admin-service-facade.template.ts`
- `next-react-admin-service-rpc.template.ts`
- `next-react-admin-service-strategy.template.ts`
- `next-react-admin-service-guard.template.ts`
- `next-react-admin-service-test.template.ts`
- `next-react-admin-service-pattern-pack.template.ts`
- `next-react-merchant-page.template.ts`
- `next-react-merchant-client.template.ts`
- `next-react-c-end-page.template.ts`
- `next-react-c-end-client.template.ts`

## Why this exists

- Keep each file-family template isolated and maintainable.
- Avoid growing one large inline-string file.
- Make it easy to add more families (tree/workflow/mobile) incrementally.

The registry entry point is `index.ts`, and assembly happens in `../template-engine-presets.ts`.
