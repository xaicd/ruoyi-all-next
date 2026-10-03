-- ============================================================
-- Auto-generated RBAC & Menu Migration for PayNotifyLog（源框架导入） (PayNotifyLog)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-pay-notify-log',
  'pay-dir',
  'PayNotifyLog（源框架导入）管理',
  '/admin/pay/pay-notify-log',
  'pay/pay-notify-log/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'pay:pay_notify_log:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-pay-notify-log-query',  'menu-pay-notify-log', '查询PayNotifyLog（源框架导入）', 'BUTTON', 'ACTIVE', 'pay:pay_notify_log:query',  1, NOW(), NOW()),
('menu-pay-notify-log-create', 'menu-pay-notify-log', '新增PayNotifyLog（源框架导入）', 'BUTTON', 'ACTIVE', 'pay:pay_notify_log:create', 2, NOW(), NOW()),
('menu-pay-notify-log-update', 'menu-pay-notify-log', '修改PayNotifyLog（源框架导入）', 'BUTTON', 'ACTIVE', 'pay:pay_notify_log:update', 3, NOW(), NOW()),
('menu-pay-notify-log-delete', 'menu-pay-notify-log', '删除PayNotifyLog（源框架导入）', 'BUTTON', 'ACTIVE', 'pay:pay_notify_log:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-pay-notify-log'),
('1', 'menu-pay-notify-log-query'),
('1', 'menu-pay-notify-log-create'),
('1', 'menu-pay-notify-log-update'),
('1', 'menu-pay-notify-log-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-pay-notify-log'),
('1', 'menu-pay-notify-log-query'),
('1', 'menu-pay-notify-log-create'),
('1', 'menu-pay-notify-log-update'),
('1', 'menu-pay-notify-log-delete')
ON CONFLICT DO NOTHING;
