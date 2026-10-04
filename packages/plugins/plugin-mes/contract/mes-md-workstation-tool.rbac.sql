-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 工装夹具资源 (MesMdWorkstationTool)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-md-workstation-tool',
  'mes-dir',
  'MES 工装夹具资源管理',
  '/admin/mes/mes-md-workstation-tool',
  'mes/mes-md-workstation-tool/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_md_workstation_tool:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-md-workstation-tool-query',  'menu-mes-md-workstation-tool', '查询MES 工装夹具资源', 'BUTTON', 'ACTIVE', 'mes:mes_md_workstation_tool:query',  1, NOW(), NOW()),
('menu-mes-md-workstation-tool-create', 'menu-mes-md-workstation-tool', '新增MES 工装夹具资源', 'BUTTON', 'ACTIVE', 'mes:mes_md_workstation_tool:create', 2, NOW(), NOW()),
('menu-mes-md-workstation-tool-update', 'menu-mes-md-workstation-tool', '修改MES 工装夹具资源', 'BUTTON', 'ACTIVE', 'mes:mes_md_workstation_tool:update', 3, NOW(), NOW()),
('menu-mes-md-workstation-tool-delete', 'menu-mes-md-workstation-tool', '删除MES 工装夹具资源', 'BUTTON', 'ACTIVE', 'mes:mes_md_workstation_tool:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-md-workstation-tool-rm',        '1', 'menu-mes-md-workstation-tool'),
('menu-mes-md-workstation-tool-rm-query',  '1', 'menu-mes-md-workstation-tool-query'),
('menu-mes-md-workstation-tool-rm-create', '1', 'menu-mes-md-workstation-tool-create'),
('menu-mes-md-workstation-tool-rm-update', '1', 'menu-mes-md-workstation-tool-update'),
('menu-mes-md-workstation-tool-rm-delete', '1', 'menu-mes-md-workstation-tool-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-md-workstation-tool-pm',        '1', 'menu-mes-md-workstation-tool'),
('menu-mes-md-workstation-tool-pm-query',  '1', 'menu-mes-md-workstation-tool-query'),
('menu-mes-md-workstation-tool-pm-create', '1', 'menu-mes-md-workstation-tool-create'),
('menu-mes-md-workstation-tool-pm-update', '1', 'menu-mes-md-workstation-tool-update'),
('menu-mes-md-workstation-tool-pm-delete', '1', 'menu-mes-md-workstation-tool-delete')
ON CONFLICT DO NOTHING;
