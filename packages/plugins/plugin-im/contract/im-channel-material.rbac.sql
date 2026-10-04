-- ============================================================
-- Auto-generated RBAC & Menu Migration for IM 频道素材 DO业务语义：- 运营素材库，可被反复推送- 一条素材 1:N  (ImChannelMaterial)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-im-channel-material',
  'im-dir',
  'IM 频道素材 DO业务语义：- 运营素材库，可被反复推送- 一条素材 1:N 管理',
  '/admin/im/im-channel-material',
  'im/im-channel-material/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'im:im_channel_material:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-im-channel-material-query',  'menu-im-channel-material', '查询IM 频道素材 DO业务语义：- 运营素材库，可被反复推送- 一条素材 1:N ', 'BUTTON', 'ACTIVE', 'im:im_channel_material:query',  1, NOW(), NOW()),
('menu-im-channel-material-create', 'menu-im-channel-material', '新增IM 频道素材 DO业务语义：- 运营素材库，可被反复推送- 一条素材 1:N ', 'BUTTON', 'ACTIVE', 'im:im_channel_material:create', 2, NOW(), NOW()),
('menu-im-channel-material-update', 'menu-im-channel-material', '修改IM 频道素材 DO业务语义：- 运营素材库，可被反复推送- 一条素材 1:N ', 'BUTTON', 'ACTIVE', 'im:im_channel_material:update', 3, NOW(), NOW()),
('menu-im-channel-material-delete', 'menu-im-channel-material', '删除IM 频道素材 DO业务语义：- 运营素材库，可被反复推送- 一条素材 1:N ', 'BUTTON', 'ACTIVE', 'im:im_channel_material:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-im-channel-material-rm',        '1', 'menu-im-channel-material'),
('menu-im-channel-material-rm-query',  '1', 'menu-im-channel-material-query'),
('menu-im-channel-material-rm-create', '1', 'menu-im-channel-material-create'),
('menu-im-channel-material-rm-update', '1', 'menu-im-channel-material-update'),
('menu-im-channel-material-rm-delete', '1', 'menu-im-channel-material-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-im-channel-material-pm',        '1', 'menu-im-channel-material'),
('menu-im-channel-material-pm-query',  '1', 'menu-im-channel-material-query'),
('menu-im-channel-material-pm-create', '1', 'menu-im-channel-material-create'),
('menu-im-channel-material-pm-update', '1', 'menu-im-channel-material-update'),
('menu-im-channel-material-pm-delete', '1', 'menu-im-channel-material-delete')
ON CONFLICT DO NOTHING;
