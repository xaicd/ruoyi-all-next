-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesWmMaterialStock（源框架导入） (MesWmMaterialStock)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-wm-material-stock',
  'mes-dir',
  'MesWmMaterialStock（源框架导入）管理',
  '/admin/mes/mes-wm-material-stock',
  'mes/mes-wm-material-stock/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_material_stock:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-wm-material-stock-query',  'menu-mes-wm-material-stock', '查询MesWmMaterialStock（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_material_stock:query',  1, NOW(), NOW()),
('menu-mes-wm-material-stock-create', 'menu-mes-wm-material-stock', '新增MesWmMaterialStock（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_material_stock:create', 2, NOW(), NOW()),
('menu-mes-wm-material-stock-update', 'menu-mes-wm-material-stock', '修改MesWmMaterialStock（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_material_stock:update', 3, NOW(), NOW()),
('menu-mes-wm-material-stock-delete', 'menu-mes-wm-material-stock', '删除MesWmMaterialStock（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_material_stock:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-wm-material-stock'),
('1', 'menu-mes-wm-material-stock-query'),
('1', 'menu-mes-wm-material-stock-create'),
('1', 'menu-mes-wm-material-stock-update'),
('1', 'menu-mes-wm-material-stock-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-wm-material-stock'),
('1', 'menu-mes-wm-material-stock-query'),
('1', 'menu-mes-wm-material-stock-create'),
('1', 'menu-mes-wm-material-stock-update'),
('1', 'menu-mes-wm-material-stock-delete')
ON CONFLICT DO NOTHING;
