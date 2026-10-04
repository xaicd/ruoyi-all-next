-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 客户 (MesMdClient)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-md-client',
  'mes-dir',
  'MES 客户管理',
  '/admin/mes/mes-md-client',
  'mes/mes-md-client/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_md_client:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-md-client-query',  'menu-mes-md-client', '查询MES 客户', 'BUTTON', 'ACTIVE', 'mes:mes_md_client:query',  1, NOW(), NOW()),
('menu-mes-md-client-create', 'menu-mes-md-client', '新增MES 客户', 'BUTTON', 'ACTIVE', 'mes:mes_md_client:create', 2, NOW(), NOW()),
('menu-mes-md-client-update', 'menu-mes-md-client', '修改MES 客户', 'BUTTON', 'ACTIVE', 'mes:mes_md_client:update', 3, NOW(), NOW()),
('menu-mes-md-client-delete', 'menu-mes-md-client', '删除MES 客户', 'BUTTON', 'ACTIVE', 'mes:mes_md_client:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-md-client-rm',        '1', 'menu-mes-md-client'),
('menu-mes-md-client-rm-query',  '1', 'menu-mes-md-client-query'),
('menu-mes-md-client-rm-create', '1', 'menu-mes-md-client-create'),
('menu-mes-md-client-rm-update', '1', 'menu-mes-md-client-update'),
('menu-mes-md-client-rm-delete', '1', 'menu-mes-md-client-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-md-client-pm',        '1', 'menu-mes-md-client'),
('menu-mes-md-client-pm-query',  '1', 'menu-mes-md-client-query'),
('menu-mes-md-client-pm-create', '1', 'menu-mes-md-client-create'),
('menu-mes-md-client-pm-update', '1', 'menu-mes-md-client-update'),
('menu-mes-md-client-pm-delete', '1', 'menu-mes-md-client-delete')
ON CONFLICT DO NOTHING;
