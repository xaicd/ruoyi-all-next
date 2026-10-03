-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesProProcessContent（源框架导入） (MesProProcessContent)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-pro-process-content',
  'mes-dir',
  'MesProProcessContent（源框架导入）管理',
  '/admin/mes/mes-pro-process-content',
  'mes/mes-pro-process-content/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_pro_process_content:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-pro-process-content-query',  'menu-mes-pro-process-content', '查询MesProProcessContent（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_process_content:query',  1, NOW(), NOW()),
('menu-mes-pro-process-content-create', 'menu-mes-pro-process-content', '新增MesProProcessContent（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_process_content:create', 2, NOW(), NOW()),
('menu-mes-pro-process-content-update', 'menu-mes-pro-process-content', '修改MesProProcessContent（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_process_content:update', 3, NOW(), NOW()),
('menu-mes-pro-process-content-delete', 'menu-mes-pro-process-content', '删除MesProProcessContent（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_process_content:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-pro-process-content'),
('1', 'menu-mes-pro-process-content-query'),
('1', 'menu-mes-pro-process-content-create'),
('1', 'menu-mes-pro-process-content-update'),
('1', 'menu-mes-pro-process-content-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-pro-process-content'),
('1', 'menu-mes-pro-process-content-query'),
('1', 'menu-mes-pro-process-content-create'),
('1', 'menu-mes-pro-process-content-update'),
('1', 'menu-mes-pro-process-content-delete')
ON CONFLICT DO NOTHING;
