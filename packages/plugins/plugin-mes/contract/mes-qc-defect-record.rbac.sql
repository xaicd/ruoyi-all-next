-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesQcDefectRecord（源框架导入） (MesQcDefectRecord)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-qc-defect-record',
  'mes-dir',
  'MesQcDefectRecord（源框架导入）管理',
  '/admin/mes/mes-qc-defect-record',
  'mes/mes-qc-defect-record/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_qc_defect_record:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-qc-defect-record-query',  'menu-mes-qc-defect-record', '查询MesQcDefectRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_defect_record:query',  1, NOW(), NOW()),
('menu-mes-qc-defect-record-create', 'menu-mes-qc-defect-record', '新增MesQcDefectRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_defect_record:create', 2, NOW(), NOW()),
('menu-mes-qc-defect-record-update', 'menu-mes-qc-defect-record', '修改MesQcDefectRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_defect_record:update', 3, NOW(), NOW()),
('menu-mes-qc-defect-record-delete', 'menu-mes-qc-defect-record', '删除MesQcDefectRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_defect_record:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-qc-defect-record'),
('1', 'menu-mes-qc-defect-record-query'),
('1', 'menu-mes-qc-defect-record-create'),
('1', 'menu-mes-qc-defect-record-update'),
('1', 'menu-mes-qc-defect-record-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-qc-defect-record'),
('1', 'menu-mes-qc-defect-record-query'),
('1', 'menu-mes-qc-defect-record-create'),
('1', 'menu-mes-qc-defect-record-update'),
('1', 'menu-mes-qc-defect-record-delete')
ON CONFLICT DO NOTHING;
