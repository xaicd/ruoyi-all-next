-- ============================================================
-- Auto-generated RBAC & Menu Migration for 批次管理 (MesWmBatch)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-wm-batch',
  'mes-dir',
  '批次管理管理',
  '/admin/mes/mes-wm-batch',
  'mes/mes-wm-batch/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_batch:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-wm-batch-query',  'menu-mes-wm-batch', '查询批次管理', 'BUTTON', 'ACTIVE', 'mes:mes_wm_batch:query',  1, NOW(), NOW()),
('menu-mes-wm-batch-create', 'menu-mes-wm-batch', '新增批次管理', 'BUTTON', 'ACTIVE', 'mes:mes_wm_batch:create', 2, NOW(), NOW()),
('menu-mes-wm-batch-update', 'menu-mes-wm-batch', '修改批次管理', 'BUTTON', 'ACTIVE', 'mes:mes_wm_batch:update', 3, NOW(), NOW()),
('menu-mes-wm-batch-delete', 'menu-mes-wm-batch', '删除批次管理', 'BUTTON', 'ACTIVE', 'mes:mes_wm_batch:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-wm-batch'),
('1', 'menu-mes-wm-batch-query'),
('1', 'menu-mes-wm-batch-create'),
('1', 'menu-mes-wm-batch-update'),
('1', 'menu-mes-wm-batch-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-wm-batch'),
('1', 'menu-mes-wm-batch-query'),
('1', 'menu-mes-wm-batch-create'),
('1', 'menu-mes-wm-batch-update'),
('1', 'menu-mes-wm-batch-delete')
ON CONFLICT DO NOTHING;
