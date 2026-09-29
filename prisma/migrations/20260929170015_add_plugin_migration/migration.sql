-- 第一方插件自带迁移的应用记录（幂等用）。
-- 注意: 这记录的是**插件自己的 schema** 里执行过的迁移，与宿主 public schema 的
-- Prisma 迁移是两套东西 —— 后者仍由 prisma migrate 管理，插件不得触碰。
CREATE TABLE "plugin_migration" (
    "id" TEXT NOT NULL,
    "plugin_key" VARCHAR(128) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "schema" VARCHAR(100) NOT NULL,
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "plugin_migration_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "plugin_migration_plugin_key_name_key" ON "plugin_migration"("plugin_key", "name");
