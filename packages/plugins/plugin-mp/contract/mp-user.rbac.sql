-- ============================================================
-- Auto-generated RBAC & Menu Migration for 微信公众号粉丝 (MpUser)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mp-user',
  'mp-dir',
  '微信公众号粉丝管理',
  '/admin/mp/mp-user',
  'mp/mp-user/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mp:mp_user:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mp-user-query',  'menu-mp-user', '查询微信公众号粉丝', 'BUTTON', 'ACTIVE', 'mp:mp_user:query',  1, NOW(), NOW()),
('menu-mp-user-create', 'menu-mp-user', '新增微信公众号粉丝', 'BUTTON', 'ACTIVE', 'mp:mp_user:create', 2, NOW(), NOW()),
('menu-mp-user-update', 'menu-mp-user', '修改微信公众号粉丝', 'BUTTON', 'ACTIVE', 'mp:mp_user:update', 3, NOW(), NOW()),
('menu-mp-user-delete', 'menu-mp-user', '删除微信公众号粉丝', 'BUTTON', 'ACTIVE', 'mp:mp_user:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mp-user-rm',        '1', 'menu-mp-user'),
('menu-mp-user-rm-query',  '1', 'menu-mp-user-query'),
('menu-mp-user-rm-create', '1', 'menu-mp-user-create'),
('menu-mp-user-rm-update', '1', 'menu-mp-user-update'),
('menu-mp-user-rm-delete', '1', 'menu-mp-user-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mp-user-pm',        '1', 'menu-mp-user'),
('menu-mp-user-pm-query',  '1', 'menu-mp-user-query'),
('menu-mp-user-pm-create', '1', 'menu-mp-user-create'),
('menu-mp-user-pm-update', '1', 'menu-mp-user-update'),
('menu-mp-user-pm-delete', '1', 'menu-mp-user-delete')
ON CONFLICT DO NOTHING;
