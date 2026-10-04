-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 设备台账 (MesDvMachinery)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-dv-machinery',
  'mes-dir',
  'MES 设备台账管理',
  '/admin/mes/mes-dv-machinery',
  'mes/mes-dv-machinery/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_dv_machinery:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-dv-machinery-query',  'menu-mes-dv-machinery', '查询MES 设备台账', 'BUTTON', 'ACTIVE', 'mes:mes_dv_machinery:query',  1, NOW(), NOW()),
('menu-mes-dv-machinery-create', 'menu-mes-dv-machinery', '新增MES 设备台账', 'BUTTON', 'ACTIVE', 'mes:mes_dv_machinery:create', 2, NOW(), NOW()),
('menu-mes-dv-machinery-update', 'menu-mes-dv-machinery', '修改MES 设备台账', 'BUTTON', 'ACTIVE', 'mes:mes_dv_machinery:update', 3, NOW(), NOW()),
('menu-mes-dv-machinery-delete', 'menu-mes-dv-machinery', '删除MES 设备台账', 'BUTTON', 'ACTIVE', 'mes:mes_dv_machinery:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-dv-machinery'),
('1', 'menu-mes-dv-machinery-query'),
('1', 'menu-mes-dv-machinery-create'),
('1', 'menu-mes-dv-machinery-update'),
('1', 'menu-mes-dv-machinery-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-dv-machinery'),
('1', 'menu-mes-dv-machinery-query'),
('1', 'menu-mes-dv-machinery-create'),
('1', 'menu-mes-dv-machinery-update'),
('1', 'menu-mes-dv-machinery-delete')
ON CONFLICT DO NOTHING;
