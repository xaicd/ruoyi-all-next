-- ============================================================
-- Auto-generated RBAC & Menu Migration for CombinationRecord（源框架导入） (CombinationRecord)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-combination-record',
  'mall-dir',
  'CombinationRecord（源框架导入）管理',
  '/admin/mall/combination-record',
  'mall/combination-record/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:combination_record:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-combination-record-query',  'menu-combination-record', '查询CombinationRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:combination_record:query',  1, NOW(), NOW()),
('menu-combination-record-create', 'menu-combination-record', '新增CombinationRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:combination_record:create', 2, NOW(), NOW()),
('menu-combination-record-update', 'menu-combination-record', '修改CombinationRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:combination_record:update', 3, NOW(), NOW()),
('menu-combination-record-delete', 'menu-combination-record', '删除CombinationRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:combination_record:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-combination-record'),
('1', 'menu-combination-record-query'),
('1', 'menu-combination-record-create'),
('1', 'menu-combination-record-update'),
('1', 'menu-combination-record-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-combination-record'),
('1', 'menu-combination-record-query'),
('1', 'menu-combination-record-create'),
('1', 'menu-combination-record-update'),
('1', 'menu-combination-record-delete')
ON CONFLICT DO NOTHING;
