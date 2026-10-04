-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 用户工作站绑定关系（当前快照） (MesProWorkRecord)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-pro-work-record',
  'mes-dir',
  'MES 用户工作站绑定关系（当前快照）管理',
  '/admin/mes/mes-pro-work-record',
  'mes/mes-pro-work-record/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_pro_work_record:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-pro-work-record-query',  'menu-mes-pro-work-record', '查询MES 用户工作站绑定关系（当前快照）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_work_record:query',  1, NOW(), NOW()),
('menu-mes-pro-work-record-create', 'menu-mes-pro-work-record', '新增MES 用户工作站绑定关系（当前快照）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_work_record:create', 2, NOW(), NOW()),
('menu-mes-pro-work-record-update', 'menu-mes-pro-work-record', '修改MES 用户工作站绑定关系（当前快照）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_work_record:update', 3, NOW(), NOW()),
('menu-mes-pro-work-record-delete', 'menu-mes-pro-work-record', '删除MES 用户工作站绑定关系（当前快照）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_work_record:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-pro-work-record-rm',        '1', 'menu-mes-pro-work-record'),
('menu-mes-pro-work-record-rm-query',  '1', 'menu-mes-pro-work-record-query'),
('menu-mes-pro-work-record-rm-create', '1', 'menu-mes-pro-work-record-create'),
('menu-mes-pro-work-record-rm-update', '1', 'menu-mes-pro-work-record-update'),
('menu-mes-pro-work-record-rm-delete', '1', 'menu-mes-pro-work-record-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-pro-work-record-pm',        '1', 'menu-mes-pro-work-record'),
('menu-mes-pro-work-record-pm-query',  '1', 'menu-mes-pro-work-record-query'),
('menu-mes-pro-work-record-pm-create', '1', 'menu-mes-pro-work-record-create'),
('menu-mes-pro-work-record-pm-update', '1', 'menu-mes-pro-work-record-update'),
('menu-mes-pro-work-record-pm-delete', '1', 'menu-mes-pro-work-record-delete')
ON CONFLICT DO NOTHING;
