-- ============================================================
-- Auto-generated RBAC & Menu Migration for CrmPerformanceConfig（源框架导入） (CrmPerformanceConfig)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-crm-performance-config',
  'crm-dir',
  'CrmPerformanceConfig（源框架导入）管理',
  '/admin/crm/crm-performance-config',
  'crm/crm-performance-config/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'crm:crm_performance_config:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-crm-performance-config-query',  'menu-crm-performance-config', '查询CrmPerformanceConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_performance_config:query',  1, NOW(), NOW()),
('menu-crm-performance-config-create', 'menu-crm-performance-config', '新增CrmPerformanceConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_performance_config:create', 2, NOW(), NOW()),
('menu-crm-performance-config-update', 'menu-crm-performance-config', '修改CrmPerformanceConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_performance_config:update', 3, NOW(), NOW()),
('menu-crm-performance-config-delete', 'menu-crm-performance-config', '删除CrmPerformanceConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_performance_config:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-crm-performance-config'),
('1', 'menu-crm-performance-config-query'),
('1', 'menu-crm-performance-config-create'),
('1', 'menu-crm-performance-config-update'),
('1', 'menu-crm-performance-config-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-crm-performance-config'),
('1', 'menu-crm-performance-config-query'),
('1', 'menu-crm-performance-config-create'),
('1', 'menu-crm-performance-config-update'),
('1', 'menu-crm-performance-config-delete')
ON CONFLICT DO NOTHING;
