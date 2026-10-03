-- ============================================================
-- Auto-generated RBAC & Menu Migration for MpAutoReply（源框架导入） (MpAutoReply)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mp-auto-reply',
  'mp-dir',
  'MpAutoReply（源框架导入）管理',
  '/admin/mp/mp-auto-reply',
  'mp/mp-auto-reply/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mp:mp_auto_reply:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mp-auto-reply-query',  'menu-mp-auto-reply', '查询MpAutoReply（源框架导入）', 'BUTTON', 'ACTIVE', 'mp:mp_auto_reply:query',  1, NOW(), NOW()),
('menu-mp-auto-reply-create', 'menu-mp-auto-reply', '新增MpAutoReply（源框架导入）', 'BUTTON', 'ACTIVE', 'mp:mp_auto_reply:create', 2, NOW(), NOW()),
('menu-mp-auto-reply-update', 'menu-mp-auto-reply', '修改MpAutoReply（源框架导入）', 'BUTTON', 'ACTIVE', 'mp:mp_auto_reply:update', 3, NOW(), NOW()),
('menu-mp-auto-reply-delete', 'menu-mp-auto-reply', '删除MpAutoReply（源框架导入）', 'BUTTON', 'ACTIVE', 'mp:mp_auto_reply:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mp-auto-reply'),
('1', 'menu-mp-auto-reply-query'),
('1', 'menu-mp-auto-reply-create'),
('1', 'menu-mp-auto-reply-update'),
('1', 'menu-mp-auto-reply-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mp-auto-reply'),
('1', 'menu-mp-auto-reply-query'),
('1', 'menu-mp-auto-reply-create'),
('1', 'menu-mp-auto-reply-update'),
('1', 'menu-mp-auto-reply-delete')
ON CONFLICT DO NOTHING;
