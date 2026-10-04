-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 盘点方案参数 (MesWmStockTakingPlanParam)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-wm-stock-taking-plan-param',
  'mes-dir',
  'MES 盘点方案参数管理',
  '/admin/mes/mes-wm-stock-taking-plan-param',
  'mes/mes-wm-stock-taking-plan-param/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_stock_taking_plan_param:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-wm-stock-taking-plan-param-query',  'menu-mes-wm-stock-taking-plan-param', '查询MES 盘点方案参数', 'BUTTON', 'ACTIVE', 'mes:mes_wm_stock_taking_plan_param:query',  1, NOW(), NOW()),
('menu-mes-wm-stock-taking-plan-param-create', 'menu-mes-wm-stock-taking-plan-param', '新增MES 盘点方案参数', 'BUTTON', 'ACTIVE', 'mes:mes_wm_stock_taking_plan_param:create', 2, NOW(), NOW()),
('menu-mes-wm-stock-taking-plan-param-update', 'menu-mes-wm-stock-taking-plan-param', '修改MES 盘点方案参数', 'BUTTON', 'ACTIVE', 'mes:mes_wm_stock_taking_plan_param:update', 3, NOW(), NOW()),
('menu-mes-wm-stock-taking-plan-param-delete', 'menu-mes-wm-stock-taking-plan-param', '删除MES 盘点方案参数', 'BUTTON', 'ACTIVE', 'mes:mes_wm_stock_taking_plan_param:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-wm-stock-taking-plan-param-rm',        '1', 'menu-mes-wm-stock-taking-plan-param'),
('menu-mes-wm-stock-taking-plan-param-rm-query',  '1', 'menu-mes-wm-stock-taking-plan-param-query'),
('menu-mes-wm-stock-taking-plan-param-rm-create', '1', 'menu-mes-wm-stock-taking-plan-param-create'),
('menu-mes-wm-stock-taking-plan-param-rm-update', '1', 'menu-mes-wm-stock-taking-plan-param-update'),
('menu-mes-wm-stock-taking-plan-param-rm-delete', '1', 'menu-mes-wm-stock-taking-plan-param-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-wm-stock-taking-plan-param-pm',        '1', 'menu-mes-wm-stock-taking-plan-param'),
('menu-mes-wm-stock-taking-plan-param-pm-query',  '1', 'menu-mes-wm-stock-taking-plan-param-query'),
('menu-mes-wm-stock-taking-plan-param-pm-create', '1', 'menu-mes-wm-stock-taking-plan-param-create'),
('menu-mes-wm-stock-taking-plan-param-pm-update', '1', 'menu-mes-wm-stock-taking-plan-param-update'),
('menu-mes-wm-stock-taking-plan-param-pm-delete', '1', 'menu-mes-wm-stock-taking-plan-param-delete')
ON CONFLICT DO NOTHING;
