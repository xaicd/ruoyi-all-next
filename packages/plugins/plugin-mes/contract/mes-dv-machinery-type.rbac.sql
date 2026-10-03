-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesDvMachineryType（源框架导入） (MesDvMachineryType)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-dv-machinery-type',
  'mes-dir',
  'MesDvMachineryType（源框架导入）管理',
  '/admin/mes/mes-dv-machinery-type',
  'mes/mes-dv-machinery-type/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_dv_machinery_type:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-dv-machinery-type-query',  'menu-mes-dv-machinery-type', '查询MesDvMachineryType（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_dv_machinery_type:query',  1, NOW(), NOW()),
('menu-mes-dv-machinery-type-create', 'menu-mes-dv-machinery-type', '新增MesDvMachineryType（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_dv_machinery_type:create', 2, NOW(), NOW()),
('menu-mes-dv-machinery-type-update', 'menu-mes-dv-machinery-type', '修改MesDvMachineryType（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_dv_machinery_type:update', 3, NOW(), NOW()),
('menu-mes-dv-machinery-type-delete', 'menu-mes-dv-machinery-type', '删除MesDvMachineryType（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_dv_machinery_type:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-dv-machinery-type'),
('1', 'menu-mes-dv-machinery-type-query'),
('1', 'menu-mes-dv-machinery-type-create'),
('1', 'menu-mes-dv-machinery-type-update'),
('1', 'menu-mes-dv-machinery-type-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-dv-machinery-type'),
('1', 'menu-mes-dv-machinery-type-query'),
('1', 'menu-mes-dv-machinery-type-create'),
('1', 'menu-mes-dv-machinery-type-update'),
('1', 'menu-mes-dv-machinery-type-delete')
ON CONFLICT DO NOTHING;
