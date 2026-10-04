-- ============================================================
-- Auto-generated RBAC & Menu Migration for 回款 (CrmReceivable)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-crm-receivable',
  'crm-dir',
  '回款管理',
  '/admin/crm/crm-receivable',
  'crm/crm-receivable/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'crm:crm_receivable:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-crm-receivable-query',  'menu-crm-receivable', '查询回款', 'BUTTON', 'ACTIVE', 'crm:crm_receivable:query',  1, NOW(), NOW()),
('menu-crm-receivable-create', 'menu-crm-receivable', '新增回款', 'BUTTON', 'ACTIVE', 'crm:crm_receivable:create', 2, NOW(), NOW()),
('menu-crm-receivable-update', 'menu-crm-receivable', '修改回款', 'BUTTON', 'ACTIVE', 'crm:crm_receivable:update', 3, NOW(), NOW()),
('menu-crm-receivable-delete', 'menu-crm-receivable', '删除回款', 'BUTTON', 'ACTIVE', 'crm:crm_receivable:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-crm-receivable-rm',        '1', 'menu-crm-receivable'),
('menu-crm-receivable-rm-query',  '1', 'menu-crm-receivable-query'),
('menu-crm-receivable-rm-create', '1', 'menu-crm-receivable-create'),
('menu-crm-receivable-rm-update', '1', 'menu-crm-receivable-update'),
('menu-crm-receivable-rm-delete', '1', 'menu-crm-receivable-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-crm-receivable-pm',        '1', 'menu-crm-receivable'),
('menu-crm-receivable-pm-query',  '1', 'menu-crm-receivable-query'),
('menu-crm-receivable-pm-create', '1', 'menu-crm-receivable-create'),
('menu-crm-receivable-pm-update', '1', 'menu-crm-receivable-update'),
('menu-crm-receivable-pm-delete', '1', 'menu-crm-receivable-delete')
ON CONFLICT DO NOTHING;
