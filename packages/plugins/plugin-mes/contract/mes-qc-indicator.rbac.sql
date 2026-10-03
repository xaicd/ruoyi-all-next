-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesQcIndicator（源框架导入） (MesQcIndicator)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-qc-indicator',
  'mes-dir',
  'MesQcIndicator（源框架导入）管理',
  '/admin/mes/mes-qc-indicator',
  'mes/mes-qc-indicator/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_qc_indicator:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-qc-indicator-query',  'menu-mes-qc-indicator', '查询MesQcIndicator（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_indicator:query',  1, NOW(), NOW()),
('menu-mes-qc-indicator-create', 'menu-mes-qc-indicator', '新增MesQcIndicator（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_indicator:create', 2, NOW(), NOW()),
('menu-mes-qc-indicator-update', 'menu-mes-qc-indicator', '修改MesQcIndicator（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_indicator:update', 3, NOW(), NOW()),
('menu-mes-qc-indicator-delete', 'menu-mes-qc-indicator', '删除MesQcIndicator（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_indicator:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-qc-indicator'),
('1', 'menu-mes-qc-indicator-query'),
('1', 'menu-mes-qc-indicator-create'),
('1', 'menu-mes-qc-indicator-update'),
('1', 'menu-mes-qc-indicator-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-qc-indicator'),
('1', 'menu-mes-qc-indicator-query'),
('1', 'menu-mes-qc-indicator-create'),
('1', 'menu-mes-qc-indicator-update'),
('1', 'menu-mes-qc-indicator-delete')
ON CONFLICT DO NOTHING;
