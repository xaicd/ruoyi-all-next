-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 物料消耗记录明细 DO记录 line 级别的消耗按线边库 FIFO 分配 (MesWmItemConsumeDetail)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-wm-item-consume-detail',
  'mes-dir',
  'MES 物料消耗记录明细 DO记录 line 级别的消耗按线边库 FIFO 分配管理',
  '/admin/mes/mes-wm-item-consume-detail',
  'mes/mes-wm-item-consume-detail/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_item_consume_detail:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-wm-item-consume-detail-query',  'menu-mes-wm-item-consume-detail', '查询MES 物料消耗记录明细 DO记录 line 级别的消耗按线边库 FIFO 分配', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_consume_detail:query',  1, NOW(), NOW()),
('menu-mes-wm-item-consume-detail-create', 'menu-mes-wm-item-consume-detail', '新增MES 物料消耗记录明细 DO记录 line 级别的消耗按线边库 FIFO 分配', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_consume_detail:create', 2, NOW(), NOW()),
('menu-mes-wm-item-consume-detail-update', 'menu-mes-wm-item-consume-detail', '修改MES 物料消耗记录明细 DO记录 line 级别的消耗按线边库 FIFO 分配', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_consume_detail:update', 3, NOW(), NOW()),
('menu-mes-wm-item-consume-detail-delete', 'menu-mes-wm-item-consume-detail', '删除MES 物料消耗记录明细 DO记录 line 级别的消耗按线边库 FIFO 分配', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_consume_detail:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-wm-item-consume-detail-rm',        '1', 'menu-mes-wm-item-consume-detail'),
('menu-mes-wm-item-consume-detail-rm-query',  '1', 'menu-mes-wm-item-consume-detail-query'),
('menu-mes-wm-item-consume-detail-rm-create', '1', 'menu-mes-wm-item-consume-detail-create'),
('menu-mes-wm-item-consume-detail-rm-update', '1', 'menu-mes-wm-item-consume-detail-update'),
('menu-mes-wm-item-consume-detail-rm-delete', '1', 'menu-mes-wm-item-consume-detail-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-wm-item-consume-detail-pm',        '1', 'menu-mes-wm-item-consume-detail'),
('menu-mes-wm-item-consume-detail-pm-query',  '1', 'menu-mes-wm-item-consume-detail-query'),
('menu-mes-wm-item-consume-detail-pm-create', '1', 'menu-mes-wm-item-consume-detail-create'),
('menu-mes-wm-item-consume-detail-pm-update', '1', 'menu-mes-wm-item-consume-detail-update'),
('menu-mes-wm-item-consume-detail-pm-delete', '1', 'menu-mes-wm-item-consume-detail-delete')
ON CONFLICT DO NOTHING;
