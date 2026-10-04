-- ============================================================
-- Auto-generated RBAC & Menu Migration for 公众号素材 DO1. a href=https://developers.wei (MpMaterial)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mp-material',
  'mp-dir',
  '公众号素材 DO1. a href=https://developers.wei管理',
  '/admin/mp/mp-material',
  'mp/mp-material/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mp:mp_material:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mp-material-query',  'menu-mp-material', '查询公众号素材 DO1. a href=https://developers.wei', 'BUTTON', 'ACTIVE', 'mp:mp_material:query',  1, NOW(), NOW()),
('menu-mp-material-create', 'menu-mp-material', '新增公众号素材 DO1. a href=https://developers.wei', 'BUTTON', 'ACTIVE', 'mp:mp_material:create', 2, NOW(), NOW()),
('menu-mp-material-update', 'menu-mp-material', '修改公众号素材 DO1. a href=https://developers.wei', 'BUTTON', 'ACTIVE', 'mp:mp_material:update', 3, NOW(), NOW()),
('menu-mp-material-delete', 'menu-mp-material', '删除公众号素材 DO1. a href=https://developers.wei', 'BUTTON', 'ACTIVE', 'mp:mp_material:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mp-material-rm',        '1', 'menu-mp-material'),
('menu-mp-material-rm-query',  '1', 'menu-mp-material-query'),
('menu-mp-material-rm-create', '1', 'menu-mp-material-create'),
('menu-mp-material-rm-update', '1', 'menu-mp-material-update'),
('menu-mp-material-rm-delete', '1', 'menu-mp-material-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mp-material-pm',        '1', 'menu-mp-material'),
('menu-mp-material-pm-query',  '1', 'menu-mp-material-query'),
('menu-mp-material-pm-create', '1', 'menu-mp-material-create'),
('menu-mp-material-pm-update', '1', 'menu-mp-material-update'),
('menu-mp-material-pm-delete', '1', 'menu-mp-material-delete')
ON CONFLICT DO NOTHING;
