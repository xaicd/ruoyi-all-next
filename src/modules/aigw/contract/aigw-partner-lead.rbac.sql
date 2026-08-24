-- ============================================================
-- Auto-generated RBAC & Menu Migration for 商机报备与锁定 (AigwPartnerLead)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-aigw-partner-lead',
  'aigw-dir',
  '商机报备与锁定管理',
  '/admin/aigw/aigw-partner-lead',
  'aigw/aigw-partner-lead/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'aigw:partner-lead:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-aigw-partner-lead-query',  'menu-aigw-partner-lead', '查询商机报备与锁定', 'BUTTON', 'ACTIVE', 'aigw:partner-lead:query',  1, NOW(), NOW()),
('menu-aigw-partner-lead-create', 'menu-aigw-partner-lead', '新增商机报备与锁定', 'BUTTON', 'ACTIVE', 'aigw:partner-lead:create', 2, NOW(), NOW()),
('menu-aigw-partner-lead-update', 'menu-aigw-partner-lead', '修改商机报备与锁定', 'BUTTON', 'ACTIVE', 'aigw:partner-lead:update', 3, NOW(), NOW()),
('menu-aigw-partner-lead-delete', 'menu-aigw-partner-lead', '删除商机报备与锁定', 'BUTTON', 'ACTIVE', 'aigw:partner-lead:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-aigw-partner-lead'),
('1', 'menu-aigw-partner-lead-query'),
('1', 'menu-aigw-partner-lead-create'),
('1', 'menu-aigw-partner-lead-update'),
('1', 'menu-aigw-partner-lead-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-aigw-partner-lead'),
('1', 'menu-aigw-partner-lead-query'),
('1', 'menu-aigw-partner-lead-create'),
('1', 'menu-aigw-partner-lead-update'),
('1', 'menu-aigw-partner-lead-delete')
ON CONFLICT DO NOTHING;
