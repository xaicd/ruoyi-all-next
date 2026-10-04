-- ============================================================
-- Auto-generated RBAC & Menu Migration for 交易售后日志 (AfterSaleLog)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-after-sale-log',
  'mall-dir',
  '交易售后日志管理',
  '/admin/mall/after-sale-log',
  'mall/after-sale-log/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:after_sale_log:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-after-sale-log-query',  'menu-after-sale-log', '查询交易售后日志', 'BUTTON', 'ACTIVE', 'mall:after_sale_log:query',  1, NOW(), NOW()),
('menu-after-sale-log-create', 'menu-after-sale-log', '新增交易售后日志', 'BUTTON', 'ACTIVE', 'mall:after_sale_log:create', 2, NOW(), NOW()),
('menu-after-sale-log-update', 'menu-after-sale-log', '修改交易售后日志', 'BUTTON', 'ACTIVE', 'mall:after_sale_log:update', 3, NOW(), NOW()),
('menu-after-sale-log-delete', 'menu-after-sale-log', '删除交易售后日志', 'BUTTON', 'ACTIVE', 'mall:after_sale_log:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-after-sale-log-rm',        '1', 'menu-after-sale-log'),
('menu-after-sale-log-rm-query',  '1', 'menu-after-sale-log-query'),
('menu-after-sale-log-rm-create', '1', 'menu-after-sale-log-create'),
('menu-after-sale-log-rm-update', '1', 'menu-after-sale-log-update'),
('menu-after-sale-log-rm-delete', '1', 'menu-after-sale-log-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-after-sale-log-pm',        '1', 'menu-after-sale-log'),
('menu-after-sale-log-pm-query',  '1', 'menu-after-sale-log-query'),
('menu-after-sale-log-pm-create', '1', 'menu-after-sale-log-create'),
('menu-after-sale-log-pm-update', '1', 'menu-after-sale-log-update'),
('menu-after-sale-log-pm-delete', '1', 'menu-after-sale-log-delete')
ON CONFLICT DO NOTHING;
