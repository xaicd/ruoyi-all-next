// Seed data for SystemUser - matches ruoyi-vue-pro conventions
// Memory-mode development password: RuoYi!Memory_2026#x9 (real PostgreSQL uses .env.local bootstrap credentials).
import type { SystemUserRow } from "@/modules/system/backend/repositories/user.repository"

export const SEED_USERS: SystemUserRow[] = [
  {
    "id": "1",
    "username": "local_operator",
    "nickname": "本地管理员",
    "password": "23c066a33776417f7202d73b77411f87",
    "salt": "f9a3c7d1e5b8a2c6",
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
    "password": "23c066a33776417f7202d73b77411f87",
    "salt": "f9a3c7d1e5b8a2c6",
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
