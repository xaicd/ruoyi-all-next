-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 物料消耗记录行 (MesWmItemConsumeLine)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-wm-item-consume-line',
  'mes-dir',
  'MES 物料消耗记录行管理',
  '/admin/mes/mes-wm-item-consume-line',
  'mes/mes-wm-item-consume-line/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_item_consume_line:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-wm-item-consume-line-query',  'menu-mes-wm-item-consume-line', '查询MES 物料消耗记录行', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_consume_line:query',  1, NOW(), NOW()),
('menu-mes-wm-item-consume-line-create', 'menu-mes-wm-item-consume-line', '新增MES 物料消耗记录行', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_consume_line:create', 2, NOW(), NOW()),
('menu-mes-wm-item-consume-line-update', 'menu-mes-wm-item-consume-line', '修改MES 物料消耗记录行', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_consume_line:update', 3, NOW(), NOW()),
('menu-mes-wm-item-consume-line-delete', 'menu-mes-wm-item-consume-line', '删除MES 物料消耗记录行', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_consume_line:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-wm-item-consume-line-rm',        '1', 'menu-mes-wm-item-consume-line'),
('menu-mes-wm-item-consume-line-rm-query',  '1', 'menu-mes-wm-item-consume-line-query'),
('menu-mes-wm-item-consume-line-rm-create', '1', 'menu-mes-wm-item-consume-line-create'),
('menu-mes-wm-item-consume-line-rm-update', '1', 'menu-mes-wm-item-consume-line-update'),
('menu-mes-wm-item-consume-line-rm-delete', '1', 'menu-mes-wm-item-consume-line-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-wm-item-consume-line-pm',        '1', 'menu-mes-wm-item-consume-line'),
('menu-mes-wm-item-consume-line-pm-query',  '1', 'menu-mes-wm-item-consume-line-query'),
('menu-mes-wm-item-consume-line-pm-create', '1', 'menu-mes-wm-item-consume-line-create'),
('menu-mes-wm-item-consume-line-pm-update', '1', 'menu-mes-wm-item-consume-line-update'),
('menu-mes-wm-item-consume-line-pm-delete', '1', 'menu-mes-wm-item-consume-line-delete')
ON CONFLICT DO NOTHING;
