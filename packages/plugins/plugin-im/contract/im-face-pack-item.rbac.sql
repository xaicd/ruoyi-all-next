-- ============================================================
-- Auto-generated RBAC & Menu Migration for ImFacePackItem（源框架导入） (ImFacePackItem)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-im-face-pack-item',
  'im-dir',
  'ImFacePackItem（源框架导入）管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-im-face-pack-item-query',  'menu-im-face-pack-item', '查询ImFacePackItem（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_face_pack_item:query',  1, NOW(), NOW()),
('menu-im-face-pack-item-create', 'menu-im-face-pack-item', '新增ImFacePackItem（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_face_pack_item:create', 2, NOW(), NOW()),
('menu-im-face-pack-item-update', 'menu-im-face-pack-item', '修改ImFacePackItem（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_face_pack_item:update', 3, NOW(), NOW()),
('menu-im-face-pack-item-delete', 'menu-im-face-pack-item', '删除ImFacePackItem（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_face_pack_item:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-im-face-pack-item'),
('1', 'menu-im-face-pack-item-query'),
('1', 'menu-im-face-pack-item-create'),
('1', 'menu-im-face-pack-item-update'),
('1', 'menu-im-face-pack-item-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-im-face-pack-item'),
('1', 'menu-im-face-pack-item-query'),
('1', 'menu-im-face-pack-item-create'),
('1', 'menu-im-face-pack-item-update'),
('1', 'menu-im-face-pack-item-delete')
ON CONFLICT DO NOTHING;
