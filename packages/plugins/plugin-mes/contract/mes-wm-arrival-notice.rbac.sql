-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesWmArrivalNotice（源框架导入） (MesWmArrivalNotice)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-wm-arrival-notice',
  'mes-dir',
  'MesWmArrivalNotice（源框架导入）管理',
  '/admin/mes/mes-wm-arrival-notice',
  'mes/mes-wm-arrival-notice/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_arrival_notice:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-wm-arrival-notice-query',  'menu-mes-wm-arrival-notice', '查询MesWmArrivalNotice（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_arrival_notice:query',  1, NOW(), NOW()),
('menu-mes-wm-arrival-notice-create', 'menu-mes-wm-arrival-notice', '新增MesWmArrivalNotice（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_arrival_notice:create', 2, NOW(), NOW()),
('menu-mes-wm-arrival-notice-update', 'menu-mes-wm-arrival-notice', '修改MesWmArrivalNotice（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_arrival_notice:update', 3, NOW(), NOW()),
('menu-mes-wm-arrival-notice-delete', 'menu-mes-wm-arrival-notice', '删除MesWmArrivalNotice（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_arrival_notice:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-wm-arrival-notice'),
('1', 'menu-mes-wm-arrival-notice-query'),
('1', 'menu-mes-wm-arrival-notice-create'),
('1', 'menu-mes-wm-arrival-notice-update'),
('1', 'menu-mes-wm-arrival-notice-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-wm-arrival-notice'),
('1', 'menu-mes-wm-arrival-notice-query'),
('1', 'menu-mes-wm-arrival-notice-create'),
('1', 'menu-mes-wm-arrival-notice-update'),
('1', 'menu-mes-wm-arrival-notice-delete')
ON CONFLICT DO NOTHING;
