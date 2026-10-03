-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesTmTool（源框架导入） (MesTmTool)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-tm-tool',
  'mes-dir',
  'MesTmTool（源框架导入）管理',
  '/admin/mes/mes-tm-tool',
  'mes/mes-tm-tool/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_tm_tool:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-tm-tool-query',  'menu-mes-tm-tool', '查询MesTmTool（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_tm_tool:query',  1, NOW(), NOW()),
('menu-mes-tm-tool-create', 'menu-mes-tm-tool', '新增MesTmTool（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_tm_tool:create', 2, NOW(), NOW()),
('menu-mes-tm-tool-update', 'menu-mes-tm-tool', '修改MesTmTool（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_tm_tool:update', 3, NOW(), NOW()),
('menu-mes-tm-tool-delete', 'menu-mes-tm-tool', '删除MesTmTool（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_tm_tool:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-tm-tool'),
('1', 'menu-mes-tm-tool-query'),
('1', 'menu-mes-tm-tool-create'),
('1', 'menu-mes-tm-tool-update'),
('1', 'menu-mes-tm-tool-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-tm-tool'),
('1', 'menu-mes-tm-tool-query'),
('1', 'menu-mes-tm-tool-create'),
('1', 'menu-mes-tm-tool-update'),
('1', 'menu-mes-tm-tool-delete')
ON CONFLICT DO NOTHING;
