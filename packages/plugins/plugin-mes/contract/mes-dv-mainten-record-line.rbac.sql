-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesDvMaintenRecordLine（源框架导入） (MesDvMaintenRecordLine)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-dv-mainten-record-line',
  'mes-dir',
  'MesDvMaintenRecordLine（源框架导入）管理',
  '/admin/mes/mes-dv-mainten-record-line',
  'mes/mes-dv-mainten-record-line/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_dv_mainten_record_line:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-dv-mainten-record-line-query',  'menu-mes-dv-mainten-record-line', '查询MesDvMaintenRecordLine（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_dv_mainten_record_line:query',  1, NOW(), NOW()),
('menu-mes-dv-mainten-record-line-create', 'menu-mes-dv-mainten-record-line', '新增MesDvMaintenRecordLine（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_dv_mainten_record_line:create', 2, NOW(), NOW()),
('menu-mes-dv-mainten-record-line-update', 'menu-mes-dv-mainten-record-line', '修改MesDvMaintenRecordLine（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_dv_mainten_record_line:update', 3, NOW(), NOW()),
('menu-mes-dv-mainten-record-line-delete', 'menu-mes-dv-mainten-record-line', '删除MesDvMaintenRecordLine（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_dv_mainten_record_line:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-dv-mainten-record-line'),
('1', 'menu-mes-dv-mainten-record-line-query'),
('1', 'menu-mes-dv-mainten-record-line-create'),
('1', 'menu-mes-dv-mainten-record-line-update'),
('1', 'menu-mes-dv-mainten-record-line-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-dv-mainten-record-line'),
('1', 'menu-mes-dv-mainten-record-line-query'),
('1', 'menu-mes-dv-mainten-record-line-create'),
('1', 'menu-mes-dv-mainten-record-line-update'),
('1', 'menu-mes-dv-mainten-record-line-delete')
ON CONFLICT DO NOTHING;
