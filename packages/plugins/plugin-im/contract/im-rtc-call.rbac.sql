-- ============================================================
-- Auto-generated RBAC & Menu Migration for IM 通话记录 DO（房间级 / 主表）一通通话一行；状态机 CREATED → RUNNING → ENDED；和明细表 通过 关联 (ImRtcCall)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-im-rtc-call',
  'im-dir',
  'IM 通话记录 DO（房间级 / 主表）一通通话一行；状态机 CREATED → RUNNING → ENDED；和明细表 通过 关联管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-im-rtc-call-query',  'menu-im-rtc-call', '查询IM 通话记录 DO（房间级 / 主表）一通通话一行；状态机 CREATED → RUNNING → ENDED；和明细表 通过 关联', 'BUTTON', 'ACTIVE', 'im:im_rtc_call:query',  1, NOW(), NOW()),
('menu-im-rtc-call-create', 'menu-im-rtc-call', '新增IM 通话记录 DO（房间级 / 主表）一通通话一行；状态机 CREATED → RUNNING → ENDED；和明细表 通过 关联', 'BUTTON', 'ACTIVE', 'im:im_rtc_call:create', 2, NOW(), NOW()),
('menu-im-rtc-call-update', 'menu-im-rtc-call', '修改IM 通话记录 DO（房间级 / 主表）一通通话一行；状态机 CREATED → RUNNING → ENDED；和明细表 通过 关联', 'BUTTON', 'ACTIVE', 'im:im_rtc_call:update', 3, NOW(), NOW()),
('menu-im-rtc-call-delete', 'menu-im-rtc-call', '删除IM 通话记录 DO（房间级 / 主表）一通通话一行；状态机 CREATED → RUNNING → ENDED；和明细表 通过 关联', 'BUTTON', 'ACTIVE', 'im:im_rtc_call:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-im-rtc-call'),
('1', 'menu-im-rtc-call-query'),
('1', 'menu-im-rtc-call-create'),
('1', 'menu-im-rtc-call-update'),
('1', 'menu-im-rtc-call-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-im-rtc-call'),
('1', 'menu-im-rtc-call-query'),
('1', 'menu-im-rtc-call-create'),
('1', 'menu-im-rtc-call-update'),
('1', 'menu-im-rtc-call-delete')
ON CONFLICT DO NOTHING;
