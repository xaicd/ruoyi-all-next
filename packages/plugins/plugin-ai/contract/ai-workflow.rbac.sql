-- ============================================================
-- Auto-generated RBAC & Menu Migration for AI 工作流 (AiWorkflow)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-ai-workflow',
  'ai-dir',
  'AI 工作流管理',
  '/admin/ai/ai-workflow',
  'ai/ai-workflow/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'ai:ai_workflow:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-ai-workflow-query',  'menu-ai-workflow', '查询AI 工作流', 'BUTTON', 'ACTIVE', 'ai:ai_workflow:query',  1, NOW(), NOW()),
('menu-ai-workflow-create', 'menu-ai-workflow', '新增AI 工作流', 'BUTTON', 'ACTIVE', 'ai:ai_workflow:create', 2, NOW(), NOW()),
('menu-ai-workflow-update', 'menu-ai-workflow', '修改AI 工作流', 'BUTTON', 'ACTIVE', 'ai:ai_workflow:update', 3, NOW(), NOW()),
('menu-ai-workflow-delete', 'menu-ai-workflow', '删除AI 工作流', 'BUTTON', 'ACTIVE', 'ai:ai_workflow:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-ai-workflow-rm',        '1', 'menu-ai-workflow'),
('menu-ai-workflow-rm-query',  '1', 'menu-ai-workflow-query'),
('menu-ai-workflow-rm-create', '1', 'menu-ai-workflow-create'),
('menu-ai-workflow-rm-update', '1', 'menu-ai-workflow-update'),
('menu-ai-workflow-rm-delete', '1', 'menu-ai-workflow-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-ai-workflow-pm',        '1', 'menu-ai-workflow'),
('menu-ai-workflow-pm-query',  '1', 'menu-ai-workflow-query'),
('menu-ai-workflow-pm-create', '1', 'menu-ai-workflow-create'),
('menu-ai-workflow-pm-update', '1', 'menu-ai-workflow-update'),
('menu-ai-workflow-pm-delete', '1', 'menu-ai-workflow-delete')
ON CONFLICT DO NOTHING;
