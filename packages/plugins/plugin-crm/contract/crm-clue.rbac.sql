-- ============================================================
-- Auto-generated RBAC & Menu Migration for CRM 线索 (CrmClue)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-crm-clue',
  'crm-dir',
  'CRM 线索管理',
  '/admin/crm/crm-clue',
  'crm/crm-clue/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'crm:crm_clue:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-crm-clue-query',  'menu-crm-clue', '查询CRM 线索', 'BUTTON', 'ACTIVE', 'crm:crm_clue:query',  1, NOW(), NOW()),
('menu-crm-clue-create', 'menu-crm-clue', '新增CRM 线索', 'BUTTON', 'ACTIVE', 'crm:crm_clue:create', 2, NOW(), NOW()),
('menu-crm-clue-update', 'menu-crm-clue', '修改CRM 线索', 'BUTTON', 'ACTIVE', 'crm:crm_clue:update', 3, NOW(), NOW()),
('menu-crm-clue-delete', 'menu-crm-clue', '删除CRM 线索', 'BUTTON', 'ACTIVE', 'crm:crm_clue:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-crm-clue-rm',        '1', 'menu-crm-clue'),
('menu-crm-clue-rm-query',  '1', 'menu-crm-clue-query'),
('menu-crm-clue-rm-create', '1', 'menu-crm-clue-create'),
('menu-crm-clue-rm-update', '1', 'menu-crm-clue-update'),
('menu-crm-clue-rm-delete', '1', 'menu-crm-clue-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-crm-clue-pm',        '1', 'menu-crm-clue'),
('menu-crm-clue-pm-query',  '1', 'menu-crm-clue-query'),
('menu-crm-clue-pm-create', '1', 'menu-crm-clue-create'),
('menu-crm-clue-pm-update', '1', 'menu-crm-clue-update'),
('menu-crm-clue-pm-delete', '1', 'menu-crm-clue-delete')
ON CONFLICT DO NOTHING;
