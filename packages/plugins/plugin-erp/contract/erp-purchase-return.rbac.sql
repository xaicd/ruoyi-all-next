-- ============================================================
-- Auto-generated RBAC & Menu Migration for ERP 采购退货 (ErpPurchaseReturn)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-erp-purchase-return',
  'erp-dir',
  'ERP 采购退货管理',
  '/admin/erp/erp-purchase-return',
  'erp/erp-purchase-return/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_purchase_return:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-erp-purchase-return-query',  'menu-erp-purchase-return', '查询ERP 采购退货', 'BUTTON', 'ACTIVE', 'erp:erp_purchase_return:query',  1, NOW(), NOW()),
('menu-erp-purchase-return-create', 'menu-erp-purchase-return', '新增ERP 采购退货', 'BUTTON', 'ACTIVE', 'erp:erp_purchase_return:create', 2, NOW(), NOW()),
('menu-erp-purchase-return-update', 'menu-erp-purchase-return', '修改ERP 采购退货', 'BUTTON', 'ACTIVE', 'erp:erp_purchase_return:update', 3, NOW(), NOW()),
('menu-erp-purchase-return-delete', 'menu-erp-purchase-return', '删除ERP 采购退货', 'BUTTON', 'ACTIVE', 'erp:erp_purchase_return:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-erp-purchase-return-rm',        '1', 'menu-erp-purchase-return'),
('menu-erp-purchase-return-rm-query',  '1', 'menu-erp-purchase-return-query'),
('menu-erp-purchase-return-rm-create', '1', 'menu-erp-purchase-return-create'),
('menu-erp-purchase-return-rm-update', '1', 'menu-erp-purchase-return-update'),
('menu-erp-purchase-return-rm-delete', '1', 'menu-erp-purchase-return-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-erp-purchase-return-pm',        '1', 'menu-erp-purchase-return'),
('menu-erp-purchase-return-pm-query',  '1', 'menu-erp-purchase-return-query'),
('menu-erp-purchase-return-pm-create', '1', 'menu-erp-purchase-return-create'),
('menu-erp-purchase-return-pm-update', '1', 'menu-erp-purchase-return-update'),
('menu-erp-purchase-return-pm-delete', '1', 'menu-erp-purchase-return-delete')
ON CONFLICT DO NOTHING;
