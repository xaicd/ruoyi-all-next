CREATE TABLE "online_record" (
  "id" TEXT PRIMARY KEY,
  "tenant_id" TEXT NOT NULL,
  "definition_id" TEXT NOT NULL,
  "release_id" TEXT NOT NULL,
  "test_session_id" TEXT NOT NULL,
  "schema_revision" INTEGER NOT NULL,
  "data_json" JSONB NOT NULL,
  "created_by" TEXT NOT NULL,
  "updated_by" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted" BOOLEAN NOT NULL DEFAULT false
);
ALTER TABLE "online_record" ADD CONSTRAINT "online_record_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "online_record" ADD CONSTRAINT "online_record_definition_id_fkey" FOREIGN KEY ("definition_id") REFERENCES "online_definition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "online_record" ADD CONSTRAINT "online_record_release_id_fkey" FOREIGN KEY ("release_id") REFERENCES "online_release"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "online_record" ADD CONSTRAINT "online_record_test_session_id_fkey" FOREIGN KEY ("test_session_id") REFERENCES "online_test_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX "online_record_tenant_definition_release_updated_at_idx" ON "online_record"("tenant_id", "definition_id", "release_id", "updated_at");
CREATE INDEX "online_record_tenant_test_session_updated_at_idx" ON "online_record"("tenant_id", "test_session_id", "updated_at");
