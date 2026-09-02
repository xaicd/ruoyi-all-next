/**
 * L1 单元测试: 用户密码加密与认证逻辑
 */

import { describe, it, expect } from 'vitest';
import { createHash } from 'crypto';

function md5(value: string) {
  return createHash('md5').update(value).digest('hex');
}

function passwordHash(password: string, salt: string): string {
  return md5(md5(password) + salt);
}

describe('L1 Unit: Authentication & Password Verification', () => {
  it('正确生成加盐 MD5 密码散列', () => {
    const salt = 'coolie_salt_2026';
    const raw = 'admin123';
    const hash = passwordHash(raw, salt);

    expect(hash).toBeDefined();
    expect(hash.length).toBe(32);
    expect(passwordHash(raw, salt)).toBe(hash);
  });

  it('错误密码校验失败', () => {
    const salt = 'coolie_salt_2026';
    const correctHash = passwordHash('admin123', salt);
    const wrongHash = passwordHash('wrongpass', salt);

    expect(correctHash).not.toBe(wrongHash);
  });
});
