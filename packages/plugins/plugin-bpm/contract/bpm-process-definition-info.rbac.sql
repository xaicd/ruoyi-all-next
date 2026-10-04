-- ============================================================
-- Auto-generated RBAC & Menu Migration for BPM 流程定义的拓信息主要解决 Flowable 不支持拓展字段，所以新建该表 (BpmProcessDefinitionInfo)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-bpm-process-definition-info',
  'bpm-dir',
  'BPM 流程定义的拓信息主要解决 Flowable 不支持拓展字段，所以新建该表管理',
  '/admin/bpm/bpm-process-definition-info',
  'bpm/bpm-process-definition-info/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'bpm:bpm_process_definition_info:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-bpm-process-definition-info-query',  'menu-bpm-process-definition-info', '查询BPM 流程定义的拓信息主要解决 Flowable 不支持拓展字段，所以新建该表', 'BUTTON', 'ACTIVE', 'bpm:bpm_process_definition_info:query',  1, NOW(), NOW()),
('menu-bpm-process-definition-info-create', 'menu-bpm-process-definition-info', '新增BPM 流程定义的拓信息主要解决 Flowable 不支持拓展字段，所以新建该表', 'BUTTON', 'ACTIVE', 'bpm:bpm_process_definition_info:create', 2, NOW(), NOW()),
('menu-bpm-process-definition-info-update', 'menu-bpm-process-definition-info', '修改BPM 流程定义的拓信息主要解决 Flowable 不支持拓展字段，所以新建该表', 'BUTTON', 'ACTIVE', 'bpm:bpm_process_definition_info:update', 3, NOW(), NOW()),
('menu-bpm-process-definition-info-delete', 'menu-bpm-process-definition-info', '删除BPM 流程定义的拓信息主要解决 Flowable 不支持拓展字段，所以新建该表', 'BUTTON', 'ACTIVE', 'bpm:bpm_process_definition_info:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-bpm-process-definition-info-rm',        '1', 'menu-bpm-process-definition-info'),
('menu-bpm-process-definition-info-rm-query',  '1', 'menu-bpm-process-definition-info-query'),
('menu-bpm-process-definition-info-rm-create', '1', 'menu-bpm-process-definition-info-create'),
('menu-bpm-process-definition-info-rm-update', '1', 'menu-bpm-process-definition-info-update'),
('menu-bpm-process-definition-info-rm-delete', '1', 'menu-bpm-process-definition-info-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-bpm-process-definition-info-pm',        '1', 'menu-bpm-process-definition-info'),
('menu-bpm-process-definition-info-pm-query',  '1', 'menu-bpm-process-definition-info-query'),
('menu-bpm-process-definition-info-pm-create', '1', 'menu-bpm-process-definition-info-create'),
('menu-bpm-process-definition-info-pm-update', '1', 'menu-bpm-process-definition-info-update'),
('menu-bpm-process-definition-info-pm-delete', '1', 'menu-bpm-process-definition-info-delete')
ON CONFLICT DO NOTHING;
