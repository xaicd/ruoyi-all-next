-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 生产流转卡 (MesProCard)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-pro-card',
  'mes-dir',
  'MES 生产流转卡管理',
  '/admin/mes/mes-pro-card',
  'mes/mes-pro-card/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_pro_card:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-pro-card-query',  'menu-mes-pro-card', '查询MES 生产流转卡', 'BUTTON', 'ACTIVE', 'mes:mes_pro_card:query',  1, NOW(), NOW()),
('menu-mes-pro-card-create', 'menu-mes-pro-card', '新增MES 生产流转卡', 'BUTTON', 'ACTIVE', 'mes:mes_pro_card:create', 2, NOW(), NOW()),
('menu-mes-pro-card-update', 'menu-mes-pro-card', '修改MES 生产流转卡', 'BUTTON', 'ACTIVE', 'mes:mes_pro_card:update', 3, NOW(), NOW()),
('menu-mes-pro-card-delete', 'menu-mes-pro-card', '删除MES 生产流转卡', 'BUTTON', 'ACTIVE', 'mes:mes_pro_card:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-pro-card-rm',        '1', 'menu-mes-pro-card'),
('menu-mes-pro-card-rm-query',  '1', 'menu-mes-pro-card-query'),
('menu-mes-pro-card-rm-create', '1', 'menu-mes-pro-card-create'),
('menu-mes-pro-card-rm-update', '1', 'menu-mes-pro-card-update'),
('menu-mes-pro-card-rm-delete', '1', 'menu-mes-pro-card-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-pro-card-pm',        '1', 'menu-mes-pro-card'),
('menu-mes-pro-card-pm-query',  '1', 'menu-mes-pro-card-query'),
('menu-mes-pro-card-pm-create', '1', 'menu-mes-pro-card-create'),
('menu-mes-pro-card-pm-update', '1', 'menu-mes-pro-card-update'),
('menu-mes-pro-card-pm-delete', '1', 'menu-mes-pro-card-delete')
ON CONFLICT DO NOTHING;
