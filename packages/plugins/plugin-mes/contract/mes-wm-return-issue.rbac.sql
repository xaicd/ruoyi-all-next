-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 生产退料单 (MesWmReturnIssue)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-wm-return-issue',
  'mes-dir',
  'MES 生产退料单管理',
  '/admin/mes/mes-wm-return-issue',
  'mes/mes-wm-return-issue/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_return_issue:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-wm-return-issue-query',  'menu-mes-wm-return-issue', '查询MES 生产退料单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_issue:query',  1, NOW(), NOW()),
('menu-mes-wm-return-issue-create', 'menu-mes-wm-return-issue', '新增MES 生产退料单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_issue:create', 2, NOW(), NOW()),
('menu-mes-wm-return-issue-update', 'menu-mes-wm-return-issue', '修改MES 生产退料单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_issue:update', 3, NOW(), NOW()),
('menu-mes-wm-return-issue-delete', 'menu-mes-wm-return-issue', '删除MES 生产退料单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_issue:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-wm-return-issue'),
('1', 'menu-mes-wm-return-issue-query'),
('1', 'menu-mes-wm-return-issue-create'),
('1', 'menu-mes-wm-return-issue-update'),
('1', 'menu-mes-wm-return-issue-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-wm-return-issue'),
('1', 'menu-mes-wm-return-issue-query'),
('1', 'menu-mes-wm-return-issue-create'),
('1', 'menu-mes-wm-return-issue-update'),
('1', 'menu-mes-wm-return-issue-delete')
ON CONFLICT DO NOTHING;
