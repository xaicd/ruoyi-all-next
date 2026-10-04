-- ============================================================
-- Auto-generated RBAC & Menu Migration for 秒杀时段 (SeckillConfig)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-seckill-config',
  'mall-dir',
  '秒杀时段管理',
  '/admin/mall/seckill-config',
  'mall/seckill-config/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:seckill_config:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-seckill-config-query',  'menu-seckill-config', '查询秒杀时段', 'BUTTON', 'ACTIVE', 'mall:seckill_config:query',  1, NOW(), NOW()),
('menu-seckill-config-create', 'menu-seckill-config', '新增秒杀时段', 'BUTTON', 'ACTIVE', 'mall:seckill_config:create', 2, NOW(), NOW()),
('menu-seckill-config-update', 'menu-seckill-config', '修改秒杀时段', 'BUTTON', 'ACTIVE', 'mall:seckill_config:update', 3, NOW(), NOW()),
('menu-seckill-config-delete', 'menu-seckill-config', '删除秒杀时段', 'BUTTON', 'ACTIVE', 'mall:seckill_config:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-seckill-config'),
('1', 'menu-seckill-config-query'),
('1', 'menu-seckill-config-create'),
('1', 'menu-seckill-config-update'),
('1', 'menu-seckill-config-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-seckill-config'),
('1', 'menu-seckill-config-query'),
('1', 'menu-seckill-config-create'),
('1', 'menu-seckill-config-update'),
('1', 'menu-seckill-config-delete')
ON CONFLICT DO NOTHING;
