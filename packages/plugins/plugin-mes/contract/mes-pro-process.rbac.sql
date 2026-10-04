-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 生产工序 (MesProProcess)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-pro-process',
  'mes-dir',
  'MES 生产工序管理',
  '/admin/mes/mes-pro-process',
  'mes/mes-pro-process/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_pro_process:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-pro-process-query',  'menu-mes-pro-process', '查询MES 生产工序', 'BUTTON', 'ACTIVE', 'mes:mes_pro_process:query',  1, NOW(), NOW()),
('menu-mes-pro-process-create', 'menu-mes-pro-process', '新增MES 生产工序', 'BUTTON', 'ACTIVE', 'mes:mes_pro_process:create', 2, NOW(), NOW()),
('menu-mes-pro-process-update', 'menu-mes-pro-process', '修改MES 生产工序', 'BUTTON', 'ACTIVE', 'mes:mes_pro_process:update', 3, NOW(), NOW()),
('menu-mes-pro-process-delete', 'menu-mes-pro-process', '删除MES 生产工序', 'BUTTON', 'ACTIVE', 'mes:mes_pro_process:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-pro-process-rm',        '1', 'menu-mes-pro-process'),
('menu-mes-pro-process-rm-query',  '1', 'menu-mes-pro-process-query'),
('menu-mes-pro-process-rm-create', '1', 'menu-mes-pro-process-create'),
('menu-mes-pro-process-rm-update', '1', 'menu-mes-pro-process-update'),
('menu-mes-pro-process-rm-delete', '1', 'menu-mes-pro-process-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-pro-process-pm',        '1', 'menu-mes-pro-process'),
('menu-mes-pro-process-pm-query',  '1', 'menu-mes-pro-process-query'),
('menu-mes-pro-process-pm-create', '1', 'menu-mes-pro-process-create'),
('menu-mes-pro-process-pm-update', '1', 'menu-mes-pro-process-update'),
('menu-mes-pro-process-pm-delete', '1', 'menu-mes-pro-process-delete')
ON CONFLICT DO NOTHING;
