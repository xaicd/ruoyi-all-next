-- ============================================================
-- Auto-generated RBAC & Menu Migration for IM 好友关系 DO业务语义：- 双向关系：A-B 互为好友会存 2 条记录（u (ImFriend)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-im-friend',
  'im-dir',
  'IM 好友关系 DO业务语义：- 双向关系：A-B 互为好友会存 2 条记录（u管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-im-friend-query',  'menu-im-friend', '查询IM 好友关系 DO业务语义：- 双向关系：A-B 互为好友会存 2 条记录（u', 'BUTTON', 'ACTIVE', 'im:im_friend:query',  1, NOW(), NOW()),
('menu-im-friend-create', 'menu-im-friend', '新增IM 好友关系 DO业务语义：- 双向关系：A-B 互为好友会存 2 条记录（u', 'BUTTON', 'ACTIVE', 'im:im_friend:create', 2, NOW(), NOW()),
('menu-im-friend-update', 'menu-im-friend', '修改IM 好友关系 DO业务语义：- 双向关系：A-B 互为好友会存 2 条记录（u', 'BUTTON', 'ACTIVE', 'im:im_friend:update', 3, NOW(), NOW()),
('menu-im-friend-delete', 'menu-im-friend', '删除IM 好友关系 DO业务语义：- 双向关系：A-B 互为好友会存 2 条记录（u', 'BUTTON', 'ACTIVE', 'im:im_friend:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-im-friend-rm',        '1', 'menu-im-friend'),
('menu-im-friend-rm-query',  '1', 'menu-im-friend-query'),
('menu-im-friend-rm-create', '1', 'menu-im-friend-create'),
('menu-im-friend-rm-update', '1', 'menu-im-friend-update'),
('menu-im-friend-rm-delete', '1', 'menu-im-friend-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-im-friend-pm',        '1', 'menu-im-friend'),
('menu-im-friend-pm-query',  '1', 'menu-im-friend-query'),
('menu-im-friend-pm-create', '1', 'menu-im-friend-create'),
('menu-im-friend-pm-update', '1', 'menu-im-friend-update'),
('menu-im-friend-pm-delete', '1', 'menu-im-friend-delete')
ON CONFLICT DO NOTHING;
