-- ============================================================
-- Auto-generated RBAC & Menu Migration for ERP 销售出库项 (ErpSaleOutItem)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-erp-sale-out-item',
  'erp-dir',
  'ERP 销售出库项管理',
  '/admin/erp/erp-sale-out-item',
  'erp/erp-sale-out-item/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_sale_out_item:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-erp-sale-out-item-query',  'menu-erp-sale-out-item', '查询ERP 销售出库项', 'BUTTON', 'ACTIVE', 'erp:erp_sale_out_item:query',  1, NOW(), NOW()),
('menu-erp-sale-out-item-create', 'menu-erp-sale-out-item', '新增ERP 销售出库项', 'BUTTON', 'ACTIVE', 'erp:erp_sale_out_item:create', 2, NOW(), NOW()),
('menu-erp-sale-out-item-update', 'menu-erp-sale-out-item', '修改ERP 销售出库项', 'BUTTON', 'ACTIVE', 'erp:erp_sale_out_item:update', 3, NOW(), NOW()),
('menu-erp-sale-out-item-delete', 'menu-erp-sale-out-item', '删除ERP 销售出库项', 'BUTTON', 'ACTIVE', 'erp:erp_sale_out_item:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-erp-sale-out-item-rm',        '1', 'menu-erp-sale-out-item'),
('menu-erp-sale-out-item-rm-query',  '1', 'menu-erp-sale-out-item-query'),
('menu-erp-sale-out-item-rm-create', '1', 'menu-erp-sale-out-item-create'),
('menu-erp-sale-out-item-rm-update', '1', 'menu-erp-sale-out-item-update'),
('menu-erp-sale-out-item-rm-delete', '1', 'menu-erp-sale-out-item-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-erp-sale-out-item-pm',        '1', 'menu-erp-sale-out-item'),
('menu-erp-sale-out-item-pm-query',  '1', 'menu-erp-sale-out-item-query'),
('menu-erp-sale-out-item-pm-create', '1', 'menu-erp-sale-out-item-create'),
('menu-erp-sale-out-item-pm-update', '1', 'menu-erp-sale-out-item-update'),
('menu-erp-sale-out-item-pm-delete', '1', 'menu-erp-sale-out-item-delete')
ON CONFLICT DO NOTHING;
