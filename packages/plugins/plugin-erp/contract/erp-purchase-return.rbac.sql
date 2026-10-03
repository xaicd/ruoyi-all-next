-- ============================================================
-- Auto-generated RBAC & Menu Migration for ErpPurchaseReturn（源框架导入） (ErpPurchaseReturn)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-erp-purchase-return',
  'erp-dir',
  'ErpPurchaseReturn（源框架导入）管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-erp-purchase-return-query',  'menu-erp-purchase-return', '查询ErpPurchaseReturn（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_purchase_return:query',  1, NOW(), NOW()),
('menu-erp-purchase-return-create', 'menu-erp-purchase-return', '新增ErpPurchaseReturn（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_purchase_return:create', 2, NOW(), NOW()),
('menu-erp-purchase-return-update', 'menu-erp-purchase-return', '修改ErpPurchaseReturn（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_purchase_return:update', 3, NOW(), NOW()),
('menu-erp-purchase-return-delete', 'menu-erp-purchase-return', '删除ErpPurchaseReturn（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_purchase_return:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-erp-purchase-return'),
('1', 'menu-erp-purchase-return-query'),
('1', 'menu-erp-purchase-return-create'),
('1', 'menu-erp-purchase-return-update'),
('1', 'menu-erp-purchase-return-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-erp-purchase-return'),
('1', 'menu-erp-purchase-return-query'),
('1', 'menu-erp-purchase-return-create'),
('1', 'menu-erp-purchase-return-update'),
('1', 'menu-erp-purchase-return-delete')
ON CONFLICT DO NOTHING;
