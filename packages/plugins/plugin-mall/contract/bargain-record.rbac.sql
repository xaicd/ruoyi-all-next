-- ============================================================
-- Auto-generated RBAC & Menu Migration for 砍价记录 DO TO (BargainRecord)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-bargain-record',
  'mall-dir',
  '砍价记录 DO TO管理',
  '/admin/mall/bargain-record',
  'mall/bargain-record/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:bargain_record:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-bargain-record-query',  'menu-bargain-record', '查询砍价记录 DO TO', 'BUTTON', 'ACTIVE', 'mall:bargain_record:query',  1, NOW(), NOW()),
('menu-bargain-record-create', 'menu-bargain-record', '新增砍价记录 DO TO', 'BUTTON', 'ACTIVE', 'mall:bargain_record:create', 2, NOW(), NOW()),
('menu-bargain-record-update', 'menu-bargain-record', '修改砍价记录 DO TO', 'BUTTON', 'ACTIVE', 'mall:bargain_record:update', 3, NOW(), NOW()),
('menu-bargain-record-delete', 'menu-bargain-record', '删除砍价记录 DO TO', 'BUTTON', 'ACTIVE', 'mall:bargain_record:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-bargain-record'),
('1', 'menu-bargain-record-query'),
('1', 'menu-bargain-record-create'),
('1', 'menu-bargain-record-update'),
('1', 'menu-bargain-record-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-bargain-record'),
('1', 'menu-bargain-record-query'),
('1', 'menu-bargain-record-create'),
('1', 'menu-bargain-record-update'),
('1', 'menu-bargain-record-delete')
ON CONFLICT DO NOTHING;
