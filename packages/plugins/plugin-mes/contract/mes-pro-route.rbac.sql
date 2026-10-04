-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 工艺路线 (MesProRoute)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-pro-route',
  'mes-dir',
  'MES 工艺路线管理',
  '/admin/mes/mes-pro-route',
  'mes/mes-pro-route/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_pro_route:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-pro-route-query',  'menu-mes-pro-route', '查询MES 工艺路线', 'BUTTON', 'ACTIVE', 'mes:mes_pro_route:query',  1, NOW(), NOW()),
('menu-mes-pro-route-create', 'menu-mes-pro-route', '新增MES 工艺路线', 'BUTTON', 'ACTIVE', 'mes:mes_pro_route:create', 2, NOW(), NOW()),
('menu-mes-pro-route-update', 'menu-mes-pro-route', '修改MES 工艺路线', 'BUTTON', 'ACTIVE', 'mes:mes_pro_route:update', 3, NOW(), NOW()),
('menu-mes-pro-route-delete', 'menu-mes-pro-route', '删除MES 工艺路线', 'BUTTON', 'ACTIVE', 'mes:mes_pro_route:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-pro-route'),
('1', 'menu-mes-pro-route-query'),
('1', 'menu-mes-pro-route-create'),
('1', 'menu-mes-pro-route-update'),
('1', 'menu-mes-pro-route-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-pro-route'),
('1', 'menu-mes-pro-route-query'),
('1', 'menu-mes-pro-route-create'),
('1', 'menu-mes-pro-route-update'),
('1', 'menu-mes-pro-route-delete')
ON CONFLICT DO NOTHING;
