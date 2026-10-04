-- ============================================================
-- Auto-generated RBAC & Menu Migration for IM 好友申请记录 DO配合「申请 - 审批」流程：- 发起方调 apply 接口落库（handleResult=UNHANDLED）- 接收方调 agree / refuse 处理（更新 ha (ImFriendRequest)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-im-friend-request',
  'im-dir',
  'IM 好友申请记录 DO配合「申请 - 审批」流程：- 发起方调 apply 接口落库（handleResult=UNHANDLED）- 接收方调 agree / refuse 处理（更新 ha管理',
  '/admin/im/im-friend-request',
  'im/im-friend-request/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'im:im_friend_request:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-im-friend-request-query',  'menu-im-friend-request', '查询IM 好友申请记录 DO配合「申请 - 审批」流程：- 发起方调 apply 接口落库（handleResult=UNHANDLED）- 接收方调 agree / refuse 处理（更新 ha', 'BUTTON', 'ACTIVE', 'im:im_friend_request:query',  1, NOW(), NOW()),
('menu-im-friend-request-create', 'menu-im-friend-request', '新增IM 好友申请记录 DO配合「申请 - 审批」流程：- 发起方调 apply 接口落库（handleResult=UNHANDLED）- 接收方调 agree / refuse 处理（更新 ha', 'BUTTON', 'ACTIVE', 'im:im_friend_request:create', 2, NOW(), NOW()),
('menu-im-friend-request-update', 'menu-im-friend-request', '修改IM 好友申请记录 DO配合「申请 - 审批」流程：- 发起方调 apply 接口落库（handleResult=UNHANDLED）- 接收方调 agree / refuse 处理（更新 ha', 'BUTTON', 'ACTIVE', 'im:im_friend_request:update', 3, NOW(), NOW()),
('menu-im-friend-request-delete', 'menu-im-friend-request', '删除IM 好友申请记录 DO配合「申请 - 审批」流程：- 发起方调 apply 接口落库（handleResult=UNHANDLED）- 接收方调 agree / refuse 处理（更新 ha', 'BUTTON', 'ACTIVE', 'im:im_friend_request:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-im-friend-request'),
('1', 'menu-im-friend-request-query'),
('1', 'menu-im-friend-request-create'),
('1', 'menu-im-friend-request-update'),
('1', 'menu-im-friend-request-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-im-friend-request'),
('1', 'menu-im-friend-request-query'),
('1', 'menu-im-friend-request-create'),
('1', 'menu-im-friend-request-update'),
('1', 'menu-im-friend-request-delete')
ON CONFLICT DO NOTHING;
