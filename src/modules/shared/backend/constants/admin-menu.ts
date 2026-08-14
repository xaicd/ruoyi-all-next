import { PERMISSIONS } from "./permissions"

export type AdminMenuItem = {
  key: string
  label: string
  path?: string
  requiredPermission?: string
  children?: AdminMenuItem[]
}

export const ADMIN_MENU: AdminMenuItem[] = [
  {
    key: "system",
    label: "系统管理",
    children: [
      {
        key: "users",
        label: "用户管理",
        path: "/admin/system/users",
        requiredPermission: PERMISSIONS.SYSTEM_USER_VIEW,
      },
      {
        key: "roles",
        label: "角色管理",
        path: "/admin/system/roles",
        requiredPermission: PERMISSIONS.SYSTEM_ROLE_VIEW,
      },
      {
        key: "menus",
        label: "菜单管理",
        path: "/admin/system/menus",
        requiredPermission: PERMISSIONS.SYSTEM_MENU_VIEW,
      },
      {
        key: "depts",
        label: "部门管理",
        path: "/admin/system/depts",
        requiredPermission: PERMISSIONS.SYSTEM_DEPT_VIEW,
      },
      {
        key: "posts",
        label: "岗位管理",
        path: "/admin/system/posts",
        requiredPermission: PERMISSIONS.SYSTEM_POST_VIEW,
      },
      {
        key: "oauth2-clients",
        label: "OAuth2客户端",
        path: "/admin/system/oauth2-clients",
        requiredPermission: PERMISSIONS.SYSTEM_OAUTH2_CLIENT_VIEW,
      },
      {
        key: "oauth2-tokens",
        label: "OAuth2令牌",
        path: "/admin/system/oauth2-tokens",
        requiredPermission: PERMISSIONS.SYSTEM_OAUTH2_TOKEN_VIEW,
      },
      {
        key: "tenants",
        label: "租户管理",
        path: "/admin/system/tenants",
        requiredPermission: PERMISSIONS.SYSTEM_TENANT_VIEW,
      },
      {
        key: "tenant-packages",
        label: "租户套餐",
        path: "/admin/system/tenant-packages",
        requiredPermission: PERMISSIONS.SYSTEM_TENANT_PACKAGE_VIEW,
      },
      {
        key: "dict-data",
        label: "数据字典",
        path: "/admin/system/dicts",
        requiredPermission: PERMISSIONS.SYSTEM_DICT_QUERY,
      },
      {
        key: "notices",
        label: "系统通知",
        path: "/admin/system/notices",
        requiredPermission: PERMISSIONS.SYSTEM_NOTICE_QUERY,
      },
      {
        key: "notify-templates",
        label: "通知模板",
        path: "/admin/system/notify-templates",
        requiredPermission: PERMISSIONS.SYSTEM_NOTIFY_TEMPLATE_CREATE,
      },
      {
        key: "notify-messages",
        label: "通知消息",
        path: "/admin/system/notify-messages",
        requiredPermission: PERMISSIONS.SYSTEM_NOTIFY_MESSAGE_CREATE,
      },
      {
        key: "sms-channels",
        label: "短信渠道",
        path: "/admin/system/sms-channels",
        requiredPermission: PERMISSIONS.SYSTEM_SMS_CHANNEL_VIEW,
      },
      {
        key: "sms-logs",
        label: "短信日志",
        path: "/admin/system/sms-logs",
        requiredPermission: PERMISSIONS.SYSTEM_SMS_LOG_VIEW,
      },
      {
        key: "mail-accounts",
        label: "邮件账号",
        path: "/admin/system/mail-accounts",
        requiredPermission: PERMISSIONS.SYSTEM_MAIL_ACCOUNT_VIEW,
      },
      {
        key: "mail-logs",
        label: "邮件日志",
        path: "/admin/system/mail-logs",
        requiredPermission: PERMISSIONS.SYSTEM_MAIL_LOG_VIEW,
      },
      {
        key: "social-users",
        label: "社交用户",
        path: "/admin/system/social-users",
        requiredPermission: PERMISSIONS.SYSTEM_SOCIAL_USER_VIEW,
      },
      {
        key: "ip-areas",
        label: "IP区域",
        path: "/admin/system/ip-areas",
        requiredPermission: PERMISSIONS.SYSTEM_IP_AREA_VIEW,
      },
      {
        key: "online-users",
        label: "在线用户",
        path: "/admin/system/online-users",
        requiredPermission: PERMISSIONS.SYSTEM_ONLINE_USER_VIEW,
      },
      {
        key: "login-logs",
        label: "登录日志",
        path: "/admin/system/login-logs",
        requiredPermission: PERMISSIONS.SYSTEM_LOGIN_LOG_VIEW,
      },
      {
        key: "operate-logs",
        label: "操作日志",
        path: "/admin/system/operate-logs",
        requiredPermission: PERMISSIONS.SYSTEM_OPERATE_LOG_VIEW,
      },
    ],
  },
  {
    key: "infra",
    label: "基础设施",
    children: [
      {
        key: "infra-configs",
        label: "参数中心",
        path: "/admin/infra/configs",
        requiredPermission: PERMISSIONS.INFRA_CONFIG_VIEW,
      },
      {
        key: "infra-job-center",
        label: "任务中心",
        path: "/admin/infra/job-center",
        requiredPermission: PERMISSIONS.INFRA_JOB_VIEW,
      },
      {
        key: "infra-job-logs",
        label: "任务日志",
        path: "/admin/infra/job-logs",
        requiredPermission: PERMISSIONS.INFRA_JOB_LOG_VIEW,
      },
      {
        key: "infra-api-logs",
        label: "API日志",
        path: "/admin/infra/api-logs",
        requiredPermission: PERMISSIONS.INFRA_API_LOG_VIEW,
      },
      {
        key: "infra-api-error-logs",
        label: "错误日志",
        path: "/admin/infra/api-error-logs",
        requiredPermission: PERMISSIONS.INFRA_API_ERROR_LOG_VIEW,
      },
      {
        key: "infra-redis",
        label: "Redis监控",
        path: "/admin/infra/redis",
        requiredPermission: PERMISSIONS.INFRA_REDIS_VIEW,
      },
      {
        key: "infra-files",
        label: "文件管理",
        path: "/admin/infra/files",
        requiredPermission: PERMISSIONS.INFRA_FILE_VIEW,
      },
      {
        key: "infra-file-configs",
        label: "存储配置",
        path: "/admin/infra/file-configs",
        requiredPermission: PERMISSIONS.INFRA_FILE_CONFIG_VIEW,
      },
      {
        key: "infra-db-configs",
        label: "数据源配置",
        path: "/admin/infra/db-configs",
        requiredPermission: PERMISSIONS.INFRA_DATA_SOURCE_CONFIG_QUERY,
      },
      {
        key: "infra-codegen",
        label: "代码生成",
        path: "/admin/infra/codegen",
        requiredPermission: PERMISSIONS.INFRA_CODEGEN_QUERY,
      },
      {
        key: "infra-swagger",
        label: "接口文档",
        path: "/admin/infra/swagger",
        requiredPermission: PERMISSIONS.INFRA_SWAGGER_VIEW,
      },
    ],
  },
  {
    key: "bpm",
    label: "流程中心",
    children: [
      {
        key: "bpm-process-definitions",
        label: "流程定义",
        path: "/admin/bpm/process-definitions",
        requiredPermission: PERMISSIONS.BPM_PROCESS_DEFINITION_VIEW,
      },
      {
        key: "bpm-tasks",
        label: "待办任务",
        path: "/admin/bpm/tasks",
        requiredPermission: PERMISSIONS.BPM_TASK_VIEW,
      },
    ],
  },
  {
    key: "mp",
    label: "公众号中心",
    children: [
      {
        key: "mp-accounts",
        label: "公众号账号",
        path: "/admin/mp/accounts",
        requiredPermission: PERMISSIONS.MP_ACCOUNT_VIEW,
      },
      {
        key: "mp-fans",
        label: "粉丝管理",
        path: "/admin/mp/fans",
        requiredPermission: PERMISSIONS.MP_FAN_VIEW,
      },
    ],
  },
  {
    key: "crm",
    label: "客户中心",
    children: [
      {
        key: "crm-customers",
        label: "客户管理",
        path: "/admin/crm/customers",
        requiredPermission: PERMISSIONS.CRM_CUSTOMER_VIEW,
      },
      {
        key: "crm-clues",
        label: "线索管理",
        path: "/admin/crm/clues",
        requiredPermission: PERMISSIONS.CRM_CLUE_VIEW,
      },
    ],
  },
  {
    key: "erp",
    label: "经营中台",
    children: [
      {
        key: "erp-products",
        label: "ERP商品",
        path: "/admin/erp/products",
        requiredPermission: PERMISSIONS.ERP_PRODUCT_VIEW,
      },
      {
        key: "erp-orders",
        label: "ERP订单",
        path: "/admin/erp/orders",
        requiredPermission: PERMISSIONS.ERP_ORDER_VIEW,
      },
    ],
  },
  {
    key: "wms",
    label: "仓储中心",
    children: [
      {
        key: "wms-warehouses",
        label: "仓库管理",
        path: "/admin/wms/warehouses",
        requiredPermission: PERMISSIONS.WMS_WAREHOUSE_VIEW,
      },
    ],
  },
  {
    key: "mes",
    label: "制造中心",
    children: [
      {
        key: "mes-work-orders",
        label: "工单管理",
        path: "/admin/mes/work-orders",
        requiredPermission: PERMISSIONS.MES_WORK_ORDER_VIEW,
      },
    ],
  },
  {
    key: "im",
    label: "消息中心",
    children: [
      {
        key: "im-conversations",
        label: "会话管理",
        path: "/admin/im/conversations",
        requiredPermission: PERMISSIONS.IM_CONVERSATION_VIEW,
      },
    ],
  },
  {
    key: "pay",
    label: "支付中心",
    children: [
      {
        key: "pay-orders",
        label: "支付订单",
        path: "/admin/pay/orders",
        requiredPermission: PERMISSIONS.PAY_ORDER_VIEW,
      },
      {
        key: "pay-refunds",
        label: "退款单",
        path: "/admin/pay/refunds",
        requiredPermission: PERMISSIONS.PAY_REFUND_VIEW,
      },
    ],
  },
  {
    key: "member",
    label: "会员中心",
    children: [
      {
        key: "member-users",
        label: "会员列表",
        path: "/admin/member/users",
        requiredPermission: PERMISSIONS.MEMBER_USER_VIEW,
      },
      {
        key: "member-levels",
        label: "会员等级",
        path: "/admin/member/levels",
        requiredPermission: PERMISSIONS.MEMBER_LEVEL_VIEW,
      },
      {
        key: "member-points",
        label: "积分记录",
        path: "/admin/member/points",
        requiredPermission: PERMISSIONS.MEMBER_POINT_VIEW,
      },
    ],
  },
  {
    key: "ai",
    label: "AI中台",
    children: [
      {
        key: "ai-models",
        label: "模型管理",
        path: "/admin/ai/models",
        requiredPermission: PERMISSIONS.AI_MODEL_VIEW,
      },
      {
        key: "ai-chats",
        label: "对话记录",
        path: "/admin/ai/chats",
        requiredPermission: PERMISSIONS.AI_CHAT_VIEW,
      },
    ],
  },
  {
    key: "iot",
    label: "IoT中台",
    children: [
      {
        key: "iot-devices",
        label: "设备管理",
        path: "/admin/iot/devices",
        requiredPermission: PERMISSIONS.IOT_DEVICE_VIEW,
      },
      {
        key: "iot-alerts",
        label: "告警管理",
        path: "/admin/iot/alerts",
        requiredPermission: PERMISSIONS.IOT_ALERT_VIEW,
      },
    ],
  },
  {
    key: "report",
    label: "报表中心",
    children: [
      {
        key: "report-boards",
        label: "数据大屏",
        path: "/admin/report/boards",
        requiredPermission: PERMISSIONS.REPORT_BOARD_VIEW,
      },
    ],
  },
]
