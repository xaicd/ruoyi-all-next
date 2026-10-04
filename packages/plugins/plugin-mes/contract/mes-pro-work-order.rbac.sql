-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 生产工单 (MesProWorkOrder)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-pro-work-order',
  'mes-dir',
  'MES 生产工单管理',
  '/admin/mes/mes-pro-work-order',
  'mes/mes-pro-work-order/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_pro_work_order:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-pro-work-order-query',  'menu-mes-pro-work-order', '查询MES 生产工单', 'BUTTON', 'ACTIVE', 'mes:mes_pro_work_order:query',  1, NOW(), NOW()),
('menu-mes-pro-work-order-create', 'menu-mes-pro-work-order', '新增MES 生产工单', 'BUTTON', 'ACTIVE', 'mes:mes_pro_work_order:create', 2, NOW(), NOW()),
('menu-mes-pro-work-order-update', 'menu-mes-pro-work-order', '修改MES 生产工单', 'BUTTON', 'ACTIVE', 'mes:mes_pro_work_order:update', 3, NOW(), NOW()),
('menu-mes-pro-work-order-delete', 'menu-mes-pro-work-order', '删除MES 生产工单', 'BUTTON', 'ACTIVE', 'mes:mes_pro_work_order:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-pro-work-order'),
('1', 'menu-mes-pro-work-order-query'),
('1', 'menu-mes-pro-work-order-create'),
('1', 'menu-mes-pro-work-order-update'),
('1', 'menu-mes-pro-work-order-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-pro-work-order'),
('1', 'menu-mes-pro-work-order-query'),
('1', 'menu-mes-pro-work-order-create'),
('1', 'menu-mes-pro-work-order-update'),
('1', 'menu-mes-pro-work-order-delete')
ON CONFLICT DO NOTHING;
