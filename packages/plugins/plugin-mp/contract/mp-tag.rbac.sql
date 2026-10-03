-- ============================================================
-- Auto-generated RBAC & Menu Migration for MpTag（源框架导入） (MpTag)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mp-tag',
  'mp-dir',
  'MpTag（源框架导入）管理',
  '/admin/mp/mp-tag',
  'mp/mp-tag/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mp:mp_tag:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mp-tag-query',  'menu-mp-tag', '查询MpTag（源框架导入）', 'BUTTON', 'ACTIVE', 'mp:mp_tag:query',  1, NOW(), NOW()),
('menu-mp-tag-create', 'menu-mp-tag', '新增MpTag（源框架导入）', 'BUTTON', 'ACTIVE', 'mp:mp_tag:create', 2, NOW(), NOW()),
('menu-mp-tag-update', 'menu-mp-tag', '修改MpTag（源框架导入）', 'BUTTON', 'ACTIVE', 'mp:mp_tag:update', 3, NOW(), NOW()),
('menu-mp-tag-delete', 'menu-mp-tag', '删除MpTag（源框架导入）', 'BUTTON', 'ACTIVE', 'mp:mp_tag:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mp-tag'),
('1', 'menu-mp-tag-query'),
('1', 'menu-mp-tag-create'),
('1', 'menu-mp-tag-update'),
('1', 'menu-mp-tag-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mp-tag'),
('1', 'menu-mp-tag-query'),
('1', 'menu-mp-tag-create'),
('1', 'menu-mp-tag-update'),
('1', 'menu-mp-tag-delete')
ON CONFLICT DO NOTHING;
