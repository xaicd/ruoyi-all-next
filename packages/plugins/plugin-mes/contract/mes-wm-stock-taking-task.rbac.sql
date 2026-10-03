-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesWmStockTakingTask（源框架导入） (MesWmStockTakingTask)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-wm-stock-taking-task',
  'mes-dir',
  'MesWmStockTakingTask（源框架导入）管理',
  '/admin/mes/mes-wm-stock-taking-task',
  'mes/mes-wm-stock-taking-task/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_stock_taking_task:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-wm-stock-taking-task-query',  'menu-mes-wm-stock-taking-task', '查询MesWmStockTakingTask（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_stock_taking_task:query',  1, NOW(), NOW()),
('menu-mes-wm-stock-taking-task-create', 'menu-mes-wm-stock-taking-task', '新增MesWmStockTakingTask（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_stock_taking_task:create', 2, NOW(), NOW()),
('menu-mes-wm-stock-taking-task-update', 'menu-mes-wm-stock-taking-task', '修改MesWmStockTakingTask（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_stock_taking_task:update', 3, NOW(), NOW()),
('menu-mes-wm-stock-taking-task-delete', 'menu-mes-wm-stock-taking-task', '删除MesWmStockTakingTask（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_stock_taking_task:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-wm-stock-taking-task'),
('1', 'menu-mes-wm-stock-taking-task-query'),
('1', 'menu-mes-wm-stock-taking-task-create'),
('1', 'menu-mes-wm-stock-taking-task-update'),
('1', 'menu-mes-wm-stock-taking-task-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-wm-stock-taking-task'),
('1', 'menu-mes-wm-stock-taking-task-query'),
('1', 'menu-mes-wm-stock-taking-task-create'),
('1', 'menu-mes-wm-stock-taking-task-update'),
('1', 'menu-mes-wm-stock-taking-task-delete')
ON CONFLICT DO NOTHING;
