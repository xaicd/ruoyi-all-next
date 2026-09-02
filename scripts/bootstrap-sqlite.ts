/**
 * SQLite 零配置数据库极速自动初始化脚本
 * 
 * 适用于：
 * 1. 容器内秒级启动与极速预览（不需要外部 PostgreSQL/MySQL 容器）
 * 2. 自动化测试与 MVP 模式
 * 3. 单文件数据库 data/ruoyi.db 零配置开箱即用
 * 4. 内置企业级 8 大标准审计底座字段 (tenant_id, created_by, created_at, updated_by, updated_at, deleted, deleted_at, remark)
 */

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';

const DB_PATH = process.env.SQLITE_DB_PATH || path.resolve(process.cwd(), 'data/ruoyi.db');

function md5(value: string) {
  return createHash('md5').update(value).digest('hex');
}

function passwordHash(password: string, salt: string): string {
  return md5(md5(password) + salt);
}

export async function bootstrapSqlite(targetPath = DB_PATH) {
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const isNewDb = !fs.existsSync(targetPath);
  const db = new Database(targetPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  console.log(`[Bootstrap-SQLite] 初始化数据库: ${targetPath} (新库: ${isNewDb})`);

  // 创建核心 RBAC 与系统表结构 (统一内置 8 大企业级审计底座字段)
  db.exec(`
    CREATE TABLE IF NOT EXISTS system_user (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      nickname TEXT NOT NULL,
      password TEXT NOT NULL,
      salt TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      avatar TEXT,
      status TEXT DEFAULT 'ACTIVE',
      dept_id TEXT,
      login_ip TEXT,
      login_date DATETIME,
      tenant_id TEXT DEFAULT 'default',
      created_by TEXT DEFAULT 'system',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by TEXT DEFAULT 'system',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted INTEGER DEFAULT 0,
      deleted_at DATETIME,
      remark TEXT
    );

    CREATE TABLE IF NOT EXISTS system_role (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      sort INTEGER DEFAULT 0,
      status TEXT DEFAULT 'ACTIVE',
      data_scope TEXT DEFAULT 'ALL',
      tenant_id TEXT DEFAULT 'default',
      created_by TEXT DEFAULT 'system',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by TEXT DEFAULT 'system',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted INTEGER DEFAULT 0,
      deleted_at DATETIME,
      remark TEXT
    );

    CREATE TABLE IF NOT EXISTS system_dept (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      parent_id TEXT,
      sort INTEGER DEFAULT 0,
      leader TEXT,
      phone TEXT,
      email TEXT,
      status TEXT DEFAULT 'ACTIVE',
      tenant_id TEXT DEFAULT 'default',
      created_by TEXT DEFAULT 'system',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by TEXT DEFAULT 'system',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted INTEGER DEFAULT 0,
      deleted_at DATETIME,
      remark TEXT
    );

    CREATE TABLE IF NOT EXISTS system_menu (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      parent_id TEXT,
      sort INTEGER DEFAULT 0,
      path TEXT,
      component TEXT,
      component_name TEXT,
      icon TEXT,
      permission TEXT,
      type TEXT DEFAULT 'MENU',
      status TEXT DEFAULT 'ACTIVE',
      visible INTEGER DEFAULT 1,
      keep_alive INTEGER DEFAULT 1,
      always_show INTEGER DEFAULT 0,
      tenant_id TEXT DEFAULT 'default',
      created_by TEXT DEFAULT 'system',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by TEXT DEFAULT 'system',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted INTEGER DEFAULT 0,
      deleted_at DATETIME,
      remark TEXT
    );

    CREATE TABLE IF NOT EXISTS system_user_role (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      role_id TEXT NOT NULL,
      tenant_id TEXT DEFAULT 'default',
      created_by TEXT DEFAULT 'system',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS system_role_menu (
      id TEXT PRIMARY KEY,
      role_id TEXT NOT NULL,
      menu_id TEXT NOT NULL,
      tenant_id TEXT DEFAULT 'default',
      created_by TEXT DEFAULT 'system',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS system_dict_type (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'ACTIVE',
      tenant_id TEXT DEFAULT 'default',
      created_by TEXT DEFAULT 'system',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by TEXT DEFAULT 'system',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted INTEGER DEFAULT 0,
      deleted_at DATETIME,
      remark TEXT
    );

    CREATE TABLE IF NOT EXISTS system_dict_data (
      id TEXT PRIMARY KEY,
      dict_type TEXT NOT NULL,
      label TEXT NOT NULL,
      value TEXT NOT NULL,
      sort INTEGER DEFAULT 0,
      status TEXT DEFAULT 'ACTIVE',
      color_type TEXT,
      css_class TEXT,
      tenant_id TEXT DEFAULT 'default',
      created_by TEXT DEFAULT 'system',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by TEXT DEFAULT 'system',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted INTEGER DEFAULT 0,
      deleted_at DATETIME,
      remark TEXT
    );

    CREATE TABLE IF NOT EXISTS system_config (
      id TEXT PRIMARY KEY,
      category TEXT DEFAULT 'DEFAULT',
      name TEXT NOT NULL,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL,
      type TEXT DEFAULT 'SYSTEM',
      visible INTEGER DEFAULT 1,
      tenant_id TEXT DEFAULT 'default',
      created_by TEXT DEFAULT 'system',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by TEXT DEFAULT 'system',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted INTEGER DEFAULT 0,
      deleted_at DATETIME,
      remark TEXT
    );
  `);

  // 检查是否需要填充种子用户
  const userCount = db.prepare('SELECT count(*) as count FROM system_user').get() as { count: number };
  if (userCount.count === 0) {
    console.log('[Bootstrap-SQLite] 注入系统预置超级管理员账号...');
    const salt = 'coolie_salt_2026';
    const pwd = passwordHash('admin123', salt);

    const insertUser = db.prepare(`
      INSERT INTO system_user (id, username, nickname, password, salt, status, tenant_id, created_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'ACTIVE', 'default', 'system', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);
    insertUser.run('user-admin-01', 'admin', '系统超级管理员', pwd, salt);

    const insertRole = db.prepare(`
      INSERT INTO system_role (id, name, code, sort, status, data_scope, tenant_id, created_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'ACTIVE', 'ALL', 'default', 'system', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);
    insertRole.run('role-admin-01', '超级管理员', 'admin', 1);

    const insertUserRole = db.prepare(`
      INSERT INTO system_user_role (id, user_id, role_id, tenant_id, created_by, created_at)
      VALUES (?, ?, ?, 'default', 'system', CURRENT_TIMESTAMP)
    `);
    insertUserRole.run('ur-admin-01', 'user-admin-01', 'role-admin-01');

    // 注入核心系统菜单
    const insertMenu = db.prepare(`
      INSERT INTO system_menu (id, name, parent_id, sort, path, component, icon, permission, type, tenant_id, created_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'default', 'system', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    insertMenu.run('m-system', '系统管理', '0', 1, '/admin/system', 'Layout', 'system', null, 'DIR');
    insertMenu.run('m-user', '用户管理', 'm-system', 1, '/admin/system/users', 'system/user/index', 'user', 'system:user:list', 'MENU');
    insertMenu.run('m-role', '角色管理', 'm-system', 2, '/admin/system/roles', 'system/role/index', 'peoples', 'system:role:list', 'MENU');
    insertMenu.run('m-menu', '菜单管理', 'm-system', 3, '/admin/system/menus', 'system/menu/index', 'tree-table', 'system:menu:list', 'MENU');
    insertMenu.run('m-dept', '部门管理', 'm-system', 4, '/admin/system/depts', 'system/dept/index', 'tree', 'system:dept:list', 'MENU');
    insertMenu.run('m-dict', '字典管理', 'm-system', 5, '/admin/system/dicts', 'system/dict/index', 'dict', 'system:dict:list', 'MENU');
    insertMenu.run('m-config', '参数设置', 'm-system', 6, '/admin/system/config', 'system/config/index', 'edit', 'system:config:list', 'MENU');

    console.log('[Bootstrap-SQLite] 基础种子数据注入完成！(admin / admin123)');
  }

  return { success: true, dbPath: targetPath, isNewDb };
}

// 支持直接命令行执行 ts-node
if (require.main === module) {
  bootstrapSqlite().then(() => {
    console.log('[Bootstrap-SQLite] 数据库启动自检完成！');
    process.exit(0);
  }).catch((err) => {
    console.error('[Bootstrap-SQLite] 初始化失败:', err);
    process.exit(1);
  });
}
