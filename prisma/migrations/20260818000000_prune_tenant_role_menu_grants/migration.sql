-- Tenant roles may only retain grants present in their tenant's active package.
-- This repairs historical all-menu grants; platform-global roles are untouched.
DELETE FROM "system_role_menu" AS role_menu
USING "system_role" AS role, "system_tenant" AS tenant
WHERE role_menu."role_id" = role."id"
  AND role."tenant_id" = tenant."id"
  AND tenant."deleted" = false
  AND NOT EXISTS (
    SELECT 1
    FROM "system_tenant_package_menu" AS package_menu
    WHERE package_menu."package_id" = tenant."package_id"
      AND package_menu."menu_id" = role_menu."menu_id"
  );
