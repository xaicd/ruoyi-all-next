-- Keep the persisted menu label consistent with the static catalog and product naming.
UPDATE "system_menu"
SET "name" = 'AUTO报表',
    "permission" = 'report:custom-sql:execute',
    "updated_at" = CURRENT_TIMESTAMP
WHERE "id" = 'online-114-test-page'
  AND "path" = 'online-test'
  AND "deleted" = false;