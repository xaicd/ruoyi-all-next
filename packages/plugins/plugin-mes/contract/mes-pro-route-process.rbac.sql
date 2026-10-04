-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 工艺路线工序 (MesProRouteProcess)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-pro-route-process',
  'mes-dir',
  'MES 工艺路线工序管理',
  '/admin/mes/mes-pro-route-process',
  'mes/mes-pro-route-process/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_pro_route_process:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-pro-route-process-query',  'menu-mes-pro-route-process', '查询MES 工艺路线工序', 'BUTTON', 'ACTIVE', 'mes:mes_pro_route_process:query',  1, NOW(), NOW()),
('menu-mes-pro-route-process-create', 'menu-mes-pro-route-process', '新增MES 工艺路线工序', 'BUTTON', 'ACTIVE', 'mes:mes_pro_route_process:create', 2, NOW(), NOW()),
('menu-mes-pro-route-process-update', 'menu-mes-pro-route-process', '修改MES 工艺路线工序', 'BUTTON', 'ACTIVE', 'mes:mes_pro_route_process:update', 3, NOW(), NOW()),
('menu-mes-pro-route-process-delete', 'menu-mes-pro-route-process', '删除MES 工艺路线工序', 'BUTTON', 'ACTIVE', 'mes:mes_pro_route_process:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-pro-route-process-rm',        '1', 'menu-mes-pro-route-process'),
('menu-mes-pro-route-process-rm-query',  '1', 'menu-mes-pro-route-process-query'),
('menu-mes-pro-route-process-rm-create', '1', 'menu-mes-pro-route-process-create'),
('menu-mes-pro-route-process-rm-update', '1', 'menu-mes-pro-route-process-update'),
('menu-mes-pro-route-process-rm-delete', '1', 'menu-mes-pro-route-process-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-pro-route-process-pm',        '1', 'menu-mes-pro-route-process'),
('menu-mes-pro-route-process-pm-query',  '1', 'menu-mes-pro-route-process-query'),
('menu-mes-pro-route-process-pm-create', '1', 'menu-mes-pro-route-process-create'),
('menu-mes-pro-route-process-pm-update', '1', 'menu-mes-pro-route-process-update'),
('menu-mes-pro-route-process-pm-delete', '1', 'menu-mes-pro-route-process-delete')
ON CONFLICT DO NOTHING;
