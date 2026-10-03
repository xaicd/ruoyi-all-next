-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesMdUnitMeasure（源框架导入） (MesMdUnitMeasure)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-md-unit-measure',
  'mes-dir',
  'MesMdUnitMeasure（源框架导入）管理',
  '/admin/mes/mes-md-unit-measure',
  'mes/mes-md-unit-measure/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_md_unit_measure:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-md-unit-measure-query',  'menu-mes-md-unit-measure', '查询MesMdUnitMeasure（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_unit_measure:query',  1, NOW(), NOW()),
('menu-mes-md-unit-measure-create', 'menu-mes-md-unit-measure', '新增MesMdUnitMeasure（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_unit_measure:create', 2, NOW(), NOW()),
('menu-mes-md-unit-measure-update', 'menu-mes-md-unit-measure', '修改MesMdUnitMeasure（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_unit_measure:update', 3, NOW(), NOW()),
('menu-mes-md-unit-measure-delete', 'menu-mes-md-unit-measure', '删除MesMdUnitMeasure（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_unit_measure:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-md-unit-measure'),
('1', 'menu-mes-md-unit-measure-query'),
('1', 'menu-mes-md-unit-measure-create'),
('1', 'menu-mes-md-unit-measure-update'),
('1', 'menu-mes-md-unit-measure-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-md-unit-measure'),
('1', 'menu-mes-md-unit-measure-query'),
('1', 'menu-mes-md-unit-measure-create'),
('1', 'menu-mes-md-unit-measure-update'),
('1', 'menu-mes-md-unit-measure-delete')
ON CONFLICT DO NOTHING;
