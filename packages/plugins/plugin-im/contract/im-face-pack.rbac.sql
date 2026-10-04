-- ============================================================
-- Auto-generated RBAC & Menu Migration for IM 表情包 DO（运营配置的系统表情包元数据） (ImFacePack)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-im-face-pack',
  'im-dir',
  'IM 表情包 DO（运营配置的系统表情包元数据）管理',
  '/admin/im/im-face-pack',
  'im/im-face-pack/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'im:im_face_pack:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-im-face-pack-query',  'menu-im-face-pack', '查询IM 表情包 DO（运营配置的系统表情包元数据）', 'BUTTON', 'ACTIVE', 'im:im_face_pack:query',  1, NOW(), NOW()),
('menu-im-face-pack-create', 'menu-im-face-pack', '新增IM 表情包 DO（运营配置的系统表情包元数据）', 'BUTTON', 'ACTIVE', 'im:im_face_pack:create', 2, NOW(), NOW()),
('menu-im-face-pack-update', 'menu-im-face-pack', '修改IM 表情包 DO（运营配置的系统表情包元数据）', 'BUTTON', 'ACTIVE', 'im:im_face_pack:update', 3, NOW(), NOW()),
('menu-im-face-pack-delete', 'menu-im-face-pack', '删除IM 表情包 DO（运营配置的系统表情包元数据）', 'BUTTON', 'ACTIVE', 'im:im_face_pack:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-im-face-pack'),
('1', 'menu-im-face-pack-query'),
('1', 'menu-im-face-pack-create'),
('1', 'menu-im-face-pack-update'),
('1', 'menu-im-face-pack-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-im-face-pack'),
('1', 'menu-im-face-pack-query'),
('1', 'menu-im-face-pack-create'),
('1', 'menu-im-face-pack-update'),
('1', 'menu-im-face-pack-delete')
ON CONFLICT DO NOTHING;
