-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesProFeedback（源框架导入） (MesProFeedback)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-pro-feedback',
  'mes-dir',
  'MesProFeedback（源框架导入）管理',
  '/admin/mes/mes-pro-feedback',
  'mes/mes-pro-feedback/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_pro_feedback:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-pro-feedback-query',  'menu-mes-pro-feedback', '查询MesProFeedback（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_feedback:query',  1, NOW(), NOW()),
('menu-mes-pro-feedback-create', 'menu-mes-pro-feedback', '新增MesProFeedback（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_feedback:create', 2, NOW(), NOW()),
('menu-mes-pro-feedback-update', 'menu-mes-pro-feedback', '修改MesProFeedback（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_feedback:update', 3, NOW(), NOW()),
('menu-mes-pro-feedback-delete', 'menu-mes-pro-feedback', '删除MesProFeedback（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_feedback:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-pro-feedback'),
('1', 'menu-mes-pro-feedback-query'),
('1', 'menu-mes-pro-feedback-create'),
('1', 'menu-mes-pro-feedback-update'),
('1', 'menu-mes-pro-feedback-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-pro-feedback'),
('1', 'menu-mes-pro-feedback-query'),
('1', 'menu-mes-pro-feedback-create'),
('1', 'menu-mes-pro-feedback-update'),
('1', 'menu-mes-pro-feedback-delete')
ON CONFLICT DO NOTHING;
