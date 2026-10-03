-- ============================================================
-- Auto-generated RBAC & Menu Migration for CrmOwnerRecord（源框架导入） (CrmOwnerRecord)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-crm-owner-record',
  'crm-dir',
  'CrmOwnerRecord（源框架导入）管理',
  '/admin/crm/crm-owner-record',
  'crm/crm-owner-record/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'crm:crm_owner_record:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-crm-owner-record-query',  'menu-crm-owner-record', '查询CrmOwnerRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_owner_record:query',  1, NOW(), NOW()),
('menu-crm-owner-record-create', 'menu-crm-owner-record', '新增CrmOwnerRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_owner_record:create', 2, NOW(), NOW()),
('menu-crm-owner-record-update', 'menu-crm-owner-record', '修改CrmOwnerRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_owner_record:update', 3, NOW(), NOW()),
('menu-crm-owner-record-delete', 'menu-crm-owner-record', '删除CrmOwnerRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_owner_record:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-crm-owner-record'),
('1', 'menu-crm-owner-record-query'),
('1', 'menu-crm-owner-record-create'),
('1', 'menu-crm-owner-record-update'),
('1', 'menu-crm-owner-record-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-crm-owner-record'),
('1', 'menu-crm-owner-record-query'),
('1', 'menu-crm-owner-record-create'),
('1', 'menu-crm-owner-record-update'),
('1', 'menu-crm-owner-record-delete')
ON CONFLICT DO NOTHING;
