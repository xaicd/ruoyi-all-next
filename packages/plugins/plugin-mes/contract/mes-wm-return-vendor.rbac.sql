-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesWmReturnVendor（源框架导入） (MesWmReturnVendor)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-wm-return-vendor',
  'mes-dir',
  'MesWmReturnVendor（源框架导入）管理',
  '/admin/mes/mes-wm-return-vendor',
  'mes/mes-wm-return-vendor/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_return_vendor:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-wm-return-vendor-query',  'menu-mes-wm-return-vendor', '查询MesWmReturnVendor（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_vendor:query',  1, NOW(), NOW()),
('menu-mes-wm-return-vendor-create', 'menu-mes-wm-return-vendor', '新增MesWmReturnVendor（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_vendor:create', 2, NOW(), NOW()),
('menu-mes-wm-return-vendor-update', 'menu-mes-wm-return-vendor', '修改MesWmReturnVendor（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_vendor:update', 3, NOW(), NOW()),
('menu-mes-wm-return-vendor-delete', 'menu-mes-wm-return-vendor', '删除MesWmReturnVendor（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_vendor:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-wm-return-vendor'),
('1', 'menu-mes-wm-return-vendor-query'),
('1', 'menu-mes-wm-return-vendor-create'),
('1', 'menu-mes-wm-return-vendor-update'),
('1', 'menu-mes-wm-return-vendor-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-wm-return-vendor'),
('1', 'menu-mes-wm-return-vendor-query'),
('1', 'menu-mes-wm-return-vendor-create'),
('1', 'menu-mes-wm-return-vendor-update'),
('1', 'menu-mes-wm-return-vendor-delete')
ON CONFLICT DO NOTHING;
