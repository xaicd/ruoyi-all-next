-- ============================================================
-- Auto-generated RBAC & Menu Migration for AiKnowledgeDocument（源框架导入） (AiKnowledgeDocument)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-ai-knowledge-document',
  'ai-dir',
  'AiKnowledgeDocument（源框架导入）管理',
  '/admin/ai/ai-knowledge-document',
  'ai/ai-knowledge-document/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'ai:ai_knowledge_document:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-ai-knowledge-document-query',  'menu-ai-knowledge-document', '查询AiKnowledgeDocument（源框架导入）', 'BUTTON', 'ACTIVE', 'ai:ai_knowledge_document:query',  1, NOW(), NOW()),
('menu-ai-knowledge-document-create', 'menu-ai-knowledge-document', '新增AiKnowledgeDocument（源框架导入）', 'BUTTON', 'ACTIVE', 'ai:ai_knowledge_document:create', 2, NOW(), NOW()),
('menu-ai-knowledge-document-update', 'menu-ai-knowledge-document', '修改AiKnowledgeDocument（源框架导入）', 'BUTTON', 'ACTIVE', 'ai:ai_knowledge_document:update', 3, NOW(), NOW()),
('menu-ai-knowledge-document-delete', 'menu-ai-knowledge-document', '删除AiKnowledgeDocument（源框架导入）', 'BUTTON', 'ACTIVE', 'ai:ai_knowledge_document:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-ai-knowledge-document'),
('1', 'menu-ai-knowledge-document-query'),
('1', 'menu-ai-knowledge-document-create'),
('1', 'menu-ai-knowledge-document-update'),
('1', 'menu-ai-knowledge-document-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-ai-knowledge-document'),
('1', 'menu-ai-knowledge-document-query'),
('1', 'menu-ai-knowledge-document-create'),
('1', 'menu-ai-knowledge-document-update'),
('1', 'menu-ai-knowledge-document-delete')
ON CONFLICT DO NOTHING;
