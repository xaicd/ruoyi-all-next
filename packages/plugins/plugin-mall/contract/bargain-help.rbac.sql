-- ============================================================
-- Auto-generated RBAC & Menu Migration for 砍价助力 (BargainHelp)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-bargain-help',
  'mall-dir',
  '砍价助力管理',
  '/admin/mall/bargain-help',
  'mall/bargain-help/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:bargain_help:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-bargain-help-query',  'menu-bargain-help', '查询砍价助力', 'BUTTON', 'ACTIVE', 'mall:bargain_help:query',  1, NOW(), NOW()),
('menu-bargain-help-create', 'menu-bargain-help', '新增砍价助力', 'BUTTON', 'ACTIVE', 'mall:bargain_help:create', 2, NOW(), NOW()),
('menu-bargain-help-update', 'menu-bargain-help', '修改砍价助力', 'BUTTON', 'ACTIVE', 'mall:bargain_help:update', 3, NOW(), NOW()),
('menu-bargain-help-delete', 'menu-bargain-help', '删除砍价助力', 'BUTTON', 'ACTIVE', 'mall:bargain_help:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-bargain-help'),
('1', 'menu-bargain-help-query'),
('1', 'menu-bargain-help-create'),
('1', 'menu-bargain-help-update'),
('1', 'menu-bargain-help-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-bargain-help'),
('1', 'menu-bargain-help-query'),
('1', 'menu-bargain-help-create'),
('1', 'menu-bargain-help-update'),
('1', 'menu-bargain-help-delete')
ON CONFLICT DO NOTHING;
