-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 安灯呼叫记录 (MesProAndonRecord)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-pro-andon-record',
  'mes-dir',
  'MES 安灯呼叫记录管理',
  '/admin/mes/mes-pro-andon-record',
  'mes/mes-pro-andon-record/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_pro_andon_record:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-pro-andon-record-query',  'menu-mes-pro-andon-record', '查询MES 安灯呼叫记录', 'BUTTON', 'ACTIVE', 'mes:mes_pro_andon_record:query',  1, NOW(), NOW()),
('menu-mes-pro-andon-record-create', 'menu-mes-pro-andon-record', '新增MES 安灯呼叫记录', 'BUTTON', 'ACTIVE', 'mes:mes_pro_andon_record:create', 2, NOW(), NOW()),
('menu-mes-pro-andon-record-update', 'menu-mes-pro-andon-record', '修改MES 安灯呼叫记录', 'BUTTON', 'ACTIVE', 'mes:mes_pro_andon_record:update', 3, NOW(), NOW()),
('menu-mes-pro-andon-record-delete', 'menu-mes-pro-andon-record', '删除MES 安灯呼叫记录', 'BUTTON', 'ACTIVE', 'mes:mes_pro_andon_record:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-pro-andon-record-rm',        '1', 'menu-mes-pro-andon-record'),
('menu-mes-pro-andon-record-rm-query',  '1', 'menu-mes-pro-andon-record-query'),
('menu-mes-pro-andon-record-rm-create', '1', 'menu-mes-pro-andon-record-create'),
('menu-mes-pro-andon-record-rm-update', '1', 'menu-mes-pro-andon-record-update'),
('menu-mes-pro-andon-record-rm-delete', '1', 'menu-mes-pro-andon-record-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-pro-andon-record-pm',        '1', 'menu-mes-pro-andon-record'),
('menu-mes-pro-andon-record-pm-query',  '1', 'menu-mes-pro-andon-record-query'),
('menu-mes-pro-andon-record-pm-create', '1', 'menu-mes-pro-andon-record-create'),
('menu-mes-pro-andon-record-pm-update', '1', 'menu-mes-pro-andon-record-update'),
('menu-mes-pro-andon-record-pm-delete', '1', 'menu-mes-pro-andon-record-delete')
ON CONFLICT DO NOTHING;
