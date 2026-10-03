-- ============================================================
-- Auto-generated RBAC & Menu Migration for PayOrder（源框架导入） (PayOrder)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-pay-order',
  'pay-dir',
  'PayOrder（源框架导入）管理',
  '/admin/pay/pay-order',
  'pay/pay-order/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'pay:pay_order:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-pay-order-query',  'menu-pay-order', '查询PayOrder（源框架导入）', 'BUTTON', 'ACTIVE', 'pay:pay_order:query',  1, NOW(), NOW()),
('menu-pay-order-create', 'menu-pay-order', '新增PayOrder（源框架导入）', 'BUTTON', 'ACTIVE', 'pay:pay_order:create', 2, NOW(), NOW()),
('menu-pay-order-update', 'menu-pay-order', '修改PayOrder（源框架导入）', 'BUTTON', 'ACTIVE', 'pay:pay_order:update', 3, NOW(), NOW()),
('menu-pay-order-delete', 'menu-pay-order', '删除PayOrder（源框架导入）', 'BUTTON', 'ACTIVE', 'pay:pay_order:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-pay-order'),
('1', 'menu-pay-order-query'),
('1', 'menu-pay-order-create'),
('1', 'menu-pay-order-update'),
('1', 'menu-pay-order-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-pay-order'),
('1', 'menu-pay-order-query'),
('1', 'menu-pay-order-create'),
('1', 'menu-pay-order-update'),
('1', 'menu-pay-order-delete')
ON CONFLICT DO NOTHING;
