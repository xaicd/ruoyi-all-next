-- ============================================================
-- Auto-generated RBAC & Menu Migration for 公众号素材 DO1. a href=https://developers.weixin.qq.com/doc/offiaccount/Asset_Management/New_temporary_ (MpMaterial)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mp-material',
  'mp-dir',
  '公众号素材 DO1. a href=https://developers.weixin.qq.com/doc/offiaccount/Asset_Management/New_temporary_管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mp-material-query',  'menu-mp-material', '查询公众号素材 DO1. a href=https://developers.weixin.qq.com/doc/offiaccount/Asset_Management/New_temporary_', 'BUTTON', 'ACTIVE', 'mp:mp_material:query',  1, NOW(), NOW()),
('menu-mp-material-create', 'menu-mp-material', '新增公众号素材 DO1. a href=https://developers.weixin.qq.com/doc/offiaccount/Asset_Management/New_temporary_', 'BUTTON', 'ACTIVE', 'mp:mp_material:create', 2, NOW(), NOW()),
('menu-mp-material-update', 'menu-mp-material', '修改公众号素材 DO1. a href=https://developers.weixin.qq.com/doc/offiaccount/Asset_Management/New_temporary_', 'BUTTON', 'ACTIVE', 'mp:mp_material:update', 3, NOW(), NOW()),
('menu-mp-material-delete', 'menu-mp-material', '删除公众号素材 DO1. a href=https://developers.weixin.qq.com/doc/offiaccount/Asset_Management/New_temporary_', 'BUTTON', 'ACTIVE', 'mp:mp_material:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mp-material'),
('1', 'menu-mp-material-query'),
('1', 'menu-mp-material-create'),
('1', 'menu-mp-material-update'),
('1', 'menu-mp-material-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mp-material'),
('1', 'menu-mp-material-query'),
('1', 'menu-mp-material-create'),
('1', 'menu-mp-material-update'),
('1', 'menu-mp-material-delete')
ON CONFLICT DO NOTHING;
