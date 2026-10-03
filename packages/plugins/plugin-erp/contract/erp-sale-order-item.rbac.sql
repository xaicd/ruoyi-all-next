-- ============================================================
-- Auto-generated RBAC & Menu Migration for ErpSaleOrderItem（源框架导入） (ErpSaleOrderItem)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-erp-sale-order-item',
  'erp-dir',
  'ErpSaleOrderItem（源框架导入）管理',
  '/admin/erp/erp-sale-order-item',
  'erp/erp-sale-order-item/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_sale_order_item:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-erp-sale-order-item-query',  'menu-erp-sale-order-item', '查询ErpSaleOrderItem（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_sale_order_item:query',  1, NOW(), NOW()),
('menu-erp-sale-order-item-create', 'menu-erp-sale-order-item', '新增ErpSaleOrderItem（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_sale_order_item:create', 2, NOW(), NOW()),
('menu-erp-sale-order-item-update', 'menu-erp-sale-order-item', '修改ErpSaleOrderItem（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_sale_order_item:update', 3, NOW(), NOW()),
('menu-erp-sale-order-item-delete', 'menu-erp-sale-order-item', '删除ErpSaleOrderItem（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_sale_order_item:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-erp-sale-order-item'),
('1', 'menu-erp-sale-order-item-query'),
('1', 'menu-erp-sale-order-item-create'),
('1', 'menu-erp-sale-order-item-update'),
('1', 'menu-erp-sale-order-item-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-erp-sale-order-item'),
('1', 'menu-erp-sale-order-item-query'),
('1', 'menu-erp-sale-order-item-create'),
('1', 'menu-erp-sale-order-item-update'),
('1', 'menu-erp-sale-order-item-delete')
ON CONFLICT DO NOTHING;
