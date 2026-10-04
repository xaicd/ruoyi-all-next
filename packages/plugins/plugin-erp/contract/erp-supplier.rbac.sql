-- ============================================================
-- Auto-generated RBAC & Menu Migration for ERP 供应商 (ErpSupplier)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-erp-supplier',
  'erp-dir',
  'ERP 供应商管理',
  '/admin/erp/erp-supplier',
  'erp/erp-supplier/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_supplier:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-erp-supplier-query',  'menu-erp-supplier', '查询ERP 供应商', 'BUTTON', 'ACTIVE', 'erp:erp_supplier:query',  1, NOW(), NOW()),
('menu-erp-supplier-create', 'menu-erp-supplier', '新增ERP 供应商', 'BUTTON', 'ACTIVE', 'erp:erp_supplier:create', 2, NOW(), NOW()),
('menu-erp-supplier-update', 'menu-erp-supplier', '修改ERP 供应商', 'BUTTON', 'ACTIVE', 'erp:erp_supplier:update', 3, NOW(), NOW()),
('menu-erp-supplier-delete', 'menu-erp-supplier', '删除ERP 供应商', 'BUTTON', 'ACTIVE', 'erp:erp_supplier:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-erp-supplier-rm',        '1', 'menu-erp-supplier'),
('menu-erp-supplier-rm-query',  '1', 'menu-erp-supplier-query'),
('menu-erp-supplier-rm-create', '1', 'menu-erp-supplier-create'),
('menu-erp-supplier-rm-update', '1', 'menu-erp-supplier-update'),
('menu-erp-supplier-rm-delete', '1', 'menu-erp-supplier-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-erp-supplier-pm',        '1', 'menu-erp-supplier'),
('menu-erp-supplier-pm-query',  '1', 'menu-erp-supplier-query'),
('menu-erp-supplier-pm-create', '1', 'menu-erp-supplier-create'),
('menu-erp-supplier-pm-update', '1', 'menu-erp-supplier-update'),
('menu-erp-supplier-pm-delete', '1', 'menu-erp-supplier-delete')
ON CONFLICT DO NOTHING;
