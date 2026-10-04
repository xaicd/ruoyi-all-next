-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 工作站 (MesMdWorkstation)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-md-workstation',
  'mes-dir',
  'MES 工作站管理',
  '/admin/mes/mes-md-workstation',
  'mes/mes-md-workstation/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_md_workstation:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-md-workstation-query',  'menu-mes-md-workstation', '查询MES 工作站', 'BUTTON', 'ACTIVE', 'mes:mes_md_workstation:query',  1, NOW(), NOW()),
('menu-mes-md-workstation-create', 'menu-mes-md-workstation', '新增MES 工作站', 'BUTTON', 'ACTIVE', 'mes:mes_md_workstation:create', 2, NOW(), NOW()),
('menu-mes-md-workstation-update', 'menu-mes-md-workstation', '修改MES 工作站', 'BUTTON', 'ACTIVE', 'mes:mes_md_workstation:update', 3, NOW(), NOW()),
('menu-mes-md-workstation-delete', 'menu-mes-md-workstation', '删除MES 工作站', 'BUTTON', 'ACTIVE', 'mes:mes_md_workstation:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-md-workstation-rm',        '1', 'menu-mes-md-workstation'),
('menu-mes-md-workstation-rm-query',  '1', 'menu-mes-md-workstation-query'),
('menu-mes-md-workstation-rm-create', '1', 'menu-mes-md-workstation-create'),
('menu-mes-md-workstation-rm-update', '1', 'menu-mes-md-workstation-update'),
('menu-mes-md-workstation-rm-delete', '1', 'menu-mes-md-workstation-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-md-workstation-pm',        '1', 'menu-mes-md-workstation'),
('menu-mes-md-workstation-pm-query',  '1', 'menu-mes-md-workstation-query'),
('menu-mes-md-workstation-pm-create', '1', 'menu-mes-md-workstation-create'),
('menu-mes-md-workstation-pm-update', '1', 'menu-mes-md-workstation-update'),
('menu-mes-md-workstation-pm-delete', '1', 'menu-mes-md-workstation-delete')
ON CONFLICT DO NOTHING;
