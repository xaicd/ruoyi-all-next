-- ============================================================
-- Auto-generated RBAC & Menu Migration for KeFuMessage（源框架导入） (KeFuMessage)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-ke-fu-message',
  'mall-dir',
  'KeFuMessage（源框架导入）管理',
  '/admin/mall/ke-fu-message',
  'mall/ke-fu-message/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:ke_fu_message:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-ke-fu-message-query',  'menu-ke-fu-message', '查询KeFuMessage（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:ke_fu_message:query',  1, NOW(), NOW()),
('menu-ke-fu-message-create', 'menu-ke-fu-message', '新增KeFuMessage（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:ke_fu_message:create', 2, NOW(), NOW()),
('menu-ke-fu-message-update', 'menu-ke-fu-message', '修改KeFuMessage（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:ke_fu_message:update', 3, NOW(), NOW()),
('menu-ke-fu-message-delete', 'menu-ke-fu-message', '删除KeFuMessage（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:ke_fu_message:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-ke-fu-message'),
('1', 'menu-ke-fu-message-query'),
('1', 'menu-ke-fu-message-create'),
('1', 'menu-ke-fu-message-update'),
('1', 'menu-ke-fu-message-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-ke-fu-message'),
('1', 'menu-ke-fu-message-query'),
('1', 'menu-ke-fu-message-create'),
('1', 'menu-ke-fu-message-update'),
('1', 'menu-ke-fu-message-delete')
ON CONFLICT DO NOTHING;
