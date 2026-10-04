-- ============================================================
-- Auto-generated RBAC & Menu Migration for CRM 联系人 (CrmContact)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-crm-contact',
  'crm-dir',
  'CRM 联系人管理',
  '/admin/crm/crm-contact',
  'crm/crm-contact/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'crm:crm_contact:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-crm-contact-query',  'menu-crm-contact', '查询CRM 联系人', 'BUTTON', 'ACTIVE', 'crm:crm_contact:query',  1, NOW(), NOW()),
('menu-crm-contact-create', 'menu-crm-contact', '新增CRM 联系人', 'BUTTON', 'ACTIVE', 'crm:crm_contact:create', 2, NOW(), NOW()),
('menu-crm-contact-update', 'menu-crm-contact', '修改CRM 联系人', 'BUTTON', 'ACTIVE', 'crm:crm_contact:update', 3, NOW(), NOW()),
('menu-crm-contact-delete', 'menu-crm-contact', '删除CRM 联系人', 'BUTTON', 'ACTIVE', 'crm:crm_contact:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-crm-contact'),
('1', 'menu-crm-contact-query'),
('1', 'menu-crm-contact-create'),
('1', 'menu-crm-contact-update'),
('1', 'menu-crm-contact-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-crm-contact'),
('1', 'menu-crm-contact-query'),
('1', 'menu-crm-contact-create'),
('1', 'menu-crm-contact-update'),
('1', 'menu-crm-contact-delete')
ON CONFLICT DO NOTHING;
