// Seed data for SystemUser - matches ruoyi-vue-pro conventions
// Password: admin123 → MD5(MD5(admin123) + salt) = 9486c0e4d342d7b250ac3b27d3f211aa
import type { SystemUserRow } from "@/modules/system/backend/repositories/user.repository"

export const SEED_USERS: SystemUserRow[] = [
  {
    "id": "1",
    "username": "admin",
    "nickname": "超级管理员",
    "password": "9486c0e4d342d7b250ac3b27d3f211aa",
    "salt": "a1b2c3d4e5f6g7h8",
    "phone": "13800000001",
    "email": "admin@ruoyi.local",
    "avatar": null,
    "status": "ACTIVE",
    "deptId": "100",
    "remark": "系统内置超级管理员",
    "tenantId": "1",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "2",
    "username": "test",
    "nickname": "测试用户",
    "password": "9486c0e4d342d7b250ac3b27d3f211aa",
    "salt": "a1b2c3d4e5f6g7h8",
    "phone": "13800000002",
    "email": "test@ruoyi.local",
    "avatar": null,
    "status": "ACTIVE",
    "deptId": "101",
    "remark": "测试账号",
    "tenantId": "1",
    "createdAt": "2026-01-02T00:00:00.000Z",
    "updatedAt": "2026-01-02T00:00:00.000Z"
  }
]
