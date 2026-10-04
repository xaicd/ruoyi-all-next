-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 车间 (MesMdWorkshop)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-md-workshop',
  'mes-dir',
  'MES 车间管理',
  '/admin/mes/mes-md-workshop',
  'mes/mes-md-workshop/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_md_workshop:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-md-workshop-query',  'menu-mes-md-workshop', '查询MES 车间', 'BUTTON', 'ACTIVE', 'mes:mes_md_workshop:query',  1, NOW(), NOW()),
('menu-mes-md-workshop-create', 'menu-mes-md-workshop', '新增MES 车间', 'BUTTON', 'ACTIVE', 'mes:mes_md_workshop:create', 2, NOW(), NOW()),
('menu-mes-md-workshop-update', 'menu-mes-md-workshop', '修改MES 车间', 'BUTTON', 'ACTIVE', 'mes:mes_md_workshop:update', 3, NOW(), NOW()),
('menu-mes-md-workshop-delete', 'menu-mes-md-workshop', '删除MES 车间', 'BUTTON', 'ACTIVE', 'mes:mes_md_workshop:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-md-workshop-rm',        '1', 'menu-mes-md-workshop'),
('menu-mes-md-workshop-rm-query',  '1', 'menu-mes-md-workshop-query'),
('menu-mes-md-workshop-rm-create', '1', 'menu-mes-md-workshop-create'),
('menu-mes-md-workshop-rm-update', '1', 'menu-mes-md-workshop-update'),
('menu-mes-md-workshop-rm-delete', '1', 'menu-mes-md-workshop-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-md-workshop-pm',        '1', 'menu-mes-md-workshop'),
('menu-mes-md-workshop-pm-query',  '1', 'menu-mes-md-workshop-query'),
('menu-mes-md-workshop-pm-create', '1', 'menu-mes-md-workshop-create'),
('menu-mes-md-workshop-pm-update', '1', 'menu-mes-md-workshop-update'),
('menu-mes-md-workshop-pm-delete', '1', 'menu-mes-md-workshop-delete')
ON CONFLICT DO NOTHING;
