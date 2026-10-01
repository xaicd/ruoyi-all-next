-- system_config：通用配置表（key/value）。
--
-- 为什么补这条迁移：本表此前**只有 sqlite bootstrap 会建**（scripts/bootstrap-sqlite.ts），
-- postgres 侧却没有任何迁移创建它 —— 而 infra/appearance.service.ts 与
-- online/page-schema.service.ts 都在**无条件**查它。后果是同一个静默陷阱：
-- 内存/sqlite 下一切正常，一上 postgres 就 `relation "system_config" does not exist`
-- （本仓实测：真实库模式下 12 个测试因此失败）。
--
-- 列与类型**不是新设计**，而是照抄既有权威定义：
--   * 列与默认值取自 scripts/bootstrap-sqlite.ts 的 CREATE TABLE（该表的事实定义）；
--   * 类型以 packages/shared/backend/lib/database/schema.ts 的 SystemConfigTable 为准
--     （那是应用代码编译所依据的形状：visible/deleted 是 boolean、时间戳是 Date）。
-- INTEGER→BOOLEAN、DATETIME→TIMESTAMP(3) 即由此而来，不是臆断。
CREATE TABLE "system_config" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'DEFAULT',
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'SYSTEM',
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "tenant_id" TEXT NOT NULL DEFAULT 'default',
    "created_by" TEXT NOT NULL DEFAULT 'system',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT NOT NULL DEFAULT 'system',
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "remark" TEXT,
    CONSTRAINT "system_config_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "system_config_key_key" ON "system_config"("key");
CREATE INDEX "system_config_tenant_id_idx" ON "system_config"("tenant_id");
