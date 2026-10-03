-- ============================================================
-- Auto-generated RBAC & Menu Migration for KeFuConversation（源框架导入） (KeFuConversation)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-ke-fu-conversation',
  'mall-dir',
  'KeFuConversation（源框架导入）管理',
  '/admin/mall/ke-fu-conversation',
  'mall/ke-fu-conversation/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:ke_fu_conversation:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-ke-fu-conversation-query',  'menu-ke-fu-conversation', '查询KeFuConversation（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:ke_fu_conversation:query',  1, NOW(), NOW()),
('menu-ke-fu-conversation-create', 'menu-ke-fu-conversation', '新增KeFuConversation（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:ke_fu_conversation:create', 2, NOW(), NOW()),
('menu-ke-fu-conversation-update', 'menu-ke-fu-conversation', '修改KeFuConversation（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:ke_fu_conversation:update', 3, NOW(), NOW()),
('menu-ke-fu-conversation-delete', 'menu-ke-fu-conversation', '删除KeFuConversation（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:ke_fu_conversation:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-ke-fu-conversation'),
('1', 'menu-ke-fu-conversation-query'),
('1', 'menu-ke-fu-conversation-create'),
('1', 'menu-ke-fu-conversation-update'),
('1', 'menu-ke-fu-conversation-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-ke-fu-conversation'),
('1', 'menu-ke-fu-conversation-query'),
('1', 'menu-ke-fu-conversation-create'),
('1', 'menu-ke-fu-conversation-update'),
('1', 'menu-ke-fu-conversation-delete')
ON CONFLICT DO NOTHING;
