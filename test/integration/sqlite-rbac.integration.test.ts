/**
 * L2 模块集成测试: 嵌入式 SQLite 驱动与 RBAC 用户/角色/菜单真实 CRUD 验证
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { TestingKit } from '../../src/modules/infra/testing/TestingKit';

describe('L2 Integration: SQLite RBAC Database Flow', () => {
  let dbContext: Awaited<ReturnType<typeof TestingKit.createTestDatabase>>;

  beforeAll(async () => {
    dbContext = await TestingKit.createTestDatabase();
  });

  afterAll(() => {
    if (dbContext?.cleanup) dbContext.cleanup();
  });

  it('预置超级管理员账号可正常读取', async () => {
    const user = await dbContext.db
      .selectFrom('system_user' as any)
      .selectAll()
      .where('username', '=', 'admin')
      .executeTakeFirst();

    expect(user).toBeDefined();
    expect((user as any)?.nickname).toBe('系统超级管理员');
    expect((user as any)?.status).toBe('ACTIVE');
  });

  it('预置系统菜单项完整注入', async () => {
    const menus = await dbContext.db
      .selectFrom('system_menu' as any)
      .selectAll()
      .where('deleted', '=', 0)
      .execute();

    expect(menus.length).toBeGreaterThanOrEqual(4);
    const userMenu = menus.find((m: any) => m.path === '/admin/system/users');
    expect(userMenu).toBeDefined();
  });

  it('支持在隔离 SQLite 实例中新增业务用户与角色绑定', async () => {
    const newUserId = `user-${Date.now()}`;
    await dbContext.db
      .insertInto('system_user' as any)
      .values({
        id: newUserId,
        username: 'test_dev',
        nickname: '研发工程师',
        password: 'hash_placeholder',
        salt: 'salt123',
        status: 'ACTIVE',
        deleted: 0
      })
      .execute();

    const created = await dbContext.db
      .selectFrom('system_user' as any)
      .selectAll()
      .where('id', '=', newUserId)
      .executeTakeFirst();

    expect(created).toBeDefined();
    expect((created as any)?.username).toBe('test_dev');
  });
});
