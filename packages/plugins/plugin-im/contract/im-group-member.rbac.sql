-- ============================================================
-- Auto-generated RBAC & Menu Migration for ImGroupMember（源框架导入） (ImGroupMember)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-im-group-member',
  'im-dir',
  'ImGroupMember（源框架导入）管理',
  '/admin/im/im-group-member',
  'im/im-group-member/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'im:im_group_member:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-im-group-member-query',  'menu-im-group-member', '查询ImGroupMember（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_group_member:query',  1, NOW(), NOW()),
('menu-im-group-member-create', 'menu-im-group-member', '新增ImGroupMember（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_group_member:create', 2, NOW(), NOW()),
('menu-im-group-member-update', 'menu-im-group-member', '修改ImGroupMember（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_group_member:update', 3, NOW(), NOW()),
('menu-im-group-member-delete', 'menu-im-group-member', '删除ImGroupMember（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_group_member:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-im-group-member'),
('1', 'menu-im-group-member-query'),
('1', 'menu-im-group-member-create'),
('1', 'menu-im-group-member-update'),
('1', 'menu-im-group-member-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-im-group-member'),
('1', 'menu-im-group-member-query'),
('1', 'menu-im-group-member-create'),
('1', 'menu-im-group-member-update'),
('1', 'menu-im-group-member-delete')
ON CONFLICT DO NOTHING;
