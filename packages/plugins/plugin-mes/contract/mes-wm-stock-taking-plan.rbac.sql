-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 盘点方案 (MesWmStockTakingPlan)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-wm-stock-taking-plan',
  'mes-dir',
  'MES 盘点方案管理',
  '/admin/mes/mes-wm-stock-taking-plan',
  'mes/mes-wm-stock-taking-plan/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_stock_taking_plan:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-wm-stock-taking-plan-query',  'menu-mes-wm-stock-taking-plan', '查询MES 盘点方案', 'BUTTON', 'ACTIVE', 'mes:mes_wm_stock_taking_plan:query',  1, NOW(), NOW()),
('menu-mes-wm-stock-taking-plan-create', 'menu-mes-wm-stock-taking-plan', '新增MES 盘点方案', 'BUTTON', 'ACTIVE', 'mes:mes_wm_stock_taking_plan:create', 2, NOW(), NOW()),
('menu-mes-wm-stock-taking-plan-update', 'menu-mes-wm-stock-taking-plan', '修改MES 盘点方案', 'BUTTON', 'ACTIVE', 'mes:mes_wm_stock_taking_plan:update', 3, NOW(), NOW()),
('menu-mes-wm-stock-taking-plan-delete', 'menu-mes-wm-stock-taking-plan', '删除MES 盘点方案', 'BUTTON', 'ACTIVE', 'mes:mes_wm_stock_taking_plan:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-wm-stock-taking-plan-rm',        '1', 'menu-mes-wm-stock-taking-plan'),
('menu-mes-wm-stock-taking-plan-rm-query',  '1', 'menu-mes-wm-stock-taking-plan-query'),
('menu-mes-wm-stock-taking-plan-rm-create', '1', 'menu-mes-wm-stock-taking-plan-create'),
('menu-mes-wm-stock-taking-plan-rm-update', '1', 'menu-mes-wm-stock-taking-plan-update'),
('menu-mes-wm-stock-taking-plan-rm-delete', '1', 'menu-mes-wm-stock-taking-plan-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-wm-stock-taking-plan-pm',        '1', 'menu-mes-wm-stock-taking-plan'),
('menu-mes-wm-stock-taking-plan-pm-query',  '1', 'menu-mes-wm-stock-taking-plan-query'),
('menu-mes-wm-stock-taking-plan-pm-create', '1', 'menu-mes-wm-stock-taking-plan-create'),
('menu-mes-wm-stock-taking-plan-pm-update', '1', 'menu-mes-wm-stock-taking-plan-update'),
('menu-mes-wm-stock-taking-plan-pm-delete', '1', 'menu-mes-wm-stock-taking-plan-delete')
ON CONFLICT DO NOTHING;
