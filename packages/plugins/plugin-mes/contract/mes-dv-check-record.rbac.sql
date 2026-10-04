-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 设备点检记录 (MesDvCheckRecord)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-dv-check-record',
  'mes-dir',
  'MES 设备点检记录管理',
  '/admin/mes/mes-dv-check-record',
  'mes/mes-dv-check-record/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_dv_check_record:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-dv-check-record-query',  'menu-mes-dv-check-record', '查询MES 设备点检记录', 'BUTTON', 'ACTIVE', 'mes:mes_dv_check_record:query',  1, NOW(), NOW()),
('menu-mes-dv-check-record-create', 'menu-mes-dv-check-record', '新增MES 设备点检记录', 'BUTTON', 'ACTIVE', 'mes:mes_dv_check_record:create', 2, NOW(), NOW()),
('menu-mes-dv-check-record-update', 'menu-mes-dv-check-record', '修改MES 设备点检记录', 'BUTTON', 'ACTIVE', 'mes:mes_dv_check_record:update', 3, NOW(), NOW()),
('menu-mes-dv-check-record-delete', 'menu-mes-dv-check-record', '删除MES 设备点检记录', 'BUTTON', 'ACTIVE', 'mes:mes_dv_check_record:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-dv-check-record-rm',        '1', 'menu-mes-dv-check-record'),
('menu-mes-dv-check-record-rm-query',  '1', 'menu-mes-dv-check-record-query'),
('menu-mes-dv-check-record-rm-create', '1', 'menu-mes-dv-check-record-create'),
('menu-mes-dv-check-record-rm-update', '1', 'menu-mes-dv-check-record-update'),
('menu-mes-dv-check-record-rm-delete', '1', 'menu-mes-dv-check-record-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-dv-check-record-pm',        '1', 'menu-mes-dv-check-record'),
('menu-mes-dv-check-record-pm-query',  '1', 'menu-mes-dv-check-record-query'),
('menu-mes-dv-check-record-pm-create', '1', 'menu-mes-dv-check-record-create'),
('menu-mes-dv-check-record-pm-update', '1', 'menu-mes-dv-check-record-update'),
('menu-mes-dv-check-record-pm-delete', '1', 'menu-mes-dv-check-record-delete')
ON CONFLICT DO NOTHING;
