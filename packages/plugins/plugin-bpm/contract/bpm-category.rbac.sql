-- ============================================================
-- Auto-generated RBAC & Menu Migration for BPM 流程分类 (BpmCategory)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-bpm-category',
  'bpm-dir',
  'BPM 流程分类管理',
  '/admin/bpm/bpm-category',
  'bpm/bpm-category/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'bpm:bpm_category:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-bpm-category-query',  'menu-bpm-category', '查询BPM 流程分类', 'BUTTON', 'ACTIVE', 'bpm:bpm_category:query',  1, NOW(), NOW()),
('menu-bpm-category-create', 'menu-bpm-category', '新增BPM 流程分类', 'BUTTON', 'ACTIVE', 'bpm:bpm_category:create', 2, NOW(), NOW()),
('menu-bpm-category-update', 'menu-bpm-category', '修改BPM 流程分类', 'BUTTON', 'ACTIVE', 'bpm:bpm_category:update', 3, NOW(), NOW()),
('menu-bpm-category-delete', 'menu-bpm-category', '删除BPM 流程分类', 'BUTTON', 'ACTIVE', 'bpm:bpm_category:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-bpm-category'),
('1', 'menu-bpm-category-query'),
('1', 'menu-bpm-category-create'),
('1', 'menu-bpm-category-update'),
('1', 'menu-bpm-category-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-bpm-category'),
('1', 'menu-bpm-category-query'),
('1', 'menu-bpm-category-create'),
('1', 'menu-bpm-category-update'),
('1', 'menu-bpm-category-delete')
ON CONFLICT DO NOTHING;
