-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesMdAutoCodeRule（源框架导入） (MesMdAutoCodeRule)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-md-auto-code-rule',
  'mes-dir',
  'MesMdAutoCodeRule（源框架导入）管理',
  '/admin/mes/mes-md-auto-code-rule',
  'mes/mes-md-auto-code-rule/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_md_auto_code_rule:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-md-auto-code-rule-query',  'menu-mes-md-auto-code-rule', '查询MesMdAutoCodeRule（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_auto_code_rule:query',  1, NOW(), NOW()),
('menu-mes-md-auto-code-rule-create', 'menu-mes-md-auto-code-rule', '新增MesMdAutoCodeRule（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_auto_code_rule:create', 2, NOW(), NOW()),
('menu-mes-md-auto-code-rule-update', 'menu-mes-md-auto-code-rule', '修改MesMdAutoCodeRule（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_auto_code_rule:update', 3, NOW(), NOW()),
('menu-mes-md-auto-code-rule-delete', 'menu-mes-md-auto-code-rule', '删除MesMdAutoCodeRule（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_auto_code_rule:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-md-auto-code-rule'),
('1', 'menu-mes-md-auto-code-rule-query'),
('1', 'menu-mes-md-auto-code-rule-create'),
('1', 'menu-mes-md-auto-code-rule-update'),
('1', 'menu-mes-md-auto-code-rule-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-md-auto-code-rule'),
('1', 'menu-mes-md-auto-code-rule-query'),
('1', 'menu-mes-md-auto-code-rule-create'),
('1', 'menu-mes-md-auto-code-rule-update'),
('1', 'menu-mes-md-auto-code-rule-delete')
ON CONFLICT DO NOTHING;
