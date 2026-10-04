-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 假期设置 (MesCalHoliday)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-cal-holiday',
  'mes-dir',
  'MES 假期设置管理',
  '/admin/mes/mes-cal-holiday',
  'mes/mes-cal-holiday/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_cal_holiday:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-cal-holiday-query',  'menu-mes-cal-holiday', '查询MES 假期设置', 'BUTTON', 'ACTIVE', 'mes:mes_cal_holiday:query',  1, NOW(), NOW()),
('menu-mes-cal-holiday-create', 'menu-mes-cal-holiday', '新增MES 假期设置', 'BUTTON', 'ACTIVE', 'mes:mes_cal_holiday:create', 2, NOW(), NOW()),
('menu-mes-cal-holiday-update', 'menu-mes-cal-holiday', '修改MES 假期设置', 'BUTTON', 'ACTIVE', 'mes:mes_cal_holiday:update', 3, NOW(), NOW()),
('menu-mes-cal-holiday-delete', 'menu-mes-cal-holiday', '删除MES 假期设置', 'BUTTON', 'ACTIVE', 'mes:mes_cal_holiday:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-cal-holiday-rm',        '1', 'menu-mes-cal-holiday'),
('menu-mes-cal-holiday-rm-query',  '1', 'menu-mes-cal-holiday-query'),
('menu-mes-cal-holiday-rm-create', '1', 'menu-mes-cal-holiday-create'),
('menu-mes-cal-holiday-rm-update', '1', 'menu-mes-cal-holiday-update'),
('menu-mes-cal-holiday-rm-delete', '1', 'menu-mes-cal-holiday-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-cal-holiday-pm',        '1', 'menu-mes-cal-holiday'),
('menu-mes-cal-holiday-pm-query',  '1', 'menu-mes-cal-holiday-query'),
('menu-mes-cal-holiday-pm-create', '1', 'menu-mes-cal-holiday-create'),
('menu-mes-cal-holiday-pm-update', '1', 'menu-mes-cal-holiday-update'),
('menu-mes-cal-holiday-pm-delete', '1', 'menu-mes-cal-holiday-delete')
ON CONFLICT DO NOTHING;
