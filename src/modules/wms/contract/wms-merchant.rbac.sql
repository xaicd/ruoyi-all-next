-- ============================================================
-- Auto-generated RBAC & Menu Migration for 货主管理 (WmsMerchant)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-wms-merchant',
  'wms-dir',
  '货主管理管理',
  '/admin/wms/wms-merchant',
  'wms/wms-merchant/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'wms:merchant:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-wms-merchant-query',  'menu-wms-merchant', '查询货主管理', 'BUTTON', 'ACTIVE', 'wms:merchant:query',  1, NOW(), NOW()),
('menu-wms-merchant-create', 'menu-wms-merchant', '新增货主管理', 'BUTTON', 'ACTIVE', 'wms:merchant:create', 2, NOW(), NOW()),
('menu-wms-merchant-update', 'menu-wms-merchant', '修改货主管理', 'BUTTON', 'ACTIVE', 'wms:merchant:update', 3, NOW(), NOW()),
('menu-wms-merchant-delete', 'menu-wms-merchant', '删除货主管理', 'BUTTON', 'ACTIVE', 'wms:merchant:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-wms-merchant'),
('1', 'menu-wms-merchant-query'),
('1', 'menu-wms-merchant-create'),
('1', 'menu-wms-merchant-update'),
('1', 'menu-wms-merchant-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-wms-merchant'),
('1', 'menu-wms-merchant-query'),
('1', 'menu-wms-merchant-create'),
('1', 'menu-wms-merchant-update'),
('1', 'menu-wms-merchant-delete')
ON CONFLICT DO NOTHING;
