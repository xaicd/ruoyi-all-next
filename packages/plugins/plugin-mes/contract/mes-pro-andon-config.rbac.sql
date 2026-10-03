-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesProAndonConfig（源框架导入） (MesProAndonConfig)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-pro-andon-config',
  'mes-dir',
  'MesProAndonConfig（源框架导入）管理',
  '/admin/mes/mes-pro-andon-config',
  'mes/mes-pro-andon-config/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_pro_andon_config:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-pro-andon-config-query',  'menu-mes-pro-andon-config', '查询MesProAndonConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_andon_config:query',  1, NOW(), NOW()),
('menu-mes-pro-andon-config-create', 'menu-mes-pro-andon-config', '新增MesProAndonConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_andon_config:create', 2, NOW(), NOW()),
('menu-mes-pro-andon-config-update', 'menu-mes-pro-andon-config', '修改MesProAndonConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_andon_config:update', 3, NOW(), NOW()),
('menu-mes-pro-andon-config-delete', 'menu-mes-pro-andon-config', '删除MesProAndonConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_andon_config:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-pro-andon-config'),
('1', 'menu-mes-pro-andon-config-query'),
('1', 'menu-mes-pro-andon-config-create'),
('1', 'menu-mes-pro-andon-config-update'),
('1', 'menu-mes-pro-andon-config-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-pro-andon-config'),
('1', 'menu-mes-pro-andon-config-query'),
('1', 'menu-mes-pro-andon-config-create'),
('1', 'menu-mes-pro-andon-config-update'),
('1', 'menu-mes-pro-andon-config-delete')
ON CONFLICT DO NOTHING;
