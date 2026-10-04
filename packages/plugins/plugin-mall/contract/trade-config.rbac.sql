-- ============================================================
-- Auto-generated RBAC & Menu Migration for 交易中心配置 (TradeConfig)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-trade-config',
  'mall-dir',
  '交易中心配置管理',
  '/admin/mall/trade-config',
  'mall/trade-config/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:trade_config:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-trade-config-query',  'menu-trade-config', '查询交易中心配置', 'BUTTON', 'ACTIVE', 'mall:trade_config:query',  1, NOW(), NOW()),
('menu-trade-config-create', 'menu-trade-config', '新增交易中心配置', 'BUTTON', 'ACTIVE', 'mall:trade_config:create', 2, NOW(), NOW()),
('menu-trade-config-update', 'menu-trade-config', '修改交易中心配置', 'BUTTON', 'ACTIVE', 'mall:trade_config:update', 3, NOW(), NOW()),
('menu-trade-config-delete', 'menu-trade-config', '删除交易中心配置', 'BUTTON', 'ACTIVE', 'mall:trade_config:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-trade-config-rm',        '1', 'menu-trade-config'),
('menu-trade-config-rm-query',  '1', 'menu-trade-config-query'),
('menu-trade-config-rm-create', '1', 'menu-trade-config-create'),
('menu-trade-config-rm-update', '1', 'menu-trade-config-update'),
('menu-trade-config-rm-delete', '1', 'menu-trade-config-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-trade-config-pm',        '1', 'menu-trade-config'),
('menu-trade-config-pm-query',  '1', 'menu-trade-config-query'),
('menu-trade-config-pm-create', '1', 'menu-trade-config-create'),
('menu-trade-config-pm-update', '1', 'menu-trade-config-update'),
('menu-trade-config-pm-delete', '1', 'menu-trade-config-delete')
ON CONFLICT DO NOTHING;
