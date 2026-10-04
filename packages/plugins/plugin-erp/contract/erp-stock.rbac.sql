-- ============================================================
-- Auto-generated RBAC & Menu Migration for ERP 产品库存 (ErpStock)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-erp-stock',
  'erp-dir',
  'ERP 产品库存管理',
  '/admin/erp/erp-stock',
  'erp/erp-stock/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_stock:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-erp-stock-query',  'menu-erp-stock', '查询ERP 产品库存', 'BUTTON', 'ACTIVE', 'erp:erp_stock:query',  1, NOW(), NOW()),
('menu-erp-stock-create', 'menu-erp-stock', '新增ERP 产品库存', 'BUTTON', 'ACTIVE', 'erp:erp_stock:create', 2, NOW(), NOW()),
('menu-erp-stock-update', 'menu-erp-stock', '修改ERP 产品库存', 'BUTTON', 'ACTIVE', 'erp:erp_stock:update', 3, NOW(), NOW()),
('menu-erp-stock-delete', 'menu-erp-stock', '删除ERP 产品库存', 'BUTTON', 'ACTIVE', 'erp:erp_stock:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-erp-stock-rm',        '1', 'menu-erp-stock'),
('menu-erp-stock-rm-query',  '1', 'menu-erp-stock-query'),
('menu-erp-stock-rm-create', '1', 'menu-erp-stock-create'),
('menu-erp-stock-rm-update', '1', 'menu-erp-stock-update'),
('menu-erp-stock-rm-delete', '1', 'menu-erp-stock-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-erp-stock-pm',        '1', 'menu-erp-stock'),
('menu-erp-stock-pm-query',  '1', 'menu-erp-stock-query'),
('menu-erp-stock-pm-create', '1', 'menu-erp-stock-create'),
('menu-erp-stock-pm-update', '1', 'menu-erp-stock-update'),
('menu-erp-stock-pm-delete', '1', 'menu-erp-stock-delete')
ON CONFLICT DO NOTHING;
