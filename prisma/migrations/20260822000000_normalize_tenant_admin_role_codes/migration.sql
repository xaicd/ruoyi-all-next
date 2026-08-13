-- Tenant-admin role codes are business-facing identifiers. Historical records
-- embedded an internal tenant UUID (tenant_admin_<uuid>); retain the role IDs
-- and all their user/menu links while replacing only those generated codes.
--
-- Abort rather than overwrite if a non-target role has already claimed one of
-- the readable target codes. system_role.code is globally unique.
DO $$
BEGIN
  IF EXISTS (
    WITH candidates AS (
      SELECT role."id", 'tenant-admin-' || tenant."tenant_code" AS target_code
      FROM "system_role" AS role
      INNER JOIN "system_tenant" AS tenant ON tenant."id" = role."tenant_id"
      WHERE role."deleted" = false
        AND role."name" = '租户管理员'
        AND (
          role."code" = 'tenant_admin'
          OR role."code" = 'tenant_admin_' || tenant."id"
        )
    )
    SELECT 1
    FROM candidates
    INNER JOIN "system_role" AS conflicting
      ON conflicting."code" = candidates.target_code
      AND conflicting."id" <> candidates."id"
  ) THEN
    RAISE EXCEPTION 'Cannot normalize tenant-admin role codes because a target code is already in use';
  END IF;
END $$;

UPDATE "system_role" AS role
SET "code" = 'tenant-admin-' || tenant."tenant_code",
    "updated_at" = CURRENT_TIMESTAMP
FROM "system_tenant" AS tenant
WHERE role."tenant_id" = tenant."id"
  AND role."deleted" = false
  AND role."name" = '租户管理员'
  AND (
    role."code" = 'tenant_admin'
    OR role."code" = 'tenant_admin_' || tenant."id"
  );
