-- ============================================================
-- Auto-generated RBAC & Menu Migration for 渠道代理商 (AigwPartner)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-aigw-partner',
  'aigw-dir',
  '渠道代理商管理',
  '/admin/aigw/aigw-partner',
  'aigw/aigw-partner/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'aigw:partner:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-aigw-partner-query',  'menu-aigw-partner', '查询渠道代理商', 'BUTTON', 'ACTIVE', 'aigw:partner:query',  1, NOW(), NOW()),
('menu-aigw-partner-create', 'menu-aigw-partner', '新增渠道代理商', 'BUTTON', 'ACTIVE', 'aigw:partner:create', 2, NOW(), NOW()),
('menu-aigw-partner-update', 'menu-aigw-partner', '修改渠道代理商', 'BUTTON', 'ACTIVE', 'aigw:partner:update', 3, NOW(), NOW()),
('menu-aigw-partner-delete', 'menu-aigw-partner', '删除渠道代理商', 'BUTTON', 'ACTIVE', 'aigw:partner:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-aigw-partner'),
('1', 'menu-aigw-partner-query'),
('1', 'menu-aigw-partner-create'),
('1', 'menu-aigw-partner-update'),
('1', 'menu-aigw-partner-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-aigw-partner'),
('1', 'menu-aigw-partner-query'),
('1', 'menu-aigw-partner-create'),
('1', 'menu-aigw-partner-update'),
('1', 'menu-aigw-partner-delete')
ON CONFLICT DO NOTHING;
