-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesWmItemConsume（源框架导入） (MesWmItemConsume)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-wm-item-consume',
  'mes-dir',
  'MesWmItemConsume（源框架导入）管理',
  '/admin/mes/mes-wm-item-consume',
  'mes/mes-wm-item-consume/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_item_consume:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-wm-item-consume-query',  'menu-mes-wm-item-consume', '查询MesWmItemConsume（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_consume:query',  1, NOW(), NOW()),
('menu-mes-wm-item-consume-create', 'menu-mes-wm-item-consume', '新增MesWmItemConsume（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_consume:create', 2, NOW(), NOW()),
('menu-mes-wm-item-consume-update', 'menu-mes-wm-item-consume', '修改MesWmItemConsume（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_consume:update', 3, NOW(), NOW()),
('menu-mes-wm-item-consume-delete', 'menu-mes-wm-item-consume', '删除MesWmItemConsume（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_consume:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-wm-item-consume'),
('1', 'menu-mes-wm-item-consume-query'),
('1', 'menu-mes-wm-item-consume-create'),
('1', 'menu-mes-wm-item-consume-update'),
('1', 'menu-mes-wm-item-consume-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-wm-item-consume'),
('1', 'menu-mes-wm-item-consume-query'),
('1', 'menu-mes-wm-item-consume-create'),
('1', 'menu-mes-wm-item-consume-update'),
('1', 'menu-mes-wm-item-consume-delete')
ON CONFLICT DO NOTHING;
