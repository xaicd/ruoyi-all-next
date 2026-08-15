-- Additive metadata only: Relation targets pin immutable Published Releases.
-- Application code validates tenant and target Definition ownership before writing.
ALTER TABLE "online_relation" ADD COLUMN "target_release_id" TEXT;

ALTER TABLE "online_relation"
  ADD CONSTRAINT "online_relation_target_release_id_fkey"
  FOREIGN KEY ("target_release_id") REFERENCES "online_release"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "online_relation_tenant_id_target_release_id_idx"
  ON "online_relation"("tenant_id", "target_release_id");
