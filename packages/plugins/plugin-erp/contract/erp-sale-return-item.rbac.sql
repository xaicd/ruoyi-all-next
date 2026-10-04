-- ============================================================
-- Auto-generated RBAC & Menu Migration for ERP 销售退货项 (ErpSaleReturnItem)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-erp-sale-return-item',
  'erp-dir',
  'ERP 销售退货项管理',
  '/admin/erp/erp-sale-return-item',
  'erp/erp-sale-return-item/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_sale_return_item:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-erp-sale-return-item-query',  'menu-erp-sale-return-item', '查询ERP 销售退货项', 'BUTTON', 'ACTIVE', 'erp:erp_sale_return_item:query',  1, NOW(), NOW()),
('menu-erp-sale-return-item-create', 'menu-erp-sale-return-item', '新增ERP 销售退货项', 'BUTTON', 'ACTIVE', 'erp:erp_sale_return_item:create', 2, NOW(), NOW()),
('menu-erp-sale-return-item-update', 'menu-erp-sale-return-item', '修改ERP 销售退货项', 'BUTTON', 'ACTIVE', 'erp:erp_sale_return_item:update', 3, NOW(), NOW()),
('menu-erp-sale-return-item-delete', 'menu-erp-sale-return-item', '删除ERP 销售退货项', 'BUTTON', 'ACTIVE', 'erp:erp_sale_return_item:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-erp-sale-return-item'),
('1', 'menu-erp-sale-return-item-query'),
('1', 'menu-erp-sale-return-item-create'),
('1', 'menu-erp-sale-return-item-update'),
('1', 'menu-erp-sale-return-item-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-erp-sale-return-item'),
('1', 'menu-erp-sale-return-item-query'),
('1', 'menu-erp-sale-return-item-create'),
('1', 'menu-erp-sale-return-item-update'),
('1', 'menu-erp-sale-return-item-delete')
ON CONFLICT DO NOTHING;
