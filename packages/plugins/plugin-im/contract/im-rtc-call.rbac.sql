-- ============================================================
-- Auto-generated RBAC & Menu Migration for IM 通话记录 DO（房间级 / 主表）一通通话一行；状态机 CREATED → (ImRtcCall)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-im-rtc-call',
  'im-dir',
  'IM 通话记录 DO（房间级 / 主表）一通通话一行；状态机 CREATED →管理',
  '/admin/im/im-rtc-call',
  'im/im-rtc-call/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'im:im_rtc_call:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-im-rtc-call-query',  'menu-im-rtc-call', '查询IM 通话记录 DO（房间级 / 主表）一通通话一行；状态机 CREATED →', 'BUTTON', 'ACTIVE', 'im:im_rtc_call:query',  1, NOW(), NOW()),
('menu-im-rtc-call-create', 'menu-im-rtc-call', '新增IM 通话记录 DO（房间级 / 主表）一通通话一行；状态机 CREATED →', 'BUTTON', 'ACTIVE', 'im:im_rtc_call:create', 2, NOW(), NOW()),
('menu-im-rtc-call-update', 'menu-im-rtc-call', '修改IM 通话记录 DO（房间级 / 主表）一通通话一行；状态机 CREATED →', 'BUTTON', 'ACTIVE', 'im:im_rtc_call:update', 3, NOW(), NOW()),
('menu-im-rtc-call-delete', 'menu-im-rtc-call', '删除IM 通话记录 DO（房间级 / 主表）一通通话一行；状态机 CREATED →', 'BUTTON', 'ACTIVE', 'im:im_rtc_call:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-im-rtc-call-rm',        '1', 'menu-im-rtc-call'),
('menu-im-rtc-call-rm-query',  '1', 'menu-im-rtc-call-query'),
('menu-im-rtc-call-rm-create', '1', 'menu-im-rtc-call-create'),
('menu-im-rtc-call-rm-update', '1', 'menu-im-rtc-call-update'),
('menu-im-rtc-call-rm-delete', '1', 'menu-im-rtc-call-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-im-rtc-call-pm',        '1', 'menu-im-rtc-call'),
('menu-im-rtc-call-pm-query',  '1', 'menu-im-rtc-call-query'),
('menu-im-rtc-call-pm-create', '1', 'menu-im-rtc-call-create'),
('menu-im-rtc-call-pm-update', '1', 'menu-im-rtc-call-update'),
('menu-im-rtc-call-pm-delete', '1', 'menu-im-rtc-call-delete')
ON CONFLICT DO NOTHING;
