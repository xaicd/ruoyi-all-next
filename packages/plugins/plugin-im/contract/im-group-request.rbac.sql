-- ============================================================
-- Auto-generated RBAC & Menu Migration for ImGroupRequest（源框架导入） (ImGroupRequest)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-im-group-request',
  'im-dir',
  'ImGroupRequest（源框架导入）管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-im-group-request-query',  'menu-im-group-request', '查询ImGroupRequest（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_group_request:query',  1, NOW(), NOW()),
('menu-im-group-request-create', 'menu-im-group-request', '新增ImGroupRequest（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_group_request:create', 2, NOW(), NOW()),
('menu-im-group-request-update', 'menu-im-group-request', '修改ImGroupRequest（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_group_request:update', 3, NOW(), NOW()),
('menu-im-group-request-delete', 'menu-im-group-request', '删除ImGroupRequest（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_group_request:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-im-group-request'),
('1', 'menu-im-group-request-query'),
('1', 'menu-im-group-request-create'),
('1', 'menu-im-group-request-update'),
('1', 'menu-im-group-request-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-im-group-request'),
('1', 'menu-im-group-request-query'),
('1', 'menu-im-group-request-create'),
('1', 'menu-im-group-request-update'),
('1', 'menu-im-group-request-delete')
ON CONFLICT DO NOTHING;
