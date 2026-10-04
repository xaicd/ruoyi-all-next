-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 供应商 (MesMdVendor)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-md-vendor',
  'mes-dir',
  'MES 供应商管理',
  '/admin/mes/mes-md-vendor',
  'mes/mes-md-vendor/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_md_vendor:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-md-vendor-query',  'menu-mes-md-vendor', '查询MES 供应商', 'BUTTON', 'ACTIVE', 'mes:mes_md_vendor:query',  1, NOW(), NOW()),
('menu-mes-md-vendor-create', 'menu-mes-md-vendor', '新增MES 供应商', 'BUTTON', 'ACTIVE', 'mes:mes_md_vendor:create', 2, NOW(), NOW()),
('menu-mes-md-vendor-update', 'menu-mes-md-vendor', '修改MES 供应商', 'BUTTON', 'ACTIVE', 'mes:mes_md_vendor:update', 3, NOW(), NOW()),
('menu-mes-md-vendor-delete', 'menu-mes-md-vendor', '删除MES 供应商', 'BUTTON', 'ACTIVE', 'mes:mes_md_vendor:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-md-vendor'),
('1', 'menu-mes-md-vendor-query'),
('1', 'menu-mes-md-vendor-create'),
('1', 'menu-mes-md-vendor-update'),
('1', 'menu-mes-md-vendor-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-md-vendor'),
('1', 'menu-mes-md-vendor-query'),
('1', 'menu-mes-md-vendor-create'),
('1', 'menu-mes-md-vendor-update'),
('1', 'menu-mes-md-vendor-delete')
ON CONFLICT DO NOTHING;
