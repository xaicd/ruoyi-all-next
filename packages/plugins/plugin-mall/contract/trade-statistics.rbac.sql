-- ============================================================
-- Auto-generated RBAC & Menu Migration for 交易统计 DO以天为维度，统计全部的数据 (TradeStatistics)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-trade-statistics',
  'mall-dir',
  '交易统计 DO以天为维度，统计全部的数据管理',
  '/admin/mall/trade-statistics',
  'mall/trade-statistics/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:trade_statistics:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-trade-statistics-query',  'menu-trade-statistics', '查询交易统计 DO以天为维度，统计全部的数据', 'BUTTON', 'ACTIVE', 'mall:trade_statistics:query',  1, NOW(), NOW()),
('menu-trade-statistics-create', 'menu-trade-statistics', '新增交易统计 DO以天为维度，统计全部的数据', 'BUTTON', 'ACTIVE', 'mall:trade_statistics:create', 2, NOW(), NOW()),
('menu-trade-statistics-update', 'menu-trade-statistics', '修改交易统计 DO以天为维度，统计全部的数据', 'BUTTON', 'ACTIVE', 'mall:trade_statistics:update', 3, NOW(), NOW()),
('menu-trade-statistics-delete', 'menu-trade-statistics', '删除交易统计 DO以天为维度，统计全部的数据', 'BUTTON', 'ACTIVE', 'mall:trade_statistics:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-trade-statistics-rm',        '1', 'menu-trade-statistics'),
('menu-trade-statistics-rm-query',  '1', 'menu-trade-statistics-query'),
('menu-trade-statistics-rm-create', '1', 'menu-trade-statistics-create'),
('menu-trade-statistics-rm-update', '1', 'menu-trade-statistics-update'),
('menu-trade-statistics-rm-delete', '1', 'menu-trade-statistics-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-trade-statistics-pm',        '1', 'menu-trade-statistics'),
('menu-trade-statistics-pm-query',  '1', 'menu-trade-statistics-query'),
('menu-trade-statistics-pm-create', '1', 'menu-trade-statistics-create'),
('menu-trade-statistics-pm-update', '1', 'menu-trade-statistics-update'),
('menu-trade-statistics-pm-delete', '1', 'menu-trade-statistics-delete')
ON CONFLICT DO NOTHING;
