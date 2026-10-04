-- ============================================================
-- Auto-generated RBAC & Menu Migration for 会员等级记录 DO用户每次等级发生变更时，记录一条日志 (MemberLevelRecord)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-member-level-record',
  'member-dir',
  '会员等级记录 DO用户每次等级发生变更时，记录一条日志管理',
  '/admin/member/member-level-record',
  'member/member-level-record/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'member:member_level_record:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-member-level-record-query',  'menu-member-level-record', '查询会员等级记录 DO用户每次等级发生变更时，记录一条日志', 'BUTTON', 'ACTIVE', 'member:member_level_record:query',  1, NOW(), NOW()),
('menu-member-level-record-create', 'menu-member-level-record', '新增会员等级记录 DO用户每次等级发生变更时，记录一条日志', 'BUTTON', 'ACTIVE', 'member:member_level_record:create', 2, NOW(), NOW()),
('menu-member-level-record-update', 'menu-member-level-record', '修改会员等级记录 DO用户每次等级发生变更时，记录一条日志', 'BUTTON', 'ACTIVE', 'member:member_level_record:update', 3, NOW(), NOW()),
('menu-member-level-record-delete', 'menu-member-level-record', '删除会员等级记录 DO用户每次等级发生变更时，记录一条日志', 'BUTTON', 'ACTIVE', 'member:member_level_record:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-member-level-record-rm',        '1', 'menu-member-level-record'),
('menu-member-level-record-rm-query',  '1', 'menu-member-level-record-query'),
('menu-member-level-record-rm-create', '1', 'menu-member-level-record-create'),
('menu-member-level-record-rm-update', '1', 'menu-member-level-record-update'),
('menu-member-level-record-rm-delete', '1', 'menu-member-level-record-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-member-level-record-pm',        '1', 'menu-member-level-record'),
('menu-member-level-record-pm-query',  '1', 'menu-member-level-record-query'),
('menu-member-level-record-pm-create', '1', 'menu-member-level-record-create'),
('menu-member-level-record-pm-update', '1', 'menu-member-level-record-update'),
('menu-member-level-record-pm-delete', '1', 'menu-member-level-record-delete')
ON CONFLICT DO NOTHING;
