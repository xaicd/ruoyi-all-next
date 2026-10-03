-- ============================================================
-- Auto-generated RBAC & Menu Migration for MpMenu（源框架导入） (MpMenu)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mp-menu',
  'mp-dir',
  'MpMenu（源框架导入）管理',
  '/admin/mp/mp-menu',
  'mp/mp-menu/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mp:mp_menu:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mp-menu-query',  'menu-mp-menu', '查询MpMenu（源框架导入）', 'BUTTON', 'ACTIVE', 'mp:mp_menu:query',  1, NOW(), NOW()),
('menu-mp-menu-create', 'menu-mp-menu', '新增MpMenu（源框架导入）', 'BUTTON', 'ACTIVE', 'mp:mp_menu:create', 2, NOW(), NOW()),
('menu-mp-menu-update', 'menu-mp-menu', '修改MpMenu（源框架导入）', 'BUTTON', 'ACTIVE', 'mp:mp_menu:update', 3, NOW(), NOW()),
('menu-mp-menu-delete', 'menu-mp-menu', '删除MpMenu（源框架导入）', 'BUTTON', 'ACTIVE', 'mp:mp_menu:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mp-menu'),
('1', 'menu-mp-menu-query'),
('1', 'menu-mp-menu-create'),
('1', 'menu-mp-menu-update'),
('1', 'menu-mp-menu-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mp-menu'),
('1', 'menu-mp-menu-query'),
('1', 'menu-mp-menu-create'),
('1', 'menu-mp-menu-update'),
('1', 'menu-mp-menu-delete')
ON CONFLICT DO NOTHING;
