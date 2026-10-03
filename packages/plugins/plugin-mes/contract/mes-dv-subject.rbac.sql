-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesDvSubject（源框架导入） (MesDvSubject)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-dv-subject',
  'mes-dir',
  'MesDvSubject（源框架导入）管理',
  '/admin/mes/mes-dv-subject',
  'mes/mes-dv-subject/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_dv_subject:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-dv-subject-query',  'menu-mes-dv-subject', '查询MesDvSubject（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_dv_subject:query',  1, NOW(), NOW()),
('menu-mes-dv-subject-create', 'menu-mes-dv-subject', '新增MesDvSubject（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_dv_subject:create', 2, NOW(), NOW()),
('menu-mes-dv-subject-update', 'menu-mes-dv-subject', '修改MesDvSubject（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_dv_subject:update', 3, NOW(), NOW()),
('menu-mes-dv-subject-delete', 'menu-mes-dv-subject', '删除MesDvSubject（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_dv_subject:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-dv-subject'),
('1', 'menu-mes-dv-subject-query'),
('1', 'menu-mes-dv-subject-create'),
('1', 'menu-mes-dv-subject-update'),
('1', 'menu-mes-dv-subject-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-dv-subject'),
('1', 'menu-mes-dv-subject-query'),
('1', 'menu-mes-dv-subject-create'),
('1', 'menu-mes-dv-subject-update'),
('1', 'menu-mes-dv-subject-delete')
ON CONFLICT DO NOTHING;
