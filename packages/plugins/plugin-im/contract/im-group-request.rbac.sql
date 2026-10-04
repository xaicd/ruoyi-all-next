-- ============================================================
-- Auto-generated RBAC & Menu Migration for IM 加群申请记录 DO配合「申请 - 审批」流程：用户主动申请：调 apply (ImGroupRequest)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-im-group-request',
  'im-dir',
  'IM 加群申请记录 DO配合「申请 - 审批」流程：用户主动申请：调 apply管理',
  '/admin/im/im-group-request',
  'im/im-group-request/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'im:im_group_request:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-im-group-request-query',  'menu-im-group-request', '查询IM 加群申请记录 DO配合「申请 - 审批」流程：用户主动申请：调 apply', 'BUTTON', 'ACTIVE', 'im:im_group_request:query',  1, NOW(), NOW()),
('menu-im-group-request-create', 'menu-im-group-request', '新增IM 加群申请记录 DO配合「申请 - 审批」流程：用户主动申请：调 apply', 'BUTTON', 'ACTIVE', 'im:im_group_request:create', 2, NOW(), NOW()),
('menu-im-group-request-update', 'menu-im-group-request', '修改IM 加群申请记录 DO配合「申请 - 审批」流程：用户主动申请：调 apply', 'BUTTON', 'ACTIVE', 'im:im_group_request:update', 3, NOW(), NOW()),
('menu-im-group-request-delete', 'menu-im-group-request', '删除IM 加群申请记录 DO配合「申请 - 审批」流程：用户主动申请：调 apply', 'BUTTON', 'ACTIVE', 'im:im_group_request:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-im-group-request-rm',        '1', 'menu-im-group-request'),
('menu-im-group-request-rm-query',  '1', 'menu-im-group-request-query'),
('menu-im-group-request-rm-create', '1', 'menu-im-group-request-create'),
('menu-im-group-request-rm-update', '1', 'menu-im-group-request-update'),
('menu-im-group-request-rm-delete', '1', 'menu-im-group-request-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-im-group-request-pm',        '1', 'menu-im-group-request'),
('menu-im-group-request-pm-query',  '1', 'menu-im-group-request-query'),
('menu-im-group-request-pm-create', '1', 'menu-im-group-request-create'),
('menu-im-group-request-pm-update', '1', 'menu-im-group-request-update'),
('menu-im-group-request-pm-delete', '1', 'menu-im-group-request-delete')
ON CONFLICT DO NOTHING;
