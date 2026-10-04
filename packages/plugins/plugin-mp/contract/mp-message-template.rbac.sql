-- ============================================================
-- Auto-generated RBAC & Menu Migration for 公众号模版消息 (MpMessageTemplate)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mp-message-template',
  'mp-dir',
  '公众号模版消息管理',
  '/admin/mp/mp-message-template',
  'mp/mp-message-template/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mp:mp_message_template:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mp-message-template-query',  'menu-mp-message-template', '查询公众号模版消息', 'BUTTON', 'ACTIVE', 'mp:mp_message_template:query',  1, NOW(), NOW()),
('menu-mp-message-template-create', 'menu-mp-message-template', '新增公众号模版消息', 'BUTTON', 'ACTIVE', 'mp:mp_message_template:create', 2, NOW(), NOW()),
('menu-mp-message-template-update', 'menu-mp-message-template', '修改公众号模版消息', 'BUTTON', 'ACTIVE', 'mp:mp_message_template:update', 3, NOW(), NOW()),
('menu-mp-message-template-delete', 'menu-mp-message-template', '删除公众号模版消息', 'BUTTON', 'ACTIVE', 'mp:mp_message_template:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mp-message-template-rm',        '1', 'menu-mp-message-template'),
('menu-mp-message-template-rm-query',  '1', 'menu-mp-message-template-query'),
('menu-mp-message-template-rm-create', '1', 'menu-mp-message-template-create'),
('menu-mp-message-template-rm-update', '1', 'menu-mp-message-template-update'),
('menu-mp-message-template-rm-delete', '1', 'menu-mp-message-template-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mp-message-template-pm',        '1', 'menu-mp-message-template'),
('menu-mp-message-template-pm-query',  '1', 'menu-mp-message-template-query'),
('menu-mp-message-template-pm-create', '1', 'menu-mp-message-template-create'),
('menu-mp-message-template-pm-update', '1', 'menu-mp-message-template-update'),
('menu-mp-message-template-pm-delete', '1', 'menu-mp-message-template-delete')
ON CONFLICT DO NOTHING;
