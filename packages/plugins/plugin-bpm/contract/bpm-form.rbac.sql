-- ============================================================
-- Auto-generated RBAC & Menu Migration for BPM 工作流的表单定义用于工作流的申请表单，需要动态配置的场景 (BpmForm)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-bpm-form',
  'bpm-dir',
  'BPM 工作流的表单定义用于工作流的申请表单，需要动态配置的场景管理',
  '/admin/bpm/bpm-form',
  'bpm/bpm-form/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'bpm:bpm_form:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-bpm-form-query',  'menu-bpm-form', '查询BPM 工作流的表单定义用于工作流的申请表单，需要动态配置的场景', 'BUTTON', 'ACTIVE', 'bpm:bpm_form:query',  1, NOW(), NOW()),
('menu-bpm-form-create', 'menu-bpm-form', '新增BPM 工作流的表单定义用于工作流的申请表单，需要动态配置的场景', 'BUTTON', 'ACTIVE', 'bpm:bpm_form:create', 2, NOW(), NOW()),
('menu-bpm-form-update', 'menu-bpm-form', '修改BPM 工作流的表单定义用于工作流的申请表单，需要动态配置的场景', 'BUTTON', 'ACTIVE', 'bpm:bpm_form:update', 3, NOW(), NOW()),
('menu-bpm-form-delete', 'menu-bpm-form', '删除BPM 工作流的表单定义用于工作流的申请表单，需要动态配置的场景', 'BUTTON', 'ACTIVE', 'bpm:bpm_form:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-bpm-form'),
('1', 'menu-bpm-form-query'),
('1', 'menu-bpm-form-create'),
('1', 'menu-bpm-form-update'),
('1', 'menu-bpm-form-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-bpm-form'),
('1', 'menu-bpm-form-query'),
('1', 'menu-bpm-form-create'),
('1', 'menu-bpm-form-update'),
('1', 'menu-bpm-form-delete')
ON CONFLICT DO NOTHING;
