-- ============================================================
-- Auto-generated RBAC & Menu Migration for BPM 流程监听器 DO目的：本质上它是流程监听器的模版，用于 BPMN 在设计 (BpmProcessListener)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-bpm-process-listener',
  'bpm-dir',
  'BPM 流程监听器 DO目的：本质上它是流程监听器的模版，用于 BPMN 在设计管理',
  '/admin/bpm/bpm-process-listener',
  'bpm/bpm-process-listener/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'bpm:bpm_process_listener:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-bpm-process-listener-query',  'menu-bpm-process-listener', '查询BPM 流程监听器 DO目的：本质上它是流程监听器的模版，用于 BPMN 在设计', 'BUTTON', 'ACTIVE', 'bpm:bpm_process_listener:query',  1, NOW(), NOW()),
('menu-bpm-process-listener-create', 'menu-bpm-process-listener', '新增BPM 流程监听器 DO目的：本质上它是流程监听器的模版，用于 BPMN 在设计', 'BUTTON', 'ACTIVE', 'bpm:bpm_process_listener:create', 2, NOW(), NOW()),
('menu-bpm-process-listener-update', 'menu-bpm-process-listener', '修改BPM 流程监听器 DO目的：本质上它是流程监听器的模版，用于 BPMN 在设计', 'BUTTON', 'ACTIVE', 'bpm:bpm_process_listener:update', 3, NOW(), NOW()),
('menu-bpm-process-listener-delete', 'menu-bpm-process-listener', '删除BPM 流程监听器 DO目的：本质上它是流程监听器的模版，用于 BPMN 在设计', 'BUTTON', 'ACTIVE', 'bpm:bpm_process_listener:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-bpm-process-listener-rm',        '1', 'menu-bpm-process-listener'),
('menu-bpm-process-listener-rm-query',  '1', 'menu-bpm-process-listener-query'),
('menu-bpm-process-listener-rm-create', '1', 'menu-bpm-process-listener-create'),
('menu-bpm-process-listener-rm-update', '1', 'menu-bpm-process-listener-update'),
('menu-bpm-process-listener-rm-delete', '1', 'menu-bpm-process-listener-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-bpm-process-listener-pm',        '1', 'menu-bpm-process-listener'),
('menu-bpm-process-listener-pm-query',  '1', 'menu-bpm-process-listener-query'),
('menu-bpm-process-listener-pm-create', '1', 'menu-bpm-process-listener-create'),
('menu-bpm-process-listener-pm-update', '1', 'menu-bpm-process-listener-update'),
('menu-bpm-process-listener-pm-delete', '1', 'menu-bpm-process-listener-delete')
ON CONFLICT DO NOTHING;
