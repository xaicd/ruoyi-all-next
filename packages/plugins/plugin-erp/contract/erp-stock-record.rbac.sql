-- ============================================================
-- Auto-generated RBAC & Menu Migration for ERP 产品库存明细 (ErpStockRecord)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-erp-stock-record',
  'erp-dir',
  'ERP 产品库存明细管理',
  '/admin/erp/erp-stock-record',
  'erp/erp-stock-record/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_stock_record:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-erp-stock-record-query',  'menu-erp-stock-record', '查询ERP 产品库存明细', 'BUTTON', 'ACTIVE', 'erp:erp_stock_record:query',  1, NOW(), NOW()),
('menu-erp-stock-record-create', 'menu-erp-stock-record', '新增ERP 产品库存明细', 'BUTTON', 'ACTIVE', 'erp:erp_stock_record:create', 2, NOW(), NOW()),
('menu-erp-stock-record-update', 'menu-erp-stock-record', '修改ERP 产品库存明细', 'BUTTON', 'ACTIVE', 'erp:erp_stock_record:update', 3, NOW(), NOW()),
('menu-erp-stock-record-delete', 'menu-erp-stock-record', '删除ERP 产品库存明细', 'BUTTON', 'ACTIVE', 'erp:erp_stock_record:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-erp-stock-record'),
('1', 'menu-erp-stock-record-query'),
('1', 'menu-erp-stock-record-create'),
('1', 'menu-erp-stock-record-update'),
('1', 'menu-erp-stock-record-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-erp-stock-record'),
('1', 'menu-erp-stock-record-query'),
('1', 'menu-erp-stock-record-create'),
('1', 'menu-erp-stock-record-update'),
('1', 'menu-erp-stock-record-delete')
ON CONFLICT DO NOTHING;
