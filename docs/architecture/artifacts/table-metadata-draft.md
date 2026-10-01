# 表元数据草稿（待评审，**未接入**）

> 由 `node scripts/draft-missing-table-metadata.cjs` 生成，**请勿直接使用**。
> 本仓表定义真源是低代码元数据（AGENTS §9.5）：评审通过后手工写入
> `scripts/data/<x>-tables.ts`，再用 `scripts/generate-table-migration.ts` 生成迁移。
> 之所以只是草稿: TS 类型不足以确定 PG 类型（`number` 可能是 int 也可能是 decimal；
> `createdAt: string` 语义上是 timestamp），标 `?` 处需人工判断。

生成时间: 2026-10-01T10:32:27.451Z

## aigw_contract （已在门禁的已知欠债列表中）

来源仓储: `packages/plugins/plugin-aigw/backend/repositories/aigw-settlement.repository.ts`

| 列 | 建议 PG 类型 | 依据 |
|---|---|---|
| `id` | `TEXT` | string |
| `tenant_id` | `VARCHAR(255)` | string |
| `contract_no` | `VARCHAR(255)` | string |
| `title` | `VARCHAR(255)` | string |
| `enterprise_id` | `VARCHAR(255)` | string |
| `enterprise_name` | `VARCHAR(255)` | string |
| `carrier_name` | `VARCHAR(255)` | string |
| `granted_tokens` | `INTEGER ?` | number |
| `amount` | `DECIMAL(18,4) ?` | number |
| `contract_amount` | `DECIMAL(18,4) ?` | number |
| `settled_amount` | `DECIMAL(18,4) ?` | number |
| `status` | `VARCHAR(255)` | string |
| `created_at` | `TIMESTAMP(3) ?` | string |
| `updated_at` | `TIMESTAMP(3) ?` | string |

待确认: 主键、NOT NULL 约束、默认值、索引、审计底座字段是否齐全。

## aigw_enterprise （已在门禁的已知欠债列表中）

来源仓储: `packages/plugins/plugin-aigw/backend/repositories/aigw-enterprise.repository.ts`

| 列 | 建议 PG 类型 | 依据 |
|---|---|---|
| `id` | `TEXT` | string |
| `tenant_id` | `VARCHAR(255)` | string |
| `name` | `VARCHAR(255)` | string |
| `code` | `VARCHAR(255)` | string |
| `credit_code` | `VARCHAR(255)` | string |
| `province` | `VARCHAR(255)` | string |
| `city` | `VARCHAR(255)` | string |
| `industry` | `VARCHAR(255)` | string |
| `contact_name` | `VARCHAR(255)` | string |
| `contact_phone` | `VARCHAR(255)` | string |
| `status` | `VARCHAR(255)` | string |
| `created_at` | `TIMESTAMP(3) ?` | string |
| `updated_at` | `TIMESTAMP(3) ?` | string |

待确认: 主键、NOT NULL 约束、默认值、索引、审计底座字段是否齐全。

## aigw_quota （已在门禁的已知欠债列表中）

来源仓储: `packages/plugins/plugin-aigw/backend/repositories/aigw-quota.repository.ts`

| 列 | 建议 PG 类型 | 依据 |
|---|---|---|
| `id` | `TEXT` | string |
| `tenant_id` | `VARCHAR(255)` | string |
| `enterprise_id` | `VARCHAR(255)` | string |
| `enterprise_name` | `VARCHAR(255)` | string |
| `monthly_token_cap` | `INTEGER ?` | number |
| `used_token_count` | `INTEGER ?` | number |
| `warn_threshold_ratio` | `DECIMAL(18,4) ?` | number |
| `auto_throttle` | `BOOLEAN` | boolean |
| `status` | `VARCHAR(255)` | string |
| `created_at` | `TIMESTAMP(3) ?` | string |
| `updated_at` | `TIMESTAMP(3) ?` | string |

待确认: 主键、NOT NULL 约束、默认值、索引、审计底座字段是否齐全。

## aigw_seat （已在门禁的已知欠债列表中）

来源仓储: `packages/plugins/plugin-aigw/backend/repositories/aigw-seat.repository.ts`

| 列 | 建议 PG 类型 | 依据 |
|---|---|---|
| `id` | `TEXT` | string |
| `tenant_id` | `VARCHAR(255)` | string |
| `enterprise_id` | `VARCHAR(255)` | string |
| `user_id` | `VARCHAR(255)` | string |
| `user_name` | `VARCHAR(255)` | string |
| `user_email` | `VARCHAR(255)` | string |
| `app_type` | `VARCHAR(255)` | string |
| `vendor_seat_id` | `VARCHAR(255)` | string |
| `monthly_token_cap` | `INTEGER ?` | number |
| `used_token_count` | `INTEGER ?` | number |
| `status` | `VARCHAR(255)` | string |
| `created_at` | `TIMESTAMP(3) ?` | string |
| `updated_at` | `TIMESTAMP(3) ?` | string |

待确认: 主键、NOT NULL 约束、默认值、索引、审计底座字段是否齐全。

## aigw_split_pipeline （已在门禁的已知欠债列表中）

来源仓储: `packages/plugins/plugin-aigw/backend/repositories/aigw-split.repository.ts`

| 列 | 建议 PG 类型 | 依据 |
|---|---|---|
| `id` | `TEXT` | string |
| `tenant_id` | `VARCHAR(255)` | string |
| `name` | `VARCHAR(255)` | string |
| `channel_code` | `VARCHAR(255)` | string |
| `partner_name` | `VARCHAR(255)` | string |
| `carrier_name` | `VARCHAR(255)` | string |
| `month` | `VARCHAR(255)` | string |
| `total_tokens` | `VARCHAR(255)` | string |
| `total_amount` | `VARCHAR(255)` | string |
| `carrier_share` | `VARCHAR(255)` | string |
| `platform_share` | `VARCHAR(255)` | string |
| `commission_rate_ratio` | `DECIMAL(18,4) ?` | number |
| `total_revenue_amount` | `DECIMAL(18,4) ?` | number |
| `settled_commission_amount` | `DECIMAL(18,4) ?` | number |
| `status` | `VARCHAR(255)` | string |
| `created_at` | `TIMESTAMP(3) ?` | string |
| `updated_at` | `TIMESTAMP(3) ?` | string |

待确认: 主键、NOT NULL 约束、默认值、索引、审计底座字段是否齐全。

## aigw_tariff （已在门禁的已知欠债列表中）

来源仓储: `packages/plugins/plugin-aigw/backend/repositories/aigw-tariff.repository.ts`

| 列 | 建议 PG 类型 | 依据 |
|---|---|---|
| `id` | `TEXT` | string |
| `tenant_id` | `VARCHAR(255)` | string |
| `name` | `VARCHAR(255)` | string |
| `code` | `VARCHAR(255)` | string |
| `model_group` | `VARCHAR(255)` | string |
| `base_rate_per_ktokens` | `DECIMAL(18,4) ?` | number |
| `tier1_threshold_tokens` | `INTEGER ?` | number |
| `tier1_discount_rate` | `DECIMAL(18,4) ?` | number |
| `status` | `VARCHAR(255)` | string |
| `created_at` | `TIMESTAMP(3) ?` | string |
| `updated_at` | `TIMESTAMP(3) ?` | string |

待确认: 主键、NOT NULL 约束、默认值、索引、审计底座字段是否齐全。
