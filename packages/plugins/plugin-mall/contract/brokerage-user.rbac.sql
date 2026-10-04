-- ============================================================
-- Auto-generated RBAC & Menu Migration for 分销用户 (BrokerageUser)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-brokerage-user',
  'mall-dir',
  '分销用户管理',
  '/admin/mall/brokerage-user',
  'mall/brokerage-user/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:brokerage_user:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-brokerage-user-query',  'menu-brokerage-user', '查询分销用户', 'BUTTON', 'ACTIVE', 'mall:brokerage_user:query',  1, NOW(), NOW()),
('menu-brokerage-user-create', 'menu-brokerage-user', '新增分销用户', 'BUTTON', 'ACTIVE', 'mall:brokerage_user:create', 2, NOW(), NOW()),
('menu-brokerage-user-update', 'menu-brokerage-user', '修改分销用户', 'BUTTON', 'ACTIVE', 'mall:brokerage_user:update', 3, NOW(), NOW()),
('menu-brokerage-user-delete', 'menu-brokerage-user', '删除分销用户', 'BUTTON', 'ACTIVE', 'mall:brokerage_user:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-brokerage-user-rm',        '1', 'menu-brokerage-user'),
('menu-brokerage-user-rm-query',  '1', 'menu-brokerage-user-query'),
('menu-brokerage-user-rm-create', '1', 'menu-brokerage-user-create'),
('menu-brokerage-user-rm-update', '1', 'menu-brokerage-user-update'),
('menu-brokerage-user-rm-delete', '1', 'menu-brokerage-user-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-brokerage-user-pm',        '1', 'menu-brokerage-user'),
('menu-brokerage-user-pm-query',  '1', 'menu-brokerage-user-query'),
('menu-brokerage-user-pm-create', '1', 'menu-brokerage-user-create'),
('menu-brokerage-user-pm-update', '1', 'menu-brokerage-user-update'),
('menu-brokerage-user-pm-delete', '1', 'menu-brokerage-user-delete')
ON CONFLICT DO NOTHING;
