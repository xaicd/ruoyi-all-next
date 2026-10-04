-- ============================================================
-- Auto-generated RBAC & Menu Migration for 支付通知在支付系统收到支付渠道的支付、退款的结果后，需要不断的通知到业务系统，直 (PayNotifyTask)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-pay-notify-task',
  'pay-dir',
  '支付通知在支付系统收到支付渠道的支付、退款的结果后，需要不断的通知到业务系统，直管理',
  '/admin/pay/pay-notify-task',
  'pay/pay-notify-task/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'pay:pay_notify_task:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-pay-notify-task-query',  'menu-pay-notify-task', '查询支付通知在支付系统收到支付渠道的支付、退款的结果后，需要不断的通知到业务系统，直', 'BUTTON', 'ACTIVE', 'pay:pay_notify_task:query',  1, NOW(), NOW()),
('menu-pay-notify-task-create', 'menu-pay-notify-task', '新增支付通知在支付系统收到支付渠道的支付、退款的结果后，需要不断的通知到业务系统，直', 'BUTTON', 'ACTIVE', 'pay:pay_notify_task:create', 2, NOW(), NOW()),
('menu-pay-notify-task-update', 'menu-pay-notify-task', '修改支付通知在支付系统收到支付渠道的支付、退款的结果后，需要不断的通知到业务系统，直', 'BUTTON', 'ACTIVE', 'pay:pay_notify_task:update', 3, NOW(), NOW()),
('menu-pay-notify-task-delete', 'menu-pay-notify-task', '删除支付通知在支付系统收到支付渠道的支付、退款的结果后，需要不断的通知到业务系统，直', 'BUTTON', 'ACTIVE', 'pay:pay_notify_task:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-pay-notify-task-rm',        '1', 'menu-pay-notify-task'),
('menu-pay-notify-task-rm-query',  '1', 'menu-pay-notify-task-query'),
('menu-pay-notify-task-rm-create', '1', 'menu-pay-notify-task-create'),
('menu-pay-notify-task-rm-update', '1', 'menu-pay-notify-task-update'),
('menu-pay-notify-task-rm-delete', '1', 'menu-pay-notify-task-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-pay-notify-task-pm',        '1', 'menu-pay-notify-task'),
('menu-pay-notify-task-pm-query',  '1', 'menu-pay-notify-task-query'),
('menu-pay-notify-task-pm-create', '1', 'menu-pay-notify-task-create'),
('menu-pay-notify-task-pm-update', '1', 'menu-pay-notify-task-update'),
('menu-pay-notify-task-pm-delete', '1', 'menu-pay-notify-task-delete')
ON CONFLICT DO NOTHING;
