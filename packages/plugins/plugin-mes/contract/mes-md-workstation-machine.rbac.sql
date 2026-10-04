-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 设备资源 (MesMdWorkstationMachine)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-md-workstation-machine',
  'mes-dir',
  'MES 设备资源管理',
  '/admin/mes/mes-md-workstation-machine',
  'mes/mes-md-workstation-machine/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_md_workstation_machine:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-md-workstation-machine-query',  'menu-mes-md-workstation-machine', '查询MES 设备资源', 'BUTTON', 'ACTIVE', 'mes:mes_md_workstation_machine:query',  1, NOW(), NOW()),
('menu-mes-md-workstation-machine-create', 'menu-mes-md-workstation-machine', '新增MES 设备资源', 'BUTTON', 'ACTIVE', 'mes:mes_md_workstation_machine:create', 2, NOW(), NOW()),
('menu-mes-md-workstation-machine-update', 'menu-mes-md-workstation-machine', '修改MES 设备资源', 'BUTTON', 'ACTIVE', 'mes:mes_md_workstation_machine:update', 3, NOW(), NOW()),
('menu-mes-md-workstation-machine-delete', 'menu-mes-md-workstation-machine', '删除MES 设备资源', 'BUTTON', 'ACTIVE', 'mes:mes_md_workstation_machine:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-md-workstation-machine'),
('1', 'menu-mes-md-workstation-machine-query'),
('1', 'menu-mes-md-workstation-machine-create'),
('1', 'menu-mes-md-workstation-machine-update'),
('1', 'menu-mes-md-workstation-machine-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-md-workstation-machine'),
('1', 'menu-mes-md-workstation-machine-query'),
('1', 'menu-mes-md-workstation-machine-create'),
('1', 'menu-mes-md-workstation-machine-update'),
('1', 'menu-mes-md-workstation-machine-delete')
ON CONFLICT DO NOTHING;
