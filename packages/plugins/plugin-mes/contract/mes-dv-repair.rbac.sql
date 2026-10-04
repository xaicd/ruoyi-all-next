-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 维修工单 (MesDvRepair)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-dv-repair',
  'mes-dir',
  'MES 维修工单管理',
  '/admin/mes/mes-dv-repair',
  'mes/mes-dv-repair/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_dv_repair:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-dv-repair-query',  'menu-mes-dv-repair', '查询MES 维修工单', 'BUTTON', 'ACTIVE', 'mes:mes_dv_repair:query',  1, NOW(), NOW()),
('menu-mes-dv-repair-create', 'menu-mes-dv-repair', '新增MES 维修工单', 'BUTTON', 'ACTIVE', 'mes:mes_dv_repair:create', 2, NOW(), NOW()),
('menu-mes-dv-repair-update', 'menu-mes-dv-repair', '修改MES 维修工单', 'BUTTON', 'ACTIVE', 'mes:mes_dv_repair:update', 3, NOW(), NOW()),
('menu-mes-dv-repair-delete', 'menu-mes-dv-repair', '删除MES 维修工单', 'BUTTON', 'ACTIVE', 'mes:mes_dv_repair:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-dv-repair'),
('1', 'menu-mes-dv-repair-query'),
('1', 'menu-mes-dv-repair-create'),
('1', 'menu-mes-dv-repair-update'),
('1', 'menu-mes-dv-repair-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-dv-repair'),
('1', 'menu-mes-dv-repair-query'),
('1', 'menu-mes-dv-repair-create'),
('1', 'menu-mes-dv-repair-update'),
('1', 'menu-mes-dv-repair-delete')
ON CONFLICT DO NOTHING;
