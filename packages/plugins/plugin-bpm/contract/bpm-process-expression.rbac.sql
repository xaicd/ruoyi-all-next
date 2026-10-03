-- ============================================================
-- Auto-generated RBAC & Menu Migration for BpmProcessExpression（源框架导入） (BpmProcessExpression)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-bpm-process-expression',
  'bpm-dir',
  'BpmProcessExpression（源框架导入）管理',
  '/admin/bpm/bpm-process-expression',
  'bpm/bpm-process-expression/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'bpm:bpm_process_expression:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-bpm-process-expression-query',  'menu-bpm-process-expression', '查询BpmProcessExpression（源框架导入）', 'BUTTON', 'ACTIVE', 'bpm:bpm_process_expression:query',  1, NOW(), NOW()),
('menu-bpm-process-expression-create', 'menu-bpm-process-expression', '新增BpmProcessExpression（源框架导入）', 'BUTTON', 'ACTIVE', 'bpm:bpm_process_expression:create', 2, NOW(), NOW()),
('menu-bpm-process-expression-update', 'menu-bpm-process-expression', '修改BpmProcessExpression（源框架导入）', 'BUTTON', 'ACTIVE', 'bpm:bpm_process_expression:update', 3, NOW(), NOW()),
('menu-bpm-process-expression-delete', 'menu-bpm-process-expression', '删除BpmProcessExpression（源框架导入）', 'BUTTON', 'ACTIVE', 'bpm:bpm_process_expression:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-bpm-process-expression'),
('1', 'menu-bpm-process-expression-query'),
('1', 'menu-bpm-process-expression-create'),
('1', 'menu-bpm-process-expression-update'),
('1', 'menu-bpm-process-expression-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-bpm-process-expression'),
('1', 'menu-bpm-process-expression-query'),
('1', 'menu-bpm-process-expression-create'),
('1', 'menu-bpm-process-expression-update'),
('1', 'menu-bpm-process-expression-delete')
ON CONFLICT DO NOTHING;
