-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 工具类型 (MesTmToolType)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-tm-tool-type',
  'mes-dir',
  'MES 工具类型管理',
  '/admin/mes/mes-tm-tool-type',
  'mes/mes-tm-tool-type/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_tm_tool_type:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-tm-tool-type-query',  'menu-mes-tm-tool-type', '查询MES 工具类型', 'BUTTON', 'ACTIVE', 'mes:mes_tm_tool_type:query',  1, NOW(), NOW()),
('menu-mes-tm-tool-type-create', 'menu-mes-tm-tool-type', '新增MES 工具类型', 'BUTTON', 'ACTIVE', 'mes:mes_tm_tool_type:create', 2, NOW(), NOW()),
('menu-mes-tm-tool-type-update', 'menu-mes-tm-tool-type', '修改MES 工具类型', 'BUTTON', 'ACTIVE', 'mes:mes_tm_tool_type:update', 3, NOW(), NOW()),
('menu-mes-tm-tool-type-delete', 'menu-mes-tm-tool-type', '删除MES 工具类型', 'BUTTON', 'ACTIVE', 'mes:mes_tm_tool_type:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-tm-tool-type'),
('1', 'menu-mes-tm-tool-type-query'),
('1', 'menu-mes-tm-tool-type-create'),
('1', 'menu-mes-tm-tool-type-update'),
('1', 'menu-mes-tm-tool-type-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-tm-tool-type'),
('1', 'menu-mes-tm-tool-type-query'),
('1', 'menu-mes-tm-tool-type-create'),
('1', 'menu-mes-tm-tool-type-update'),
('1', 'menu-mes-tm-tool-type-delete')
ON CONFLICT DO NOTHING;
