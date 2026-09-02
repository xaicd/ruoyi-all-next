/**
 * SQLite 零配置数据库极速自动初始化脚本
 * 
 * 适用于：
 * 1. 容器内秒级启动与极速预览（不需要外部 PostgreSQL/MySQL 容器）
 * 2. 自动化测试与 MVP 模式
 * 3. 单文件数据库 data/ruoyi.db 零配置开箱即用
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

  // 创建核心 RBAC 与系统表结构 (符合 SQLite 标准)
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
      remark TEXT,
      login_ip TEXT,
      login_date DATETIME,
      tenant_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS system_role (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      sort INTEGER DEFAULT 0,
      status TEXT DEFAULT 'ACTIVE',
      remark TEXT,
      data_scope TEXT DEFAULT 'ALL',
      tenant_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted INTEGER DEFAULT 0
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
      tenant_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted INTEGER DEFAULT 0
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS system_user_role (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      role_id TEXT NOT NULL,
      tenant_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS system_role_menu (
      id TEXT PRIMARY KEY,
      role_id TEXT NOT NULL,
      menu_id TEXT NOT NULL,
      tenant_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS system_dict_type (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'ACTIVE',
      remark TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted INTEGER DEFAULT 0
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
      remark TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS system_config (
      id TEXT PRIMARY KEY,
      category TEXT DEFAULT 'DEFAULT',
      name TEXT NOT NULL,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL,
      type TEXT DEFAULT 'SYSTEM',
      visible INTEGER DEFAULT 1,
      remark TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted INTEGER DEFAULT 0
    );
  `);

  // 检查是否需要填充种子用户
  const userCount = db.prepare('SELECT count(*) as count FROM system_user').get() as { count: number };
  if (userCount.count === 0) {
    console.log('[Bootstrap-SQLite] 注入系统预置超级管理员账号...');
    const salt = 'coolie_salt_2026';
    const pwd = passwordHash('admin123', salt);

    const insertUser = db.prepare(`
      INSERT INTO system_user (id, username, nickname, password, salt, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);
    insertUser.run('user-admin-01', 'admin', '系统超级管理员', pwd, salt);

    const insertRole = db.prepare(`
      INSERT INTO system_role (id, name, code, sort, status, data_scope, created_at, updated_at)
      VALUES (?, ?, ?, 1, 'ACTIVE', 'ALL', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);
    insertRole.run('role-admin-01', '超级管理员', 'admin');

    const insertUserRole = db.prepare(`
      INSERT INTO system_user_role (id, user_id, role_id, created_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `);
    insertUserRole.run('ur-admin-01', 'user-admin-01', 'role-admin-01');

    // 基础菜单注入
    const insertMenu = db.prepare(`
      INSERT INTO system_menu (id, name, parent_id, sort, path, component, icon, permission, type, status, visible)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'MENU', 'ACTIVE', 1)
    `);
    insertMenu.run('menu-system', '系统管理', null, 1, '/admin/system', 'Layout', 'settings', 'system:manage');
    insertMenu.run('menu-user', '用户管理', 'menu-system', 1, '/admin/system/users', 'system/user/index', 'user', 'system:user:list');
    insertMenu.run('menu-role', '角色管理', 'menu-system', 2, '/admin/system/roles', 'system/role/index', 'shield', 'system:role:list');
    insertMenu.run('menu-menu', '菜单管理', 'menu-system', 3, '/admin/system/menus', 'system/menu/index', 'menu', 'system:menu:list');
    insertMenu.run('menu-dict', '字典管理', 'menu-system', 4, '/admin/system/dicts', 'system/dict/index', 'book-open', 'system:dict:list');

    console.log('[Bootstrap-SQLite] 基础种子数据注入完成！(admin / admin123)');
  }

  db.close();
  return { success: true, dbPath: targetPath };
}

// 直接执行 CLI
if (require.main === module) {
  bootstrapSqlite().then(() => {
    console.log('[Bootstrap-SQLite] SQLite 极速数据库准备就绪。');
    process.exit(0);
  }).catch((err) => {
    console.error('[Bootstrap-SQLite] 初始化异常:', err);
    process.exit(1);
  });
}
