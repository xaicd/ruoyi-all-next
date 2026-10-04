-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 维修工单行 (MesDvRepairLine)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-dv-repair-line',
  'mes-dir',
  'MES 维修工单行管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-dv-repair-line-query',  'menu-mes-dv-repair-line', '查询MES 维修工单行', 'BUTTON', 'ACTIVE', 'mes:mes_dv_repair_line:query',  1, NOW(), NOW()),
('menu-mes-dv-repair-line-create', 'menu-mes-dv-repair-line', '新增MES 维修工单行', 'BUTTON', 'ACTIVE', 'mes:mes_dv_repair_line:create', 2, NOW(), NOW()),
('menu-mes-dv-repair-line-update', 'menu-mes-dv-repair-line', '修改MES 维修工单行', 'BUTTON', 'ACTIVE', 'mes:mes_dv_repair_line:update', 3, NOW(), NOW()),
('menu-mes-dv-repair-line-delete', 'menu-mes-dv-repair-line', '删除MES 维修工单行', 'BUTTON', 'ACTIVE', 'mes:mes_dv_repair_line:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-dv-repair-line-rm',        '1', 'menu-mes-dv-repair-line'),
('menu-mes-dv-repair-line-rm-query',  '1', 'menu-mes-dv-repair-line-query'),
('menu-mes-dv-repair-line-rm-create', '1', 'menu-mes-dv-repair-line-create'),
('menu-mes-dv-repair-line-rm-update', '1', 'menu-mes-dv-repair-line-update'),
('menu-mes-dv-repair-line-rm-delete', '1', 'menu-mes-dv-repair-line-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-dv-repair-line-pm',        '1', 'menu-mes-dv-repair-line'),
('menu-mes-dv-repair-line-pm-query',  '1', 'menu-mes-dv-repair-line-query'),
('menu-mes-dv-repair-line-pm-create', '1', 'menu-mes-dv-repair-line-create'),
('menu-mes-dv-repair-line-pm-update', '1', 'menu-mes-dv-repair-line-update'),
('menu-mes-dv-repair-line-pm-delete', '1', 'menu-mes-dv-repair-line-delete')
ON CONFLICT DO NOTHING;
