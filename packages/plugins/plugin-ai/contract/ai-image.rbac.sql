-- ============================================================
-- Auto-generated RBAC & Menu Migration for AI 绘画 (AiImage)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-ai-image',
  'ai-dir',
  'AI 绘画管理',
  '/admin/ai/ai-image',
  'ai/ai-image/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'ai:ai_image:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-ai-image-query',  'menu-ai-image', '查询AI 绘画', 'BUTTON', 'ACTIVE', 'ai:ai_image:query',  1, NOW(), NOW()),
('menu-ai-image-create', 'menu-ai-image', '新增AI 绘画', 'BUTTON', 'ACTIVE', 'ai:ai_image:create', 2, NOW(), NOW()),
('menu-ai-image-update', 'menu-ai-image', '修改AI 绘画', 'BUTTON', 'ACTIVE', 'ai:ai_image:update', 3, NOW(), NOW()),
('menu-ai-image-delete', 'menu-ai-image', '删除AI 绘画', 'BUTTON', 'ACTIVE', 'ai:ai_image:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-ai-image-rm',        '1', 'menu-ai-image'),
('menu-ai-image-rm-query',  '1', 'menu-ai-image-query'),
('menu-ai-image-rm-create', '1', 'menu-ai-image-create'),
('menu-ai-image-rm-update', '1', 'menu-ai-image-update'),
('menu-ai-image-rm-delete', '1', 'menu-ai-image-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-ai-image-pm',        '1', 'menu-ai-image'),
('menu-ai-image-pm-query',  '1', 'menu-ai-image-query'),
('menu-ai-image-pm-create', '1', 'menu-ai-image-create'),
('menu-ai-image-pm-update', '1', 'menu-ai-image-update'),
('menu-ai-image-pm-delete', '1', 'menu-ai-image-delete')
ON CONFLICT DO NOTHING;
