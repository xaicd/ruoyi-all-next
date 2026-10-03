-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesMdItemBatchConfig（源框架导入） (MesMdItemBatchConfig)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-md-item-batch-config',
  'mes-dir',
  'MesMdItemBatchConfig（源框架导入）管理',
  '/admin/mes/mes-md-item-batch-config',
  'mes/mes-md-item-batch-config/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_md_item_batch_config:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-md-item-batch-config-query',  'menu-mes-md-item-batch-config', '查询MesMdItemBatchConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_item_batch_config:query',  1, NOW(), NOW()),
('menu-mes-md-item-batch-config-create', 'menu-mes-md-item-batch-config', '新增MesMdItemBatchConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_item_batch_config:create', 2, NOW(), NOW()),
('menu-mes-md-item-batch-config-update', 'menu-mes-md-item-batch-config', '修改MesMdItemBatchConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_item_batch_config:update', 3, NOW(), NOW()),
('menu-mes-md-item-batch-config-delete', 'menu-mes-md-item-batch-config', '删除MesMdItemBatchConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_item_batch_config:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-md-item-batch-config'),
('1', 'menu-mes-md-item-batch-config-query'),
('1', 'menu-mes-md-item-batch-config-create'),
('1', 'menu-mes-md-item-batch-config-update'),
('1', 'menu-mes-md-item-batch-config-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-md-item-batch-config'),
('1', 'menu-mes-md-item-batch-config-query'),
('1', 'menu-mes-md-item-batch-config-create'),
('1', 'menu-mes-md-item-batch-config-update'),
('1', 'menu-mes-md-item-batch-config-delete')
ON CONFLICT DO NOTHING;
