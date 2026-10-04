-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 班组成员 (MesCalTeamMember)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-cal-team-member',
  'mes-dir',
  'MES 班组成员管理',
  '/admin/mes/mes-cal-team-member',
  'mes/mes-cal-team-member/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_cal_team_member:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-cal-team-member-query',  'menu-mes-cal-team-member', '查询MES 班组成员', 'BUTTON', 'ACTIVE', 'mes:mes_cal_team_member:query',  1, NOW(), NOW()),
('menu-mes-cal-team-member-create', 'menu-mes-cal-team-member', '新增MES 班组成员', 'BUTTON', 'ACTIVE', 'mes:mes_cal_team_member:create', 2, NOW(), NOW()),
('menu-mes-cal-team-member-update', 'menu-mes-cal-team-member', '修改MES 班组成员', 'BUTTON', 'ACTIVE', 'mes:mes_cal_team_member:update', 3, NOW(), NOW()),
('menu-mes-cal-team-member-delete', 'menu-mes-cal-team-member', '删除MES 班组成员', 'BUTTON', 'ACTIVE', 'mes:mes_cal_team_member:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-cal-team-member'),
('1', 'menu-mes-cal-team-member-query'),
('1', 'menu-mes-cal-team-member-create'),
('1', 'menu-mes-cal-team-member-update'),
('1', 'menu-mes-cal-team-member-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-cal-team-member'),
('1', 'menu-mes-cal-team-member-query'),
('1', 'menu-mes-cal-team-member-create'),
('1', 'menu-mes-cal-team-member-update'),
('1', 'menu-mes-cal-team-member-delete')
ON CONFLICT DO NOTHING;
