-- 删除随 aigw 定制业务剥离而变成孤儿的 5 张表。
--
-- 依据（AGENTS §17.3「基座只建原生域，定制业务不得进基座」）：
--   * 它们的仓储已在 aigw 剥离时删除（aigw-carrier / aigw-isv-app / aigw-mcp /
--     aigw-member-allocation / aigw-ledger），全仓**没有任何代码查询或写入它们**；
--   * 其中两张还残留在 schema.ts 的类型声明里（本次一并移除，接口数 49 -> 47）。
--
-- 关于种子：这三张表里的 5 行数据来自更早的迁移
-- 20260911000000_add_gov_enterprise_aigw_tables_and_seed。DROP TABLE 会一并清掉它们。
-- **没有改写那条历史迁移** —— 已应用的迁移保持不可变，否则不同环境的数据会不一致。
-- 代价只是全新环境会先建、再被本条 DROP 掉，属于可接受的噪音。
--
-- 删除前已实测各表行数，确认没有代码依赖其中的数据（无查询方即无消费者）。
DROP TABLE IF EXISTS "aigw_carrier_agent";
DROP TABLE IF EXISTS "aigw_isv_app";
DROP TABLE IF EXISTS "aigw_mcp_asset";
DROP TABLE IF EXISTS "aigw_member_allocation";
DROP TABLE IF EXISTS "aigw_tenant_quota_ledger";
