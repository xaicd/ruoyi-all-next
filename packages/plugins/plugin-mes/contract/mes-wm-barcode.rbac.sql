-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 条码清单 (MesWmBarcode)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-wm-barcode',
  'mes-dir',
  'MES 条码清单管理',
  '/admin/mes/mes-wm-barcode',
  'mes/mes-wm-barcode/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_barcode:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-wm-barcode-query',  'menu-mes-wm-barcode', '查询MES 条码清单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_barcode:query',  1, NOW(), NOW()),
('menu-mes-wm-barcode-create', 'menu-mes-wm-barcode', '新增MES 条码清单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_barcode:create', 2, NOW(), NOW()),
('menu-mes-wm-barcode-update', 'menu-mes-wm-barcode', '修改MES 条码清单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_barcode:update', 3, NOW(), NOW()),
('menu-mes-wm-barcode-delete', 'menu-mes-wm-barcode', '删除MES 条码清单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_barcode:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-wm-barcode-rm',        '1', 'menu-mes-wm-barcode'),
('menu-mes-wm-barcode-rm-query',  '1', 'menu-mes-wm-barcode-query'),
('menu-mes-wm-barcode-rm-create', '1', 'menu-mes-wm-barcode-create'),
('menu-mes-wm-barcode-rm-update', '1', 'menu-mes-wm-barcode-update'),
('menu-mes-wm-barcode-rm-delete', '1', 'menu-mes-wm-barcode-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-wm-barcode-pm',        '1', 'menu-mes-wm-barcode'),
('menu-mes-wm-barcode-pm-query',  '1', 'menu-mes-wm-barcode-query'),
('menu-mes-wm-barcode-pm-create', '1', 'menu-mes-wm-barcode-create'),
('menu-mes-wm-barcode-pm-update', '1', 'menu-mes-wm-barcode-update'),
('menu-mes-wm-barcode-pm-delete', '1', 'menu-mes-wm-barcode-delete')
ON CONFLICT DO NOTHING;
