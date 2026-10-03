-- ============================================================
-- Auto-generated RBAC & Menu Migration for PayOrderExtension（源框架导入） (PayOrderExtension)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-pay-order-extension',
  'pay-dir',
  'PayOrderExtension（源框架导入）管理',
  '/admin/pay/pay-order-extension',
  'pay/pay-order-extension/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'pay:pay_order_extension:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-pay-order-extension-query',  'menu-pay-order-extension', '查询PayOrderExtension（源框架导入）', 'BUTTON', 'ACTIVE', 'pay:pay_order_extension:query',  1, NOW(), NOW()),
('menu-pay-order-extension-create', 'menu-pay-order-extension', '新增PayOrderExtension（源框架导入）', 'BUTTON', 'ACTIVE', 'pay:pay_order_extension:create', 2, NOW(), NOW()),
('menu-pay-order-extension-update', 'menu-pay-order-extension', '修改PayOrderExtension（源框架导入）', 'BUTTON', 'ACTIVE', 'pay:pay_order_extension:update', 3, NOW(), NOW()),
('menu-pay-order-extension-delete', 'menu-pay-order-extension', '删除PayOrderExtension（源框架导入）', 'BUTTON', 'ACTIVE', 'pay:pay_order_extension:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-pay-order-extension'),
('1', 'menu-pay-order-extension-query'),
('1', 'menu-pay-order-extension-create'),
('1', 'menu-pay-order-extension-update'),
('1', 'menu-pay-order-extension-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-pay-order-extension'),
('1', 'menu-pay-order-extension-query'),
('1', 'menu-pay-order-extension-create'),
('1', 'menu-pay-order-extension-update'),
('1', 'menu-pay-order-extension-delete')
ON CONFLICT DO NOTHING;
