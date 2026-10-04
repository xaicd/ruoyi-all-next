-- ============================================================
-- Auto-generated RBAC & Menu Migration for 售后订单，用于处理 交易订单的退款退货流程 (AfterSale)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-after-sale',
  'mall-dir',
  '售后订单，用于处理 交易订单的退款退货流程管理',
  '/admin/mall/after-sale',
  'mall/after-sale/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:after_sale:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-after-sale-query',  'menu-after-sale', '查询售后订单，用于处理 交易订单的退款退货流程', 'BUTTON', 'ACTIVE', 'mall:after_sale:query',  1, NOW(), NOW()),
('menu-after-sale-create', 'menu-after-sale', '新增售后订单，用于处理 交易订单的退款退货流程', 'BUTTON', 'ACTIVE', 'mall:after_sale:create', 2, NOW(), NOW()),
('menu-after-sale-update', 'menu-after-sale', '修改售后订单，用于处理 交易订单的退款退货流程', 'BUTTON', 'ACTIVE', 'mall:after_sale:update', 3, NOW(), NOW()),
('menu-after-sale-delete', 'menu-after-sale', '删除售后订单，用于处理 交易订单的退款退货流程', 'BUTTON', 'ACTIVE', 'mall:after_sale:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-after-sale'),
('1', 'menu-after-sale-query'),
('1', 'menu-after-sale-create'),
('1', 'menu-after-sale-update'),
('1', 'menu-after-sale-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-after-sale'),
('1', 'menu-after-sale-query'),
('1', 'menu-after-sale-create'),
('1', 'menu-after-sale-update'),
('1', 'menu-after-sale-delete')
ON CONFLICT DO NOTHING;
