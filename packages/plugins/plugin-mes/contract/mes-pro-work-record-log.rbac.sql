-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 上下工记录流水 (MesProWorkRecordLog)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-pro-work-record-log',
  'mes-dir',
  'MES 上下工记录流水管理',
  '/admin/mes/mes-pro-work-record-log',
  'mes/mes-pro-work-record-log/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_pro_work_record_log:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-pro-work-record-log-query',  'menu-mes-pro-work-record-log', '查询MES 上下工记录流水', 'BUTTON', 'ACTIVE', 'mes:mes_pro_work_record_log:query',  1, NOW(), NOW()),
('menu-mes-pro-work-record-log-create', 'menu-mes-pro-work-record-log', '新增MES 上下工记录流水', 'BUTTON', 'ACTIVE', 'mes:mes_pro_work_record_log:create', 2, NOW(), NOW()),
('menu-mes-pro-work-record-log-update', 'menu-mes-pro-work-record-log', '修改MES 上下工记录流水', 'BUTTON', 'ACTIVE', 'mes:mes_pro_work_record_log:update', 3, NOW(), NOW()),
('menu-mes-pro-work-record-log-delete', 'menu-mes-pro-work-record-log', '删除MES 上下工记录流水', 'BUTTON', 'ACTIVE', 'mes:mes_pro_work_record_log:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-pro-work-record-log-rm',        '1', 'menu-mes-pro-work-record-log'),
('menu-mes-pro-work-record-log-rm-query',  '1', 'menu-mes-pro-work-record-log-query'),
('menu-mes-pro-work-record-log-rm-create', '1', 'menu-mes-pro-work-record-log-create'),
('menu-mes-pro-work-record-log-rm-update', '1', 'menu-mes-pro-work-record-log-update'),
('menu-mes-pro-work-record-log-rm-delete', '1', 'menu-mes-pro-work-record-log-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-pro-work-record-log-pm',        '1', 'menu-mes-pro-work-record-log'),
('menu-mes-pro-work-record-log-pm-query',  '1', 'menu-mes-pro-work-record-log-query'),
('menu-mes-pro-work-record-log-pm-create', '1', 'menu-mes-pro-work-record-log-create'),
('menu-mes-pro-work-record-log-pm-update', '1', 'menu-mes-pro-work-record-log-update'),
('menu-mes-pro-work-record-log-pm-delete', '1', 'menu-mes-pro-work-record-log-delete')
ON CONFLICT DO NOTHING;
