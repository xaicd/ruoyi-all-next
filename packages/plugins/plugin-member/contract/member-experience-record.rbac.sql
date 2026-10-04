-- ============================================================
-- Auto-generated RBAC & Menu Migration for 会员经验记录 (MemberExperienceRecord)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-member-experience-record',
  'member-dir',
  '会员经验记录管理',
  '/admin/member/member-experience-record',
  'member/member-experience-record/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'member:member_experience_record:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-member-experience-record-query',  'menu-member-experience-record', '查询会员经验记录', 'BUTTON', 'ACTIVE', 'member:member_experience_record:query',  1, NOW(), NOW()),
('menu-member-experience-record-create', 'menu-member-experience-record', '新增会员经验记录', 'BUTTON', 'ACTIVE', 'member:member_experience_record:create', 2, NOW(), NOW()),
('menu-member-experience-record-update', 'menu-member-experience-record', '修改会员经验记录', 'BUTTON', 'ACTIVE', 'member:member_experience_record:update', 3, NOW(), NOW()),
('menu-member-experience-record-delete', 'menu-member-experience-record', '删除会员经验记录', 'BUTTON', 'ACTIVE', 'member:member_experience_record:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-member-experience-record-rm',        '1', 'menu-member-experience-record'),
('menu-member-experience-record-rm-query',  '1', 'menu-member-experience-record-query'),
('menu-member-experience-record-rm-create', '1', 'menu-member-experience-record-create'),
('menu-member-experience-record-rm-update', '1', 'menu-member-experience-record-update'),
('menu-member-experience-record-rm-delete', '1', 'menu-member-experience-record-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-member-experience-record-pm',        '1', 'menu-member-experience-record'),
('menu-member-experience-record-pm-query',  '1', 'menu-member-experience-record-query'),
('menu-member-experience-record-pm-create', '1', 'menu-member-experience-record-create'),
('menu-member-experience-record-pm-update', '1', 'menu-member-experience-record-update'),
('menu-member-experience-record-pm-delete', '1', 'menu-member-experience-record-delete')
ON CONFLICT DO NOTHING;
