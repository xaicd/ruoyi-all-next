-- Rename the existing Online sandbox navigation without changing its route,
-- permission, package grants, or role grants.
UPDATE "system_menu"
SET "name" = 'AUTO报表',
    "updated_at" = CURRENT_TIMESTAMP
WHERE "id" = 'online-114-test-page'
  AND "path" = 'online-test'
  AND "permission" = 'infra:online-definition:test'
  AND "deleted" = false;
