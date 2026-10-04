-- ============================================================
-- Auto-generated RBAC & Menu Migration for AI 模型 DO默认模型： 为开启，并且 排序第一 (AiModel)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-ai-model',
  'ai-dir',
  'AI 模型 DO默认模型： 为开启，并且 排序第一管理',
  '/admin/ai/ai-model',
  'ai/ai-model/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'ai:ai_model:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-ai-model-query',  'menu-ai-model', '查询AI 模型 DO默认模型： 为开启，并且 排序第一', 'BUTTON', 'ACTIVE', 'ai:ai_model:query',  1, NOW(), NOW()),
('menu-ai-model-create', 'menu-ai-model', '新增AI 模型 DO默认模型： 为开启，并且 排序第一', 'BUTTON', 'ACTIVE', 'ai:ai_model:create', 2, NOW(), NOW()),
('menu-ai-model-update', 'menu-ai-model', '修改AI 模型 DO默认模型： 为开启，并且 排序第一', 'BUTTON', 'ACTIVE', 'ai:ai_model:update', 3, NOW(), NOW()),
('menu-ai-model-delete', 'menu-ai-model', '删除AI 模型 DO默认模型： 为开启，并且 排序第一', 'BUTTON', 'ACTIVE', 'ai:ai_model:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-ai-model'),
('1', 'menu-ai-model-query'),
('1', 'menu-ai-model-create'),
('1', 'menu-ai-model-update'),
('1', 'menu-ai-model-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-ai-model'),
('1', 'menu-ai-model-query'),
('1', 'menu-ai-model-create'),
('1', 'menu-ai-model-update'),
('1', 'menu-ai-model-delete')
ON CONFLICT DO NOTHING;
