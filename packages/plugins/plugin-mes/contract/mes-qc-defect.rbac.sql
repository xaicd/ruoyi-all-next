-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesQcDefect（源框架导入） (MesQcDefect)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-qc-defect',
  'mes-dir',
  'MesQcDefect（源框架导入）管理',
  '/admin/mes/mes-qc-defect',
  'mes/mes-qc-defect/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_qc_defect:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-qc-defect-query',  'menu-mes-qc-defect', '查询MesQcDefect（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_defect:query',  1, NOW(), NOW()),
('menu-mes-qc-defect-create', 'menu-mes-qc-defect', '新增MesQcDefect（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_defect:create', 2, NOW(), NOW()),
('menu-mes-qc-defect-update', 'menu-mes-qc-defect', '修改MesQcDefect（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_defect:update', 3, NOW(), NOW()),
('menu-mes-qc-defect-delete', 'menu-mes-qc-defect', '删除MesQcDefect（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_defect:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-qc-defect'),
('1', 'menu-mes-qc-defect-query'),
('1', 'menu-mes-qc-defect-create'),
('1', 'menu-mes-qc-defect-update'),
('1', 'menu-mes-qc-defect-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-qc-defect'),
('1', 'menu-mes-qc-defect-query'),
('1', 'menu-mes-qc-defect-create'),
('1', 'menu-mes-qc-defect-update'),
('1', 'menu-mes-qc-defect-delete')
ON CONFLICT DO NOTHING;
