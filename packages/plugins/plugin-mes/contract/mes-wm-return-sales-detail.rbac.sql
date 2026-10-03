-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesWmReturnSalesDetail（源框架导入） (MesWmReturnSalesDetail)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-wm-return-sales-detail',
  'mes-dir',
  'MesWmReturnSalesDetail（源框架导入）管理',
  '/admin/mes/mes-wm-return-sales-detail',
  'mes/mes-wm-return-sales-detail/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_return_sales_detail:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-wm-return-sales-detail-query',  'menu-mes-wm-return-sales-detail', '查询MesWmReturnSalesDetail（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_sales_detail:query',  1, NOW(), NOW()),
('menu-mes-wm-return-sales-detail-create', 'menu-mes-wm-return-sales-detail', '新增MesWmReturnSalesDetail（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_sales_detail:create', 2, NOW(), NOW()),
('menu-mes-wm-return-sales-detail-update', 'menu-mes-wm-return-sales-detail', '修改MesWmReturnSalesDetail（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_sales_detail:update', 3, NOW(), NOW()),
('menu-mes-wm-return-sales-detail-delete', 'menu-mes-wm-return-sales-detail', '删除MesWmReturnSalesDetail（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_sales_detail:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-wm-return-sales-detail'),
('1', 'menu-mes-wm-return-sales-detail-query'),
('1', 'menu-mes-wm-return-sales-detail-create'),
('1', 'menu-mes-wm-return-sales-detail-update'),
('1', 'menu-mes-wm-return-sales-detail-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-wm-return-sales-detail'),
('1', 'menu-mes-wm-return-sales-detail-query'),
('1', 'menu-mes-wm-return-sales-detail-create'),
('1', 'menu-mes-wm-return-sales-detail-update'),
('1', 'menu-mes-wm-return-sales-detail-delete')
ON CONFLICT DO NOTHING;
