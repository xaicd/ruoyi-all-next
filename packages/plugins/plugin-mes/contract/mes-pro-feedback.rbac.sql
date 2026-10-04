-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 生产报工 (MesProFeedback)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-pro-feedback',
  'mes-dir',
  'MES 生产报工管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-pro-feedback-query',  'menu-mes-pro-feedback', '查询MES 生产报工', 'BUTTON', 'ACTIVE', 'mes:mes_pro_feedback:query',  1, NOW(), NOW()),
('menu-mes-pro-feedback-create', 'menu-mes-pro-feedback', '新增MES 生产报工', 'BUTTON', 'ACTIVE', 'mes:mes_pro_feedback:create', 2, NOW(), NOW()),
('menu-mes-pro-feedback-update', 'menu-mes-pro-feedback', '修改MES 生产报工', 'BUTTON', 'ACTIVE', 'mes:mes_pro_feedback:update', 3, NOW(), NOW()),
('menu-mes-pro-feedback-delete', 'menu-mes-pro-feedback', '删除MES 生产报工', 'BUTTON', 'ACTIVE', 'mes:mes_pro_feedback:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-pro-feedback-rm',        '1', 'menu-mes-pro-feedback'),
('menu-mes-pro-feedback-rm-query',  '1', 'menu-mes-pro-feedback-query'),
('menu-mes-pro-feedback-rm-create', '1', 'menu-mes-pro-feedback-create'),
('menu-mes-pro-feedback-rm-update', '1', 'menu-mes-pro-feedback-update'),
('menu-mes-pro-feedback-rm-delete', '1', 'menu-mes-pro-feedback-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-pro-feedback-pm',        '1', 'menu-mes-pro-feedback'),
('menu-mes-pro-feedback-pm-query',  '1', 'menu-mes-pro-feedback-query'),
('menu-mes-pro-feedback-pm-create', '1', 'menu-mes-pro-feedback-create'),
('menu-mes-pro-feedback-pm-update', '1', 'menu-mes-pro-feedback-update'),
('menu-mes-pro-feedback-pm-delete', '1', 'menu-mes-pro-feedback-delete')
ON CONFLICT DO NOTHING;
