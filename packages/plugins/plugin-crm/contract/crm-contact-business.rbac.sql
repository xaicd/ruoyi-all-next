-- ============================================================
-- Auto-generated RBAC & Menu Migration for CrmContactBusiness（源框架导入） (CrmContactBusiness)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-crm-contact-business',
  'crm-dir',
  'CrmContactBusiness（源框架导入）管理',
  '/admin/crm/crm-contact-business',
  'crm/crm-contact-business/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'crm:crm_contact_business:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-crm-contact-business-query',  'menu-crm-contact-business', '查询CrmContactBusiness（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_contact_business:query',  1, NOW(), NOW()),
('menu-crm-contact-business-create', 'menu-crm-contact-business', '新增CrmContactBusiness（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_contact_business:create', 2, NOW(), NOW()),
('menu-crm-contact-business-update', 'menu-crm-contact-business', '修改CrmContactBusiness（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_contact_business:update', 3, NOW(), NOW()),
('menu-crm-contact-business-delete', 'menu-crm-contact-business', '删除CrmContactBusiness（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_contact_business:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-crm-contact-business'),
('1', 'menu-crm-contact-business-query'),
('1', 'menu-crm-contact-business-create'),
('1', 'menu-crm-contact-business-update'),
('1', 'menu-crm-contact-business-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-crm-contact-business'),
('1', 'menu-crm-contact-business-query'),
('1', 'menu-crm-contact-business-create'),
('1', 'menu-crm-contact-business-update'),
('1', 'menu-crm-contact-business-delete')
ON CONFLICT DO NOTHING;
