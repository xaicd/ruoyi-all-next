-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 编码规则 (MesMdAutoCodeRule)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-md-auto-code-rule',
  'mes-dir',
  'MES 编码规则管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-md-auto-code-rule-query',  'menu-mes-md-auto-code-rule', '查询MES 编码规则', 'BUTTON', 'ACTIVE', 'mes:mes_md_auto_code_rule:query',  1, NOW(), NOW()),
('menu-mes-md-auto-code-rule-create', 'menu-mes-md-auto-code-rule', '新增MES 编码规则', 'BUTTON', 'ACTIVE', 'mes:mes_md_auto_code_rule:create', 2, NOW(), NOW()),
('menu-mes-md-auto-code-rule-update', 'menu-mes-md-auto-code-rule', '修改MES 编码规则', 'BUTTON', 'ACTIVE', 'mes:mes_md_auto_code_rule:update', 3, NOW(), NOW()),
('menu-mes-md-auto-code-rule-delete', 'menu-mes-md-auto-code-rule', '删除MES 编码规则', 'BUTTON', 'ACTIVE', 'mes:mes_md_auto_code_rule:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-md-auto-code-rule-rm',        '1', 'menu-mes-md-auto-code-rule'),
('menu-mes-md-auto-code-rule-rm-query',  '1', 'menu-mes-md-auto-code-rule-query'),
('menu-mes-md-auto-code-rule-rm-create', '1', 'menu-mes-md-auto-code-rule-create'),
('menu-mes-md-auto-code-rule-rm-update', '1', 'menu-mes-md-auto-code-rule-update'),
('menu-mes-md-auto-code-rule-rm-delete', '1', 'menu-mes-md-auto-code-rule-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-md-auto-code-rule-pm',        '1', 'menu-mes-md-auto-code-rule'),
('menu-mes-md-auto-code-rule-pm-query',  '1', 'menu-mes-md-auto-code-rule-query'),
('menu-mes-md-auto-code-rule-pm-create', '1', 'menu-mes-md-auto-code-rule-create'),
('menu-mes-md-auto-code-rule-pm-update', '1', 'menu-mes-md-auto-code-rule-update'),
('menu-mes-md-auto-code-rule-pm-delete', '1', 'menu-mes-md-auto-code-rule-delete')
ON CONFLICT DO NOTHING;
