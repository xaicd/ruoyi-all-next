-- ============================================================
-- Auto-generated RBAC & Menu Migration for IM 通话参与者 DO（用户级 / 明细表）一通通话每个参与者一行；通过 关联主表 终态闭合：通话 ENDED 时所有明细 status 必属 LEFT / REJECTED / NO (ImRtcParticipant)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-im-rtc-participant',
  'im-dir',
  'IM 通话参与者 DO（用户级 / 明细表）一通通话每个参与者一行；通过 关联主表 终态闭合：通话 ENDED 时所有明细 status 必属 LEFT / REJECTED / NO管理',
  '/admin/im/im-rtc-participant',
  'im/im-rtc-participant/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'im:im_rtc_participant:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-im-rtc-participant-query',  'menu-im-rtc-participant', '查询IM 通话参与者 DO（用户级 / 明细表）一通通话每个参与者一行；通过 关联主表 终态闭合：通话 ENDED 时所有明细 status 必属 LEFT / REJECTED / NO', 'BUTTON', 'ACTIVE', 'im:im_rtc_participant:query',  1, NOW(), NOW()),
('menu-im-rtc-participant-create', 'menu-im-rtc-participant', '新增IM 通话参与者 DO（用户级 / 明细表）一通通话每个参与者一行；通过 关联主表 终态闭合：通话 ENDED 时所有明细 status 必属 LEFT / REJECTED / NO', 'BUTTON', 'ACTIVE', 'im:im_rtc_participant:create', 2, NOW(), NOW()),
('menu-im-rtc-participant-update', 'menu-im-rtc-participant', '修改IM 通话参与者 DO（用户级 / 明细表）一通通话每个参与者一行；通过 关联主表 终态闭合：通话 ENDED 时所有明细 status 必属 LEFT / REJECTED / NO', 'BUTTON', 'ACTIVE', 'im:im_rtc_participant:update', 3, NOW(), NOW()),
('menu-im-rtc-participant-delete', 'menu-im-rtc-participant', '删除IM 通话参与者 DO（用户级 / 明细表）一通通话每个参与者一行；通过 关联主表 终态闭合：通话 ENDED 时所有明细 status 必属 LEFT / REJECTED / NO', 'BUTTON', 'ACTIVE', 'im:im_rtc_participant:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-im-rtc-participant'),
('1', 'menu-im-rtc-participant-query'),
('1', 'menu-im-rtc-participant-create'),
('1', 'menu-im-rtc-participant-update'),
('1', 'menu-im-rtc-participant-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-im-rtc-participant'),
('1', 'menu-im-rtc-participant-query'),
('1', 'menu-im-rtc-participant-create'),
('1', 'menu-im-rtc-participant-update'),
('1', 'menu-im-rtc-participant-delete')
ON CONFLICT DO NOTHING;
