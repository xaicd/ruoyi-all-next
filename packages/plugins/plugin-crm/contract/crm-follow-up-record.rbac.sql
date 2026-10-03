-- ============================================================
-- Auto-generated RBAC & Menu Migration for CrmFollowUpRecord（源框架导入） (CrmFollowUpRecord)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-crm-follow-up-record',
  'crm-dir',
  'CrmFollowUpRecord（源框架导入）管理',
  '/admin/crm/crm-follow-up-record',
  'crm/crm-follow-up-record/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'crm:crm_follow_up_record:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-crm-follow-up-record-query',  'menu-crm-follow-up-record', '查询CrmFollowUpRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_follow_up_record:query',  1, NOW(), NOW()),
('menu-crm-follow-up-record-create', 'menu-crm-follow-up-record', '新增CrmFollowUpRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_follow_up_record:create', 2, NOW(), NOW()),
('menu-crm-follow-up-record-update', 'menu-crm-follow-up-record', '修改CrmFollowUpRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_follow_up_record:update', 3, NOW(), NOW()),
('menu-crm-follow-up-record-delete', 'menu-crm-follow-up-record', '删除CrmFollowUpRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_follow_up_record:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-crm-follow-up-record'),
('1', 'menu-crm-follow-up-record-query'),
('1', 'menu-crm-follow-up-record-create'),
('1', 'menu-crm-follow-up-record-update'),
('1', 'menu-crm-follow-up-record-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-crm-follow-up-record'),
('1', 'menu-crm-follow-up-record-query'),
('1', 'menu-crm-follow-up-record-create'),
('1', 'menu-crm-follow-up-record-update'),
('1', 'menu-crm-follow-up-record-delete')
ON CONFLICT DO NOTHING;
