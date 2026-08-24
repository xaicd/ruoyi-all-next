-- 1. 更新企业管理二级目录名称
UPDATE "system_menu" 
SET "name" = '企业管理', "updated_at" = CURRENT_TIMESTAMP
WHERE "id" = 'aigw-identity-dir' OR ("name" = '政企门户' AND "type" = 'DIR');

-- 2. 更新成员席位菜单名称与路径
UPDATE "system_menu"
SET "name" = '成员席位', "path" = 'tenant-members', "component" = 'aigw/tenant-members/index', "updated_at" = CURRENT_TIMESTAMP
WHERE "id" = 'aigw-tenant-members' OR "name" = '成员份额';

-- 3. 软删除/停用旧的席位分配独立菜单
UPDATE "system_menu"
SET "deleted" = true, "status" = 'DISABLED', "visible" = false, "updated_at" = CURRENT_TIMESTAMP
WHERE "id" = 'aigw-seats' OR "name" IN ('席位授权', '席位分配');

-- 4. 确保算力开户与配额管控 4 汉字标准
UPDATE "system_menu"
SET "name" = '算力开户', "updated_at" = CURRENT_TIMESTAMP
WHERE "id" = 'aigw-enterprises';

UPDATE "system_menu"
SET "name" = '配额管控', "updated_at" = CURRENT_TIMESTAMP
WHERE "id" = 'aigw-quotas';
