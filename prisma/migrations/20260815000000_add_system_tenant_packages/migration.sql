CREATE TABLE "system_tenant_package" (
  "id" TEXT PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL UNIQUE,
  "status" VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
  "remark" VARCHAR(500),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted" BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE "system_tenant_package_menu" (
  "id" TEXT PRIMARY KEY,
  "package_id" TEXT NOT NULL,
  "menu_id" TEXT NOT NULL,
  UNIQUE ("package_id", "menu_id")
);

-- Preserve compatibility with databases seeded before packages were persisted.
INSERT INTO "system_tenant_package" ("id", "name", "status", "remark", "created_at", "updated_at", "deleted")
VALUES ('1', '基础版', 'ACTIVE', '基础系统管理功能', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)
ON CONFLICT ("id") DO NOTHING;

CREATE INDEX "system_tenant_package_status_idx" ON "system_tenant_package"("status");
CREATE INDEX "system_tenant_package_package_id_idx" ON "system_tenant"("package_id");
ALTER TABLE "system_tenant" ADD CONSTRAINT "system_tenant_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "system_tenant_package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "system_tenant_package_menu" ADD CONSTRAINT "system_tenant_package_menu_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "system_tenant_package"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "system_tenant_package_menu" ADD CONSTRAINT "system_tenant_package_menu_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "system_menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
