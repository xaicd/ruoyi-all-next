-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesQcIndicatorResult（源框架导入） (MesQcIndicatorResult)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-qc-indicator-result',
  'mes-dir',
  'MesQcIndicatorResult（源框架导入）管理',
  '/admin/mes/mes-qc-indicator-result',
  'mes/mes-qc-indicator-result/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_qc_indicator_result:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-qc-indicator-result-query',  'menu-mes-qc-indicator-result', '查询MesQcIndicatorResult（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_indicator_result:query',  1, NOW(), NOW()),
('menu-mes-qc-indicator-result-create', 'menu-mes-qc-indicator-result', '新增MesQcIndicatorResult（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_indicator_result:create', 2, NOW(), NOW()),
('menu-mes-qc-indicator-result-update', 'menu-mes-qc-indicator-result', '修改MesQcIndicatorResult（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_indicator_result:update', 3, NOW(), NOW()),
('menu-mes-qc-indicator-result-delete', 'menu-mes-qc-indicator-result', '删除MesQcIndicatorResult（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_indicator_result:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-qc-indicator-result'),
('1', 'menu-mes-qc-indicator-result-query'),
('1', 'menu-mes-qc-indicator-result-create'),
('1', 'menu-mes-qc-indicator-result-update'),
('1', 'menu-mes-qc-indicator-result-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-qc-indicator-result'),
('1', 'menu-mes-qc-indicator-result-query'),
('1', 'menu-mes-qc-indicator-result-create'),
('1', 'menu-mes-qc-indicator-result-update'),
('1', 'menu-mes-qc-indicator-result-delete')
ON CONFLICT DO NOTHING;
