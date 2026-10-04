-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 销售退货明细 (MesWmReturnSalesDetail)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-wm-return-sales-detail',
  'mes-dir',
  'MES 销售退货明细管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-wm-return-sales-detail-query',  'menu-mes-wm-return-sales-detail', '查询MES 销售退货明细', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_sales_detail:query',  1, NOW(), NOW()),
('menu-mes-wm-return-sales-detail-create', 'menu-mes-wm-return-sales-detail', '新增MES 销售退货明细', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_sales_detail:create', 2, NOW(), NOW()),
('menu-mes-wm-return-sales-detail-update', 'menu-mes-wm-return-sales-detail', '修改MES 销售退货明细', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_sales_detail:update', 3, NOW(), NOW()),
('menu-mes-wm-return-sales-detail-delete', 'menu-mes-wm-return-sales-detail', '删除MES 销售退货明细', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_sales_detail:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-wm-return-sales-detail-rm',        '1', 'menu-mes-wm-return-sales-detail'),
('menu-mes-wm-return-sales-detail-rm-query',  '1', 'menu-mes-wm-return-sales-detail-query'),
('menu-mes-wm-return-sales-detail-rm-create', '1', 'menu-mes-wm-return-sales-detail-create'),
('menu-mes-wm-return-sales-detail-rm-update', '1', 'menu-mes-wm-return-sales-detail-update'),
('menu-mes-wm-return-sales-detail-rm-delete', '1', 'menu-mes-wm-return-sales-detail-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-wm-return-sales-detail-pm',        '1', 'menu-mes-wm-return-sales-detail'),
('menu-mes-wm-return-sales-detail-pm-query',  '1', 'menu-mes-wm-return-sales-detail-query'),
('menu-mes-wm-return-sales-detail-pm-create', '1', 'menu-mes-wm-return-sales-detail-create'),
('menu-mes-wm-return-sales-detail-pm-update', '1', 'menu-mes-wm-return-sales-detail-update'),
('menu-mes-wm-return-sales-detail-pm-delete', '1', 'menu-mes-wm-return-sales-detail-delete')
ON CONFLICT DO NOTHING;
