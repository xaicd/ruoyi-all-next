-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesCalHoliday（源框架导入） (MesCalHoliday)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-cal-holiday',
  'mes-dir',
  'MesCalHoliday（源框架导入）管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-cal-holiday-query',  'menu-mes-cal-holiday', '查询MesCalHoliday（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_cal_holiday:query',  1, NOW(), NOW()),
('menu-mes-cal-holiday-create', 'menu-mes-cal-holiday', '新增MesCalHoliday（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_cal_holiday:create', 2, NOW(), NOW()),
('menu-mes-cal-holiday-update', 'menu-mes-cal-holiday', '修改MesCalHoliday（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_cal_holiday:update', 3, NOW(), NOW()),
('menu-mes-cal-holiday-delete', 'menu-mes-cal-holiday', '删除MesCalHoliday（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_cal_holiday:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-cal-holiday'),
('1', 'menu-mes-cal-holiday-query'),
('1', 'menu-mes-cal-holiday-create'),
('1', 'menu-mes-cal-holiday-update'),
('1', 'menu-mes-cal-holiday-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-cal-holiday'),
('1', 'menu-mes-cal-holiday-query'),
('1', 'menu-mes-cal-holiday-create'),
('1', 'menu-mes-cal-holiday-update'),
('1', 'menu-mes-cal-holiday-delete')
ON CONFLICT DO NOTHING;
