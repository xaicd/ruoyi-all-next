-- ============================================================
-- Auto-generated RBAC & Menu Migration for CRM 业绩目标 (CrmPerformanceConfig)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-crm-performance-config',
  'crm-dir',
  'CRM 业绩目标管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-crm-performance-config-query',  'menu-crm-performance-config', '查询CRM 业绩目标', 'BUTTON', 'ACTIVE', 'crm:crm_performance_config:query',  1, NOW(), NOW()),
('menu-crm-performance-config-create', 'menu-crm-performance-config', '新增CRM 业绩目标', 'BUTTON', 'ACTIVE', 'crm:crm_performance_config:create', 2, NOW(), NOW()),
('menu-crm-performance-config-update', 'menu-crm-performance-config', '修改CRM 业绩目标', 'BUTTON', 'ACTIVE', 'crm:crm_performance_config:update', 3, NOW(), NOW()),
('menu-crm-performance-config-delete', 'menu-crm-performance-config', '删除CRM 业绩目标', 'BUTTON', 'ACTIVE', 'crm:crm_performance_config:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-crm-performance-config-rm',        '1', 'menu-crm-performance-config'),
('menu-crm-performance-config-rm-query',  '1', 'menu-crm-performance-config-query'),
('menu-crm-performance-config-rm-create', '1', 'menu-crm-performance-config-create'),
('menu-crm-performance-config-rm-update', '1', 'menu-crm-performance-config-update'),
('menu-crm-performance-config-rm-delete', '1', 'menu-crm-performance-config-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-crm-performance-config-pm',        '1', 'menu-crm-performance-config'),
('menu-crm-performance-config-pm-query',  '1', 'menu-crm-performance-config-query'),
('menu-crm-performance-config-pm-create', '1', 'menu-crm-performance-config-create'),
('menu-crm-performance-config-pm-update', '1', 'menu-crm-performance-config-update'),
('menu-crm-performance-config-pm-delete', '1', 'menu-crm-performance-config-delete')
ON CONFLICT DO NOTHING;
