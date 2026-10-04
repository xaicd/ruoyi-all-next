-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 班组 (MesCalTeam)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-cal-team',
  'mes-dir',
  'MES 班组管理',
  '/admin/mes/mes-cal-team',
  'mes/mes-cal-team/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_cal_team:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-cal-team-query',  'menu-mes-cal-team', '查询MES 班组', 'BUTTON', 'ACTIVE', 'mes:mes_cal_team:query',  1, NOW(), NOW()),
('menu-mes-cal-team-create', 'menu-mes-cal-team', '新增MES 班组', 'BUTTON', 'ACTIVE', 'mes:mes_cal_team:create', 2, NOW(), NOW()),
('menu-mes-cal-team-update', 'menu-mes-cal-team', '修改MES 班组', 'BUTTON', 'ACTIVE', 'mes:mes_cal_team:update', 3, NOW(), NOW()),
('menu-mes-cal-team-delete', 'menu-mes-cal-team', '删除MES 班组', 'BUTTON', 'ACTIVE', 'mes:mes_cal_team:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-cal-team-rm',        '1', 'menu-mes-cal-team'),
('menu-mes-cal-team-rm-query',  '1', 'menu-mes-cal-team-query'),
('menu-mes-cal-team-rm-create', '1', 'menu-mes-cal-team-create'),
('menu-mes-cal-team-rm-update', '1', 'menu-mes-cal-team-update'),
('menu-mes-cal-team-rm-delete', '1', 'menu-mes-cal-team-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-cal-team-pm',        '1', 'menu-mes-cal-team'),
('menu-mes-cal-team-pm-query',  '1', 'menu-mes-cal-team-query'),
('menu-mes-cal-team-pm-create', '1', 'menu-mes-cal-team-create'),
('menu-mes-cal-team-pm-update', '1', 'menu-mes-cal-team-update'),
('menu-mes-cal-team-pm-delete', '1', 'menu-mes-cal-team-delete')
ON CONFLICT DO NOTHING;
