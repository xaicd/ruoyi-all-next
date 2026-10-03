-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesMdItem（源框架导入） (MesMdItem)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-md-item',
  'mes-dir',
  'MesMdItem（源框架导入）管理',
  '/admin/mes/mes-md-item',
  'mes/mes-md-item/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_md_item:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-md-item-query',  'menu-mes-md-item', '查询MesMdItem（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_item:query',  1, NOW(), NOW()),
('menu-mes-md-item-create', 'menu-mes-md-item', '新增MesMdItem（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_item:create', 2, NOW(), NOW()),
('menu-mes-md-item-update', 'menu-mes-md-item', '修改MesMdItem（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_item:update', 3, NOW(), NOW()),
('menu-mes-md-item-delete', 'menu-mes-md-item', '删除MesMdItem（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_item:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-md-item'),
('1', 'menu-mes-md-item-query'),
('1', 'menu-mes-md-item-create'),
('1', 'menu-mes-md-item-update'),
('1', 'menu-mes-md-item-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-md-item'),
('1', 'menu-mes-md-item-query'),
('1', 'menu-mes-md-item-create'),
('1', 'menu-mes-md-item-update'),
('1', 'menu-mes-md-item-delete')
ON CONFLICT DO NOTHING;
