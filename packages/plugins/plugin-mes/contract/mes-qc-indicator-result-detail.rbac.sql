-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 检验结果明细记录 (MesQcIndicatorResultDetail)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-qc-indicator-result-detail',
  'mes-dir',
  'MES 检验结果明细记录管理',
  '/admin/mes/mes-qc-indicator-result-detail',
  'mes/mes-qc-indicator-result-detail/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_qc_indicator_result_detail:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-qc-indicator-result-detail-query',  'menu-mes-qc-indicator-result-detail', '查询MES 检验结果明细记录', 'BUTTON', 'ACTIVE', 'mes:mes_qc_indicator_result_detail:query',  1, NOW(), NOW()),
('menu-mes-qc-indicator-result-detail-create', 'menu-mes-qc-indicator-result-detail', '新增MES 检验结果明细记录', 'BUTTON', 'ACTIVE', 'mes:mes_qc_indicator_result_detail:create', 2, NOW(), NOW()),
('menu-mes-qc-indicator-result-detail-update', 'menu-mes-qc-indicator-result-detail', '修改MES 检验结果明细记录', 'BUTTON', 'ACTIVE', 'mes:mes_qc_indicator_result_detail:update', 3, NOW(), NOW()),
('menu-mes-qc-indicator-result-detail-delete', 'menu-mes-qc-indicator-result-detail', '删除MES 检验结果明细记录', 'BUTTON', 'ACTIVE', 'mes:mes_qc_indicator_result_detail:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-qc-indicator-result-detail'),
('1', 'menu-mes-qc-indicator-result-detail-query'),
('1', 'menu-mes-qc-indicator-result-detail-create'),
('1', 'menu-mes-qc-indicator-result-detail-update'),
('1', 'menu-mes-qc-indicator-result-detail-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-qc-indicator-result-detail'),
('1', 'menu-mes-qc-indicator-result-detail-query'),
('1', 'menu-mes-qc-indicator-result-detail-create'),
('1', 'menu-mes-qc-indicator-result-detail-update'),
('1', 'menu-mes-qc-indicator-result-detail-delete')
ON CONFLICT DO NOTHING;
