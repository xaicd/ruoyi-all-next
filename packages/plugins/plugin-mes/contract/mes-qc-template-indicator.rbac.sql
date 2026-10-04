-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 质检方案-检测指标项 (MesQcTemplateIndicator)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-qc-template-indicator',
  'mes-dir',
  'MES 质检方案-检测指标项管理',
  '/admin/mes/mes-qc-template-indicator',
  'mes/mes-qc-template-indicator/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_qc_template_indicator:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-qc-template-indicator-query',  'menu-mes-qc-template-indicator', '查询MES 质检方案-检测指标项', 'BUTTON', 'ACTIVE', 'mes:mes_qc_template_indicator:query',  1, NOW(), NOW()),
('menu-mes-qc-template-indicator-create', 'menu-mes-qc-template-indicator', '新增MES 质检方案-检测指标项', 'BUTTON', 'ACTIVE', 'mes:mes_qc_template_indicator:create', 2, NOW(), NOW()),
('menu-mes-qc-template-indicator-update', 'menu-mes-qc-template-indicator', '修改MES 质检方案-检测指标项', 'BUTTON', 'ACTIVE', 'mes:mes_qc_template_indicator:update', 3, NOW(), NOW()),
('menu-mes-qc-template-indicator-delete', 'menu-mes-qc-template-indicator', '删除MES 质检方案-检测指标项', 'BUTTON', 'ACTIVE', 'mes:mes_qc_template_indicator:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-qc-template-indicator-rm',        '1', 'menu-mes-qc-template-indicator'),
('menu-mes-qc-template-indicator-rm-query',  '1', 'menu-mes-qc-template-indicator-query'),
('menu-mes-qc-template-indicator-rm-create', '1', 'menu-mes-qc-template-indicator-create'),
('menu-mes-qc-template-indicator-rm-update', '1', 'menu-mes-qc-template-indicator-update'),
('menu-mes-qc-template-indicator-rm-delete', '1', 'menu-mes-qc-template-indicator-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-qc-template-indicator-pm',        '1', 'menu-mes-qc-template-indicator'),
('menu-mes-qc-template-indicator-pm-query',  '1', 'menu-mes-qc-template-indicator-query'),
('menu-mes-qc-template-indicator-pm-create', '1', 'menu-mes-qc-template-indicator-create'),
('menu-mes-qc-template-indicator-pm-update', '1', 'menu-mes-qc-template-indicator-update'),
('menu-mes-qc-template-indicator-pm-delete', '1', 'menu-mes-qc-template-indicator-delete')
ON CONFLICT DO NOTHING;
