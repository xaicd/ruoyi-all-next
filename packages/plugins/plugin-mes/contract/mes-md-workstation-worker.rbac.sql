-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 人力资源 (MesMdWorkstationWorker)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-md-workstation-worker',
  'mes-dir',
  'MES 人力资源管理',
  '/admin/mes/mes-md-workstation-worker',
  'mes/mes-md-workstation-worker/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_md_workstation_worker:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-md-workstation-worker-query',  'menu-mes-md-workstation-worker', '查询MES 人力资源', 'BUTTON', 'ACTIVE', 'mes:mes_md_workstation_worker:query',  1, NOW(), NOW()),
('menu-mes-md-workstation-worker-create', 'menu-mes-md-workstation-worker', '新增MES 人力资源', 'BUTTON', 'ACTIVE', 'mes:mes_md_workstation_worker:create', 2, NOW(), NOW()),
('menu-mes-md-workstation-worker-update', 'menu-mes-md-workstation-worker', '修改MES 人力资源', 'BUTTON', 'ACTIVE', 'mes:mes_md_workstation_worker:update', 3, NOW(), NOW()),
('menu-mes-md-workstation-worker-delete', 'menu-mes-md-workstation-worker', '删除MES 人力资源', 'BUTTON', 'ACTIVE', 'mes:mes_md_workstation_worker:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-md-workstation-worker'),
('1', 'menu-mes-md-workstation-worker-query'),
('1', 'menu-mes-md-workstation-worker-create'),
('1', 'menu-mes-md-workstation-worker-update'),
('1', 'menu-mes-md-workstation-worker-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-md-workstation-worker'),
('1', 'menu-mes-md-workstation-worker-query'),
('1', 'menu-mes-md-workstation-worker-create'),
('1', 'menu-mes-md-workstation-worker-update'),
('1', 'menu-mes-md-workstation-worker-delete')
ON CONFLICT DO NOTHING;
