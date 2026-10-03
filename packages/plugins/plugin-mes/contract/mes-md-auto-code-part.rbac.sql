-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesMdAutoCodePart（源框架导入） (MesMdAutoCodePart)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-md-auto-code-part',
  'mes-dir',
  'MesMdAutoCodePart（源框架导入）管理',
  '/admin/mes/mes-md-auto-code-part',
  'mes/mes-md-auto-code-part/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_md_auto_code_part:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-md-auto-code-part-query',  'menu-mes-md-auto-code-part', '查询MesMdAutoCodePart（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_auto_code_part:query',  1, NOW(), NOW()),
('menu-mes-md-auto-code-part-create', 'menu-mes-md-auto-code-part', '新增MesMdAutoCodePart（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_auto_code_part:create', 2, NOW(), NOW()),
('menu-mes-md-auto-code-part-update', 'menu-mes-md-auto-code-part', '修改MesMdAutoCodePart（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_auto_code_part:update', 3, NOW(), NOW()),
('menu-mes-md-auto-code-part-delete', 'menu-mes-md-auto-code-part', '删除MesMdAutoCodePart（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_auto_code_part:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-md-auto-code-part'),
('1', 'menu-mes-md-auto-code-part-query'),
('1', 'menu-mes-md-auto-code-part-create'),
('1', 'menu-mes-md-auto-code-part-update'),
('1', 'menu-mes-md-auto-code-part-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-md-auto-code-part'),
('1', 'menu-mes-md-auto-code-part-query'),
('1', 'menu-mes-md-auto-code-part-create'),
('1', 'menu-mes-md-auto-code-part-update'),
('1', 'menu-mes-md-auto-code-part-delete')
ON CONFLICT DO NOTHING;
