-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesWmProductIssue（源框架导入） (MesWmProductIssue)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-wm-product-issue',
  'mes-dir',
  'MesWmProductIssue（源框架导入）管理',
  '/admin/mes/mes-wm-product-issue',
  'mes/mes-wm-product-issue/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_product_issue:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-wm-product-issue-query',  'menu-mes-wm-product-issue', '查询MesWmProductIssue（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_product_issue:query',  1, NOW(), NOW()),
('menu-mes-wm-product-issue-create', 'menu-mes-wm-product-issue', '新增MesWmProductIssue（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_product_issue:create', 2, NOW(), NOW()),
('menu-mes-wm-product-issue-update', 'menu-mes-wm-product-issue', '修改MesWmProductIssue（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_product_issue:update', 3, NOW(), NOW()),
('menu-mes-wm-product-issue-delete', 'menu-mes-wm-product-issue', '删除MesWmProductIssue（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_product_issue:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-wm-product-issue'),
('1', 'menu-mes-wm-product-issue-query'),
('1', 'menu-mes-wm-product-issue-create'),
('1', 'menu-mes-wm-product-issue-update'),
('1', 'menu-mes-wm-product-issue-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-wm-product-issue'),
('1', 'menu-mes-wm-product-issue-query'),
('1', 'menu-mes-wm-product-issue-create'),
('1', 'menu-mes-wm-product-issue-update'),
('1', 'menu-mes-wm-product-issue-delete')
ON CONFLICT DO NOTHING;
