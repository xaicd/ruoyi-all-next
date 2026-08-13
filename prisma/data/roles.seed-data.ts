// Seed data for SystemRole - matches ruoyi-vue-pro conventions
import type { SystemRoleRow } from "@/modules/system/backend/repositories/role.repository"

export const SEED_ROLES: SystemRoleRow[] = [
  {
    "id": "1",
    "name": "超级管理员",
    "code": "super_admin",
    "sort": 1,
    "status": "ACTIVE",
    "dataScope": "ALL",
    "remark": "超级管理员",
    "tenantId": "1",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "2",
    "name": "普通角色",
    "code": "common",
    "sort": 2,
    "status": "ACTIVE",
    "dataScope": "DEPT",
    "remark": "普通员工角色",
    "tenantId": "1",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "3",
    "name": "CRM 管理员",
    "code": "crm_admin",
    "sort": 3,
    "status": "ACTIVE",
    "dataScope": "ALL",
    "remark": "CRM 专属角色",
    "tenantId": "1",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "4",
    "name": "租户管理员",
    "code": "tenant-admin-default",
    "sort": 0,
    "status": "ACTIVE",
    "dataScope": "ALL",
    "remark": "租户默认管理角色（系统自动生成）",
    "tenantId": "1",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "5",
    "name": "测试角色",
    "code": "test",
    "sort": 5,
    "status": "ACTIVE",
    "dataScope": "SELF",
    "remark": "测试用角色",
    "tenantId": "1",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "6",
    "name": "平台管理员",
    "code": "platform-admin",
    "sort": 0,
    "status": "ACTIVE",
    "dataScope": "ALL",
    "remark": "租户与套餐控制面管理员",
    "tenantId": null,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
