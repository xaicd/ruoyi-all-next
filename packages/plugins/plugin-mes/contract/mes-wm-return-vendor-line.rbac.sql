-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 供应商退货单行 (MesWmReturnVendorLine)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-wm-return-vendor-line',
  'mes-dir',
  'MES 供应商退货单行管理',
  '/admin/mes/mes-wm-return-vendor-line',
  'mes/mes-wm-return-vendor-line/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_return_vendor_line:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-wm-return-vendor-line-query',  'menu-mes-wm-return-vendor-line', '查询MES 供应商退货单行', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_vendor_line:query',  1, NOW(), NOW()),
('menu-mes-wm-return-vendor-line-create', 'menu-mes-wm-return-vendor-line', '新增MES 供应商退货单行', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_vendor_line:create', 2, NOW(), NOW()),
('menu-mes-wm-return-vendor-line-update', 'menu-mes-wm-return-vendor-line', '修改MES 供应商退货单行', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_vendor_line:update', 3, NOW(), NOW()),
('menu-mes-wm-return-vendor-line-delete', 'menu-mes-wm-return-vendor-line', '删除MES 供应商退货单行', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_vendor_line:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-wm-return-vendor-line-rm',        '1', 'menu-mes-wm-return-vendor-line'),
('menu-mes-wm-return-vendor-line-rm-query',  '1', 'menu-mes-wm-return-vendor-line-query'),
('menu-mes-wm-return-vendor-line-rm-create', '1', 'menu-mes-wm-return-vendor-line-create'),
('menu-mes-wm-return-vendor-line-rm-update', '1', 'menu-mes-wm-return-vendor-line-update'),
('menu-mes-wm-return-vendor-line-rm-delete', '1', 'menu-mes-wm-return-vendor-line-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-wm-return-vendor-line-pm',        '1', 'menu-mes-wm-return-vendor-line'),
('menu-mes-wm-return-vendor-line-pm-query',  '1', 'menu-mes-wm-return-vendor-line-query'),
('menu-mes-wm-return-vendor-line-pm-create', '1', 'menu-mes-wm-return-vendor-line-create'),
('menu-mes-wm-return-vendor-line-pm-update', '1', 'menu-mes-wm-return-vendor-line-update'),
('menu-mes-wm-return-vendor-line-pm-delete', '1', 'menu-mes-wm-return-vendor-line-delete')
ON CONFLICT DO NOTHING;
