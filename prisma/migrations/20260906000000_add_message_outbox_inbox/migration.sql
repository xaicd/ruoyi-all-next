CREATE TABLE IF NOT EXISTS "infra_message_outbox" (
  "id" TEXT NOT NULL,
  "event_id" VARCHAR(64) NOT NULL,
  "subject" VARCHAR(200) NOT NULL,
  "type" VARCHAR(120) NOT NULL,
  "source" VARCHAR(64) NOT NULL,
  "payload" TEXT NOT NULL,
  "headers" TEXT NOT NULL,
  "status" VARCHAR(20) NOT NULL,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "tenant_id" VARCHAR(64),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "published_at" TIMESTAMP(3),
  CONSTRAINT "infra_message_outbox_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "infra_message_outbox_event_id_key" ON "infra_message_outbox"("event_id");
CREATE INDEX IF NOT EXISTS "infra_message_outbox_status_created_at_idx" ON "infra_message_outbox"("status", "created_at");
CREATE INDEX IF NOT EXISTS "infra_message_outbox_tenant_id_status_idx" ON "infra_message_outbox"("tenant_id", "status");

CREATE TABLE IF NOT EXISTS "infra_message_inbox" (
  "id" TEXT NOT NULL,
  "consumer" VARCHAR(120) NOT NULL,
  "event_id" VARCHAR(64) NOT NULL,
  "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "infra_message_inbox_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "infra_message_inbox_consumer_event_id_key" ON "infra_message_inbox"("consumer", "event_id");
