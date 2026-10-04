-- ============================================================
-- Auto-generated RBAC & Menu Migration for IM 频道 DO业务语义：- 频道是运营单向推送的主体；C 端用户不能向频道发消息- 是业务码（API / 字典外露），id 是数字主键给前端会话 targetId 用 (ImChannel)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-im-channel',
  'im-dir',
  'IM 频道 DO业务语义：- 频道是运营单向推送的主体；C 端用户不能向频道发消息- 是业务码（API / 字典外露），id 是数字主键给前端会话 targetId 用管理',
  '/admin/im/im-channel',
  'im/im-channel/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'im:im_channel:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-im-channel-query',  'menu-im-channel', '查询IM 频道 DO业务语义：- 频道是运营单向推送的主体；C 端用户不能向频道发消息- 是业务码（API / 字典外露），id 是数字主键给前端会话 targetId 用', 'BUTTON', 'ACTIVE', 'im:im_channel:query',  1, NOW(), NOW()),
('menu-im-channel-create', 'menu-im-channel', '新增IM 频道 DO业务语义：- 频道是运营单向推送的主体；C 端用户不能向频道发消息- 是业务码（API / 字典外露），id 是数字主键给前端会话 targetId 用', 'BUTTON', 'ACTIVE', 'im:im_channel:create', 2, NOW(), NOW()),
('menu-im-channel-update', 'menu-im-channel', '修改IM 频道 DO业务语义：- 频道是运营单向推送的主体；C 端用户不能向频道发消息- 是业务码（API / 字典外露），id 是数字主键给前端会话 targetId 用', 'BUTTON', 'ACTIVE', 'im:im_channel:update', 3, NOW(), NOW()),
('menu-im-channel-delete', 'menu-im-channel', '删除IM 频道 DO业务语义：- 频道是运营单向推送的主体；C 端用户不能向频道发消息- 是业务码（API / 字典外露），id 是数字主键给前端会话 targetId 用', 'BUTTON', 'ACTIVE', 'im:im_channel:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-im-channel'),
('1', 'menu-im-channel-query'),
('1', 'menu-im-channel-create'),
('1', 'menu-im-channel-update'),
('1', 'menu-im-channel-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-im-channel'),
('1', 'menu-im-channel-query'),
('1', 'menu-im-channel-create'),
('1', 'menu-im-channel-update'),
('1', 'menu-im-channel-delete')
ON CONFLICT DO NOTHING;
