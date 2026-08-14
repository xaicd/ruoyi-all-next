# Online low-code engine

Phase 1 establishes its module boundary, protected management contract, canonical permissions, OpenAPI registration, and migration-safe replacement of legacy menu `114`. The legacy `infra/pages` Puck prototype is explicitly a migration source, not an Online persistence or runtime dependency.

`GET /api/v1/admin/online/definitions` is protected by `infra:online-definition:query` and returns a baseline capability marker until phase 2 adds tenant-scoped Prisma/Kysely metadata persistence. There is deliberately no memory fallback for Online definitions.

Online Test, runtime writes, publishing, Puck rendering, schema migration execution, and code generation are disabled until their corresponding published-release, schema, policy, and audit boundaries are implemented.
