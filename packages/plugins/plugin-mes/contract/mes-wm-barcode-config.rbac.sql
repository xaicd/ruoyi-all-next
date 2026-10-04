-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 条码配置 (MesWmBarcodeConfig)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-wm-barcode-config',
  'mes-dir',
  'MES 条码配置管理',
  '/admin/mes/mes-wm-barcode-config',
  'mes/mes-wm-barcode-config/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_barcode_config:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-wm-barcode-config-query',  'menu-mes-wm-barcode-config', '查询MES 条码配置', 'BUTTON', 'ACTIVE', 'mes:mes_wm_barcode_config:query',  1, NOW(), NOW()),
('menu-mes-wm-barcode-config-create', 'menu-mes-wm-barcode-config', '新增MES 条码配置', 'BUTTON', 'ACTIVE', 'mes:mes_wm_barcode_config:create', 2, NOW(), NOW()),
('menu-mes-wm-barcode-config-update', 'menu-mes-wm-barcode-config', '修改MES 条码配置', 'BUTTON', 'ACTIVE', 'mes:mes_wm_barcode_config:update', 3, NOW(), NOW()),
('menu-mes-wm-barcode-config-delete', 'menu-mes-wm-barcode-config', '删除MES 条码配置', 'BUTTON', 'ACTIVE', 'mes:mes_wm_barcode_config:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-wm-barcode-config'),
('1', 'menu-mes-wm-barcode-config-query'),
('1', 'menu-mes-wm-barcode-config-create'),
('1', 'menu-mes-wm-barcode-config-update'),
('1', 'menu-mes-wm-barcode-config-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-wm-barcode-config'),
('1', 'menu-mes-wm-barcode-config-query'),
('1', 'menu-mes-wm-barcode-config-create'),
('1', 'menu-mes-wm-barcode-config-update'),
('1', 'menu-mes-wm-barcode-config-delete')
ON CONFLICT DO NOTHING;
