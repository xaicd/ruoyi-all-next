-- ============================================================
-- Auto-generated RBAC & Menu Migration for IM 用户私有表情 DO（个人表情包，对照微信「我的表情」） (ImFaceUserItem)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-im-face-user-item',
  'im-dir',
  'IM 用户私有表情 DO（个人表情包，对照微信「我的表情」）管理',
  '/admin/im/im-face-user-item',
  'im/im-face-user-item/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'im:im_face_user_item:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-im-face-user-item-query',  'menu-im-face-user-item', '查询IM 用户私有表情 DO（个人表情包，对照微信「我的表情」）', 'BUTTON', 'ACTIVE', 'im:im_face_user_item:query',  1, NOW(), NOW()),
('menu-im-face-user-item-create', 'menu-im-face-user-item', '新增IM 用户私有表情 DO（个人表情包，对照微信「我的表情」）', 'BUTTON', 'ACTIVE', 'im:im_face_user_item:create', 2, NOW(), NOW()),
('menu-im-face-user-item-update', 'menu-im-face-user-item', '修改IM 用户私有表情 DO（个人表情包，对照微信「我的表情」）', 'BUTTON', 'ACTIVE', 'im:im_face_user_item:update', 3, NOW(), NOW()),
('menu-im-face-user-item-delete', 'menu-im-face-user-item', '删除IM 用户私有表情 DO（个人表情包，对照微信「我的表情」）', 'BUTTON', 'ACTIVE', 'im:im_face_user_item:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-im-face-user-item-rm',        '1', 'menu-im-face-user-item'),
('menu-im-face-user-item-rm-query',  '1', 'menu-im-face-user-item-query'),
('menu-im-face-user-item-rm-create', '1', 'menu-im-face-user-item-create'),
('menu-im-face-user-item-rm-update', '1', 'menu-im-face-user-item-update'),
('menu-im-face-user-item-rm-delete', '1', 'menu-im-face-user-item-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-im-face-user-item-pm',        '1', 'menu-im-face-user-item'),
('menu-im-face-user-item-pm-query',  '1', 'menu-im-face-user-item-query'),
('menu-im-face-user-item-pm-create', '1', 'menu-im-face-user-item-create'),
('menu-im-face-user-item-pm-update', '1', 'menu-im-face-user-item-update'),
('menu-im-face-user-item-pm-delete', '1', 'menu-im-face-user-item-delete')
ON CONFLICT DO NOTHING;
