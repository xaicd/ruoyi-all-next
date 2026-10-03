-- ============================================================
-- Auto-generated RBAC & Menu Migration for ImFriend（源框架导入） (ImFriend)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-im-friend',
  'im-dir',
  'ImFriend（源框架导入）管理',
  '/admin/im/im-friend',
  'im/im-friend/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'im:im_friend:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-im-friend-query',  'menu-im-friend', '查询ImFriend（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_friend:query',  1, NOW(), NOW()),
('menu-im-friend-create', 'menu-im-friend', '新增ImFriend（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_friend:create', 2, NOW(), NOW()),
('menu-im-friend-update', 'menu-im-friend', '修改ImFriend（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_friend:update', 3, NOW(), NOW()),
('menu-im-friend-delete', 'menu-im-friend', '删除ImFriend（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_friend:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-im-friend'),
('1', 'menu-im-friend-query'),
('1', 'menu-im-friend-create'),
('1', 'menu-im-friend-update'),
('1', 'menu-im-friend-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-im-friend'),
('1', 'menu-im-friend-query'),
('1', 'menu-im-friend-create'),
('1', 'menu-im-friend-update'),
('1', 'menu-im-friend-delete')
ON CONFLICT DO NOTHING;
