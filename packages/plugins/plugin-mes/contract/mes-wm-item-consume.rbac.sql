-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 物料消耗记录 (MesWmItemConsume)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-wm-item-consume',
  'mes-dir',
  'MES 物料消耗记录管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-wm-item-consume-query',  'menu-mes-wm-item-consume', '查询MES 物料消耗记录', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_consume:query',  1, NOW(), NOW()),
('menu-mes-wm-item-consume-create', 'menu-mes-wm-item-consume', '新增MES 物料消耗记录', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_consume:create', 2, NOW(), NOW()),
('menu-mes-wm-item-consume-update', 'menu-mes-wm-item-consume', '修改MES 物料消耗记录', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_consume:update', 3, NOW(), NOW()),
('menu-mes-wm-item-consume-delete', 'menu-mes-wm-item-consume', '删除MES 物料消耗记录', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_consume:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-wm-item-consume-rm',        '1', 'menu-mes-wm-item-consume'),
('menu-mes-wm-item-consume-rm-query',  '1', 'menu-mes-wm-item-consume-query'),
('menu-mes-wm-item-consume-rm-create', '1', 'menu-mes-wm-item-consume-create'),
('menu-mes-wm-item-consume-rm-update', '1', 'menu-mes-wm-item-consume-update'),
('menu-mes-wm-item-consume-rm-delete', '1', 'menu-mes-wm-item-consume-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-wm-item-consume-pm',        '1', 'menu-mes-wm-item-consume'),
('menu-mes-wm-item-consume-pm-query',  '1', 'menu-mes-wm-item-consume-query'),
('menu-mes-wm-item-consume-pm-create', '1', 'menu-mes-wm-item-consume-create'),
('menu-mes-wm-item-consume-pm-update', '1', 'menu-mes-wm-item-consume-update'),
('menu-mes-wm-item-consume-pm-delete', '1', 'menu-mes-wm-item-consume-delete')
ON CONFLICT DO NOTHING;
