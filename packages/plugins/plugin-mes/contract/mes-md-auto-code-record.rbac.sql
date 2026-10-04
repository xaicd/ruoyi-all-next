-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 编码生成记录 (MesMdAutoCodeRecord)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-md-auto-code-record',
  'mes-dir',
  'MES 编码生成记录管理',
  '/admin/mes/mes-md-auto-code-record',
  'mes/mes-md-auto-code-record/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_md_auto_code_record:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-md-auto-code-record-query',  'menu-mes-md-auto-code-record', '查询MES 编码生成记录', 'BUTTON', 'ACTIVE', 'mes:mes_md_auto_code_record:query',  1, NOW(), NOW()),
('menu-mes-md-auto-code-record-create', 'menu-mes-md-auto-code-record', '新增MES 编码生成记录', 'BUTTON', 'ACTIVE', 'mes:mes_md_auto_code_record:create', 2, NOW(), NOW()),
('menu-mes-md-auto-code-record-update', 'menu-mes-md-auto-code-record', '修改MES 编码生成记录', 'BUTTON', 'ACTIVE', 'mes:mes_md_auto_code_record:update', 3, NOW(), NOW()),
('menu-mes-md-auto-code-record-delete', 'menu-mes-md-auto-code-record', '删除MES 编码生成记录', 'BUTTON', 'ACTIVE', 'mes:mes_md_auto_code_record:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-md-auto-code-record-rm',        '1', 'menu-mes-md-auto-code-record'),
('menu-mes-md-auto-code-record-rm-query',  '1', 'menu-mes-md-auto-code-record-query'),
('menu-mes-md-auto-code-record-rm-create', '1', 'menu-mes-md-auto-code-record-create'),
('menu-mes-md-auto-code-record-rm-update', '1', 'menu-mes-md-auto-code-record-update'),
('menu-mes-md-auto-code-record-rm-delete', '1', 'menu-mes-md-auto-code-record-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-md-auto-code-record-pm',        '1', 'menu-mes-md-auto-code-record'),
('menu-mes-md-auto-code-record-pm-query',  '1', 'menu-mes-md-auto-code-record-query'),
('menu-mes-md-auto-code-record-pm-create', '1', 'menu-mes-md-auto-code-record-create'),
('menu-mes-md-auto-code-record-pm-update', '1', 'menu-mes-md-auto-code-record-update'),
('menu-mes-md-auto-code-record-pm-delete', '1', 'menu-mes-md-auto-code-record-delete')
ON CONFLICT DO NOTHING;
