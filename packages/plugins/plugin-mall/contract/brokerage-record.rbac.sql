-- ============================================================
-- Auto-generated RBAC & Menu Migration for 佣金记录 (BrokerageRecord)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-brokerage-record',
  'mall-dir',
  '佣金记录管理',
  '/admin/mall/brokerage-record',
  'mall/brokerage-record/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:brokerage_record:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-brokerage-record-query',  'menu-brokerage-record', '查询佣金记录', 'BUTTON', 'ACTIVE', 'mall:brokerage_record:query',  1, NOW(), NOW()),
('menu-brokerage-record-create', 'menu-brokerage-record', '新增佣金记录', 'BUTTON', 'ACTIVE', 'mall:brokerage_record:create', 2, NOW(), NOW()),
('menu-brokerage-record-update', 'menu-brokerage-record', '修改佣金记录', 'BUTTON', 'ACTIVE', 'mall:brokerage_record:update', 3, NOW(), NOW()),
('menu-brokerage-record-delete', 'menu-brokerage-record', '删除佣金记录', 'BUTTON', 'ACTIVE', 'mall:brokerage_record:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-brokerage-record'),
('1', 'menu-brokerage-record-query'),
('1', 'menu-brokerage-record-create'),
('1', 'menu-brokerage-record-update'),
('1', 'menu-brokerage-record-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-brokerage-record'),
('1', 'menu-brokerage-record-query'),
('1', 'menu-brokerage-record-create'),
('1', 'menu-brokerage-record-update'),
('1', 'menu-brokerage-record-delete')
ON CONFLICT DO NOTHING;
