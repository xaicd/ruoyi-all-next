-- ============================================================
-- Auto-generated RBAC & Menu Migration for ERP 采购订单 (ErpPurchaseOrder)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-erp-purchase-order',
  'erp-dir',
  'ERP 采购订单管理',
  '/admin/erp/erp-purchase-order',
  'erp/erp-purchase-order/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_purchase_order:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-erp-purchase-order-query',  'menu-erp-purchase-order', '查询ERP 采购订单', 'BUTTON', 'ACTIVE', 'erp:erp_purchase_order:query',  1, NOW(), NOW()),
('menu-erp-purchase-order-create', 'menu-erp-purchase-order', '新增ERP 采购订单', 'BUTTON', 'ACTIVE', 'erp:erp_purchase_order:create', 2, NOW(), NOW()),
('menu-erp-purchase-order-update', 'menu-erp-purchase-order', '修改ERP 采购订单', 'BUTTON', 'ACTIVE', 'erp:erp_purchase_order:update', 3, NOW(), NOW()),
('menu-erp-purchase-order-delete', 'menu-erp-purchase-order', '删除ERP 采购订单', 'BUTTON', 'ACTIVE', 'erp:erp_purchase_order:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-erp-purchase-order-rm',        '1', 'menu-erp-purchase-order'),
('menu-erp-purchase-order-rm-query',  '1', 'menu-erp-purchase-order-query'),
('menu-erp-purchase-order-rm-create', '1', 'menu-erp-purchase-order-create'),
('menu-erp-purchase-order-rm-update', '1', 'menu-erp-purchase-order-update'),
('menu-erp-purchase-order-rm-delete', '1', 'menu-erp-purchase-order-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-erp-purchase-order-pm',        '1', 'menu-erp-purchase-order'),
('menu-erp-purchase-order-pm-query',  '1', 'menu-erp-purchase-order-query'),
('menu-erp-purchase-order-pm-create', '1', 'menu-erp-purchase-order-create'),
('menu-erp-purchase-order-pm-update', '1', 'menu-erp-purchase-order-update'),
('menu-erp-purchase-order-pm-delete', '1', 'menu-erp-purchase-order-delete')
ON CONFLICT DO NOTHING;
