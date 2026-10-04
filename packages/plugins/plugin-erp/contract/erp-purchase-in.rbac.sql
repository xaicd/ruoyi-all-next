-- ============================================================
-- Auto-generated RBAC & Menu Migration for ERP 采购入库 (ErpPurchaseIn)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-erp-purchase-in',
  'erp-dir',
  'ERP 采购入库管理',
  '/admin/erp/erp-purchase-in',
  'erp/erp-purchase-in/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_purchase_in:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-erp-purchase-in-query',  'menu-erp-purchase-in', '查询ERP 采购入库', 'BUTTON', 'ACTIVE', 'erp:erp_purchase_in:query',  1, NOW(), NOW()),
('menu-erp-purchase-in-create', 'menu-erp-purchase-in', '新增ERP 采购入库', 'BUTTON', 'ACTIVE', 'erp:erp_purchase_in:create', 2, NOW(), NOW()),
('menu-erp-purchase-in-update', 'menu-erp-purchase-in', '修改ERP 采购入库', 'BUTTON', 'ACTIVE', 'erp:erp_purchase_in:update', 3, NOW(), NOW()),
('menu-erp-purchase-in-delete', 'menu-erp-purchase-in', '删除ERP 采购入库', 'BUTTON', 'ACTIVE', 'erp:erp_purchase_in:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-erp-purchase-in'),
('1', 'menu-erp-purchase-in-query'),
('1', 'menu-erp-purchase-in-create'),
('1', 'menu-erp-purchase-in-update'),
('1', 'menu-erp-purchase-in-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-erp-purchase-in'),
('1', 'menu-erp-purchase-in-query'),
('1', 'menu-erp-purchase-in-create'),
('1', 'menu-erp-purchase-in-update'),
('1', 'menu-erp-purchase-in-delete')
ON CONFLICT DO NOTHING;
