-- ============================================================
-- Auto-generated RBAC & Menu Migration for 流程抄送 (BpmProcessInstanceCopy)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-bpm-process-instance-copy',
  'bpm-dir',
  '流程抄送管理',
  '/admin/bpm/bpm-process-instance-copy',
  'bpm/bpm-process-instance-copy/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'bpm:bpm_process_instance_copy:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-bpm-process-instance-copy-query',  'menu-bpm-process-instance-copy', '查询流程抄送', 'BUTTON', 'ACTIVE', 'bpm:bpm_process_instance_copy:query',  1, NOW(), NOW()),
('menu-bpm-process-instance-copy-create', 'menu-bpm-process-instance-copy', '新增流程抄送', 'BUTTON', 'ACTIVE', 'bpm:bpm_process_instance_copy:create', 2, NOW(), NOW()),
('menu-bpm-process-instance-copy-update', 'menu-bpm-process-instance-copy', '修改流程抄送', 'BUTTON', 'ACTIVE', 'bpm:bpm_process_instance_copy:update', 3, NOW(), NOW()),
('menu-bpm-process-instance-copy-delete', 'menu-bpm-process-instance-copy', '删除流程抄送', 'BUTTON', 'ACTIVE', 'bpm:bpm_process_instance_copy:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-bpm-process-instance-copy'),
('1', 'menu-bpm-process-instance-copy-query'),
('1', 'menu-bpm-process-instance-copy-create'),
('1', 'menu-bpm-process-instance-copy-update'),
('1', 'menu-bpm-process-instance-copy-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-bpm-process-instance-copy'),
('1', 'menu-bpm-process-instance-copy-query'),
('1', 'menu-bpm-process-instance-copy-create'),
('1', 'menu-bpm-process-instance-copy-update'),
('1', 'menu-bpm-process-instance-copy-delete')
ON CONFLICT DO NOTHING;
