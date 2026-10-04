-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 流转卡工序记录 (MesProCardProcess)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-pro-card-process',
  'mes-dir',
  'MES 流转卡工序记录管理',
  '/admin/mes/mes-pro-card-process',
  'mes/mes-pro-card-process/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_pro_card_process:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-pro-card-process-query',  'menu-mes-pro-card-process', '查询MES 流转卡工序记录', 'BUTTON', 'ACTIVE', 'mes:mes_pro_card_process:query',  1, NOW(), NOW()),
('menu-mes-pro-card-process-create', 'menu-mes-pro-card-process', '新增MES 流转卡工序记录', 'BUTTON', 'ACTIVE', 'mes:mes_pro_card_process:create', 2, NOW(), NOW()),
('menu-mes-pro-card-process-update', 'menu-mes-pro-card-process', '修改MES 流转卡工序记录', 'BUTTON', 'ACTIVE', 'mes:mes_pro_card_process:update', 3, NOW(), NOW()),
('menu-mes-pro-card-process-delete', 'menu-mes-pro-card-process', '删除MES 流转卡工序记录', 'BUTTON', 'ACTIVE', 'mes:mes_pro_card_process:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-pro-card-process'),
('1', 'menu-mes-pro-card-process-query'),
('1', 'menu-mes-pro-card-process-create'),
('1', 'menu-mes-pro-card-process-update'),
('1', 'menu-mes-pro-card-process-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-pro-card-process'),
('1', 'menu-mes-pro-card-process-query'),
('1', 'menu-mes-pro-card-process-create'),
('1', 'menu-mes-pro-card-process-update'),
('1', 'menu-mes-pro-card-process-delete')
ON CONFLICT DO NOTHING;
