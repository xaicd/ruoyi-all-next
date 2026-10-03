-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesDvRepairLine（源框架导入） (MesDvRepairLine)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-dv-repair-line',
  'mes-dir',
  'MesDvRepairLine（源框架导入）管理',
  '/admin/mes/mes-dv-repair-line',
  'mes/mes-dv-repair-line/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_dv_repair_line:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-dv-repair-line-query',  'menu-mes-dv-repair-line', '查询MesDvRepairLine（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_dv_repair_line:query',  1, NOW(), NOW()),
('menu-mes-dv-repair-line-create', 'menu-mes-dv-repair-line', '新增MesDvRepairLine（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_dv_repair_line:create', 2, NOW(), NOW()),
('menu-mes-dv-repair-line-update', 'menu-mes-dv-repair-line', '修改MesDvRepairLine（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_dv_repair_line:update', 3, NOW(), NOW()),
('menu-mes-dv-repair-line-delete', 'menu-mes-dv-repair-line', '删除MesDvRepairLine（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_dv_repair_line:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-dv-repair-line'),
('1', 'menu-mes-dv-repair-line-query'),
('1', 'menu-mes-dv-repair-line-create'),
('1', 'menu-mes-dv-repair-line-update'),
('1', 'menu-mes-dv-repair-line-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-dv-repair-line'),
('1', 'menu-mes-dv-repair-line-query'),
('1', 'menu-mes-dv-repair-line-create'),
('1', 'menu-mes-dv-repair-line-update'),
('1', 'menu-mes-dv-repair-line-delete')
ON CONFLICT DO NOTHING;
