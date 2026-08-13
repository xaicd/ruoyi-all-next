-- Password verification uses a per-user salt; this column was omitted from the initial PostgreSQL baseline.
ALTER TABLE "system_user" ADD COLUMN IF NOT EXISTS "salt" VARCHAR(100);

-- Legacy rows cannot authenticate without a salt. New and seeded users always provide one.
