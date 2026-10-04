-- ============================================================
-- Auto-generated RBAC & Menu Migration for ERP 销售订单 (ErpSaleOrder)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-erp-sale-order',
  'erp-dir',
  'ERP 销售订单管理',
  '/admin/erp/erp-sale-order',
  'erp/erp-sale-order/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_sale_order:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-erp-sale-order-query',  'menu-erp-sale-order', '查询ERP 销售订单', 'BUTTON', 'ACTIVE', 'erp:erp_sale_order:query',  1, NOW(), NOW()),
('menu-erp-sale-order-create', 'menu-erp-sale-order', '新增ERP 销售订单', 'BUTTON', 'ACTIVE', 'erp:erp_sale_order:create', 2, NOW(), NOW()),
('menu-erp-sale-order-update', 'menu-erp-sale-order', '修改ERP 销售订单', 'BUTTON', 'ACTIVE', 'erp:erp_sale_order:update', 3, NOW(), NOW()),
('menu-erp-sale-order-delete', 'menu-erp-sale-order', '删除ERP 销售订单', 'BUTTON', 'ACTIVE', 'erp:erp_sale_order:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-erp-sale-order'),
('1', 'menu-erp-sale-order-query'),
('1', 'menu-erp-sale-order-create'),
('1', 'menu-erp-sale-order-update'),
('1', 'menu-erp-sale-order-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-erp-sale-order'),
('1', 'menu-erp-sale-order-query'),
('1', 'menu-erp-sale-order-create'),
('1', 'menu-erp-sale-order-update'),
('1', 'menu-erp-sale-order-delete')
ON CONFLICT DO NOTHING;
