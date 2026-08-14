/**
 * Kysely 数据库 Schema 类型定义
 * 与 prisma/schema.prisma 保持同步
 *
 * 命名规则：表名 = snake_case，与数据库实际表名一致
 */

import type { Generated, ColumnType } from "kysely"

// === System 域 ===

export interface SystemUserTable {
  id: Generated<string>
  username: string
  nickname: string
  password: string
  salt: string
  phone: string | null
  email: string | null
  avatar: string | null
  status: string
  dept_id: string | null
  remark: string | null
  login_ip: string | null
  login_date: ColumnType<Date, string | undefined, string | undefined>
  tenant_id: string | null
  created_at: Generated<Date>
  updated_at: Date
  deleted: Generated<boolean>
}

export interface SystemRoleTable {
  id: Generated<string>
  name: string
  code: string
  sort: number
  status: string
  remark: string | null
  data_scope: string
  tenant_id: string | null
  created_at: Generated<Date>
  updated_at: Date
  deleted: Generated<boolean>
}

export interface SystemUserRoleTable {
  id: Generated<string>
  user_id: string
  role_id: string
}

export interface SystemMenuTable {
  id: Generated<string>
  name: string
  permission: string | null
  type: string
  parent_id: string | null
  path: string | null
  component: string | null
  icon: string | null
  sort: number
  status: string
  visible: Generated<boolean>
  keep_alive: Generated<boolean>
  created_at: Generated<Date>
  updated_at: Date
  deleted: Generated<boolean>
}

export interface SystemRoleMenuTable {
  id: Generated<string>
  role_id: string
  menu_id: string
}

export interface SystemDeptTable {
  id: Generated<string>
  name: string
  parent_id: string | null
  sort: number
  leader_id: string | null
  phone: string | null
  email: string | null
  status: string
  tenant_id: string | null
  created_at: Generated<Date>
  updated_at: Date
  deleted: Generated<boolean>
}

export interface SystemPostTable {
  id: Generated<string>
  name: string
  code: string
  sort: number
  status: string
  remark: string | null
  tenant_id: string | null
  created_at: Generated<Date>
  updated_at: Date
  deleted: Generated<boolean>
}

export interface SystemUserPostTable {
  id: Generated<string>
  user_id: string
  post_id: string
}

export interface SystemDictTypeTable {
  id: Generated<string>
  name: string
  type: string
  status: string
  remark: string | null
  created_at: Generated<Date>
  updated_at: Date
  deleted: Generated<boolean>
}

export interface SystemDictDataTable {
  id: Generated<string>
  dict_type_id: string
  label: string
  value: string
  sort: number
  status: string
  color_type: string | null
  remark: string | null
  created_at: Generated<Date>
  updated_at: Date
  deleted: Generated<boolean>
}

export interface SystemTenantTable {
  id: Generated<string>
  tenant_code: string
  name: string
  contact_name: string | null
  contact_phone: string | null
  domain: string | null
  package_id: string | null
  status: string
  effective_at: Date
  expire_time: Date | null
  account_limit: number | null
  created_at: Generated<Date>
  updated_at: Date
  deleted: Generated<boolean>
}

export interface SystemTenantPackageTable {
  id: string
  name: string
  status: string
  account_limit: number | null
  remark: string | null
  created_at: Generated<Date>
  updated_at: Date
  deleted: Generated<boolean>
}

export interface SystemTenantPackageMenuTable {
  id: string
  package_id: string
  menu_id: string
}

export interface SystemTenantSubscriptionTable {
  id: string
  tenant_id: string
  package_id: string
  effective_at: Date
  expire_at: Date | null
  account_limit: number | null
  status: string
  change_type: string
  remark: string | null
  created_by: string | null
  created_at: Generated<Date>
}

export interface SystemNoticeTable {
  id: Generated<string>
  title: string
  content: string
  type: string
  status: string
  created_at: Generated<Date>
  updated_at: Date
  deleted: Generated<boolean>
}

export interface SystemLoginLogTable {
  id: Generated<string>
  user_id: string | null
  username: string
  user_ip: string
  user_agent: string | null
  result: string
  remark: string | null
  tenant_id: string | null
  created_at: Generated<Date>
}

export interface SystemOperateLogTable {
  id: Generated<string>
  user_id: string | null
  module: string
  name: string
  type: string
  request_method: string
  request_url: string
  content: string | null
  result_code: number
  duration: number
  user_ip: string | null
  tenant_id: string | null
  created_at: Generated<Date>
}

// === Infra 域 ===

export interface InfraConfigTable {
  id: Generated<string>
  category: string
  name: string
  config_key: string
  value: string
  visible: Generated<boolean>
  remark: string | null
  created_at: Generated<Date>
  updated_at: Date
  deleted: Generated<boolean>
}

export interface InfraJobTable {
  id: Generated<string>
  name: string
  handler_name: string
  handler_param: string | null
  cron_expression: string
  retry_count: number
  retry_interval: number
  status: string
  created_at: Generated<Date>
  updated_at: Date
  deleted: Generated<boolean>
}

export interface InfraJobLogTable {
  id: Generated<string>
  job_id: string
  handler_name: string
  begin_time: Date
  end_time: Date | null
  duration: number
  status: string
  result: string | null
  created_at: Generated<Date>
}

export interface InfraApiAccessLogTable {
  id: Generated<string>
  trace_id: string | null
  user_id: string | null
  tenant_id: string | null
  application_name: string
  request_method: string
  request_url: string
  request_params: string | null
  response_body: string | null
  result_code: number
  duration: number
  user_ip: string | null
  user_agent: string | null
  operation: string | null
  created_at: Generated<Date>
}

export interface InfraApiErrorLogTable {
  id: Generated<string>
  trace_id: string | null
  user_id: string | null
  tenant_id: string | null
  application_name: string
  request_method: string
  request_url: string
  request_params: string | null
  exception_name: string
  exception_message: string
  exception_stack: string | null
  error_code: string | null
  root_cause: string | null
  status: string
  user_ip: string | null
  user_agent: string | null
  created_at: Generated<Date>
}

export interface InfraFileConfigTable {
  id: Generated<string>
  name: string
  storage: string
  config: string
  master: Generated<boolean>
  remark: string | null
  created_at: Generated<Date>
  updated_at: Date
  deleted: Generated<boolean>
}

export interface InfraDataSourceConfigTable {
  id: string
  name: string
  driver: string
  url: string
  username: string
  encrypted_password: string
  remark: string | null
  created_at: Generated<Date>
  updated_at: Date
  deleted: Generated<boolean>
}

export interface InfraFileTable {
  id: Generated<string>
  config_id: string
  name: string | null
  path: string
  url: string
  type: string | null
  size: number
  created_at: Generated<Date>
}

// === 顶层 DB 接口（Kysely 入口） ===

export interface DB {
  // System
  system_user: SystemUserTable
  system_role: SystemRoleTable
  system_user_role: SystemUserRoleTable
  system_menu: SystemMenuTable
  system_role_menu: SystemRoleMenuTable
  system_dept: SystemDeptTable
  system_post: SystemPostTable
  system_user_post: SystemUserPostTable
  system_dict_type: SystemDictTypeTable
  system_dict_data: SystemDictDataTable
  system_tenant: SystemTenantTable
  system_tenant_package: SystemTenantPackageTable
  system_tenant_package_menu: SystemTenantPackageMenuTable
  system_tenant_subscription: SystemTenantSubscriptionTable
  system_notice: SystemNoticeTable
  system_login_log: SystemLoginLogTable
  system_operate_log: SystemOperateLogTable

  // Infra
  infra_config: InfraConfigTable
  infra_job: InfraJobTable
  infra_job_log: InfraJobLogTable
  infra_api_access_log: InfraApiAccessLogTable
  infra_api_error_log: InfraApiErrorLogTable
  infra_data_source_config: InfraDataSourceConfigTable
  infra_file_config: InfraFileConfigTable
  infra_file: InfraFileTable
}
