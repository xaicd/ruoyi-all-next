-- ============================================================
-- Auto-generated RBAC & Menu Migration for IM 表情包项 DO（系统表情包内的单张表情图） (ImFacePackItem)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-im-face-pack-item',
  'im-dir',
  'IM 表情包项 DO（系统表情包内的单张表情图）管理',
  '/admin/im/im-face-pack-item',
  'im/im-face-pack-item/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'im:im_face_pack_item:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-im-face-pack-item-query',  'menu-im-face-pack-item', '查询IM 表情包项 DO（系统表情包内的单张表情图）', 'BUTTON', 'ACTIVE', 'im:im_face_pack_item:query',  1, NOW(), NOW()),
('menu-im-face-pack-item-create', 'menu-im-face-pack-item', '新增IM 表情包项 DO（系统表情包内的单张表情图）', 'BUTTON', 'ACTIVE', 'im:im_face_pack_item:create', 2, NOW(), NOW()),
('menu-im-face-pack-item-update', 'menu-im-face-pack-item', '修改IM 表情包项 DO（系统表情包内的单张表情图）', 'BUTTON', 'ACTIVE', 'im:im_face_pack_item:update', 3, NOW(), NOW()),
('menu-im-face-pack-item-delete', 'menu-im-face-pack-item', '删除IM 表情包项 DO（系统表情包内的单张表情图）', 'BUTTON', 'ACTIVE', 'im:im_face_pack_item:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-im-face-pack-item-rm',        '1', 'menu-im-face-pack-item'),
('menu-im-face-pack-item-rm-query',  '1', 'menu-im-face-pack-item-query'),
('menu-im-face-pack-item-rm-create', '1', 'menu-im-face-pack-item-create'),
('menu-im-face-pack-item-rm-update', '1', 'menu-im-face-pack-item-update'),
('menu-im-face-pack-item-rm-delete', '1', 'menu-im-face-pack-item-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-im-face-pack-item-pm',        '1', 'menu-im-face-pack-item'),
('menu-im-face-pack-item-pm-query',  '1', 'menu-im-face-pack-item-query'),
('menu-im-face-pack-item-pm-create', '1', 'menu-im-face-pack-item-create'),
('menu-im-face-pack-item-pm-update', '1', 'menu-im-face-pack-item-update'),
('menu-im-face-pack-item-pm-delete', '1', 'menu-im-face-pack-item-delete')
ON CONFLICT DO NOTHING;
