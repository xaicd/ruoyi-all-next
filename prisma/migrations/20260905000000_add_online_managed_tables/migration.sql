CREATE TABLE "online_managed_table" (
  "id" TEXT PRIMARY KEY,
  "tenant_id" TEXT NOT NULL,
  "definition_id" TEXT NOT NULL UNIQUE,
  "physical_table_name" VARCHAR(64) NOT NULL UNIQUE,
  "schema_revision" INTEGER NOT NULL DEFAULT 0,
  "model_fingerprint" VARCHAR(64) NOT NULL,
  "last_plan_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "online_managed_table_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "online_managed_table_definition_id_fkey" FOREIGN KEY ("definition_id") REFERENCES "online_definition"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "online_managed_table_tenant_id_physical_table_name_idx" ON "online_managed_table"("tenant_id", "physical_table_name");
