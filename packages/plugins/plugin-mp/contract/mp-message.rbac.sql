-- ============================================================
-- Auto-generated RBAC & Menu Migration for 公众号消息 (MpMessage)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mp-message',
  'mp-dir',
  '公众号消息管理',
  '/admin/mp/mp-message',
  'mp/mp-message/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mp:mp_message:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mp-message-query',  'menu-mp-message', '查询公众号消息', 'BUTTON', 'ACTIVE', 'mp:mp_message:query',  1, NOW(), NOW()),
('menu-mp-message-create', 'menu-mp-message', '新增公众号消息', 'BUTTON', 'ACTIVE', 'mp:mp_message:create', 2, NOW(), NOW()),
('menu-mp-message-update', 'menu-mp-message', '修改公众号消息', 'BUTTON', 'ACTIVE', 'mp:mp_message:update', 3, NOW(), NOW()),
('menu-mp-message-delete', 'menu-mp-message', '删除公众号消息', 'BUTTON', 'ACTIVE', 'mp:mp_message:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mp-message-rm',        '1', 'menu-mp-message'),
('menu-mp-message-rm-query',  '1', 'menu-mp-message-query'),
('menu-mp-message-rm-create', '1', 'menu-mp-message-create'),
('menu-mp-message-rm-update', '1', 'menu-mp-message-update'),
('menu-mp-message-rm-delete', '1', 'menu-mp-message-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mp-message-pm',        '1', 'menu-mp-message'),
('menu-mp-message-pm-query',  '1', 'menu-mp-message-query'),
('menu-mp-message-pm-create', '1', 'menu-mp-message-create'),
('menu-mp-message-pm-update', '1', 'menu-mp-message-update'),
('menu-mp-message-pm-delete', '1', 'menu-mp-message-delete')
ON CONFLICT DO NOTHING;
