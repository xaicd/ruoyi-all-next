-- ============================================================
-- Auto-generated RBAC & Menu Migration for ErpSupplier（源框架导入） (ErpSupplier)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-erp-supplier',
  'erp-dir',
  'ErpSupplier（源框架导入）管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-erp-supplier-query',  'menu-erp-supplier', '查询ErpSupplier（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_supplier:query',  1, NOW(), NOW()),
('menu-erp-supplier-create', 'menu-erp-supplier', '新增ErpSupplier（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_supplier:create', 2, NOW(), NOW()),
('menu-erp-supplier-update', 'menu-erp-supplier', '修改ErpSupplier（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_supplier:update', 3, NOW(), NOW()),
('menu-erp-supplier-delete', 'menu-erp-supplier', '删除ErpSupplier（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_supplier:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-erp-supplier'),
('1', 'menu-erp-supplier-query'),
('1', 'menu-erp-supplier-create'),
('1', 'menu-erp-supplier-update'),
('1', 'menu-erp-supplier-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-erp-supplier'),
('1', 'menu-erp-supplier-query'),
('1', 'menu-erp-supplier-create'),
('1', 'menu-erp-supplier-update'),
('1', 'menu-erp-supplier-delete')
ON CONFLICT DO NOTHING;
