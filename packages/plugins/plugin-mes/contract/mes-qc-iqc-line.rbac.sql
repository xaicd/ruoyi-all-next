-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesQcIqcLine（源框架导入） (MesQcIqcLine)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-qc-iqc-line',
  'mes-dir',
  'MesQcIqcLine（源框架导入）管理',
  '/admin/mes/mes-qc-iqc-line',
  'mes/mes-qc-iqc-line/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_qc_iqc_line:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-qc-iqc-line-query',  'menu-mes-qc-iqc-line', '查询MesQcIqcLine（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_iqc_line:query',  1, NOW(), NOW()),
('menu-mes-qc-iqc-line-create', 'menu-mes-qc-iqc-line', '新增MesQcIqcLine（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_iqc_line:create', 2, NOW(), NOW()),
('menu-mes-qc-iqc-line-update', 'menu-mes-qc-iqc-line', '修改MesQcIqcLine（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_iqc_line:update', 3, NOW(), NOW()),
('menu-mes-qc-iqc-line-delete', 'menu-mes-qc-iqc-line', '删除MesQcIqcLine（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_iqc_line:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-qc-iqc-line'),
('1', 'menu-mes-qc-iqc-line-query'),
('1', 'menu-mes-qc-iqc-line-create'),
('1', 'menu-mes-qc-iqc-line-update'),
('1', 'menu-mes-qc-iqc-line-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-qc-iqc-line'),
('1', 'menu-mes-qc-iqc-line-query'),
('1', 'menu-mes-qc-iqc-line-create'),
('1', 'menu-mes-qc-iqc-line-update'),
('1', 'menu-mes-qc-iqc-line-delete')
ON CONFLICT DO NOTHING;
