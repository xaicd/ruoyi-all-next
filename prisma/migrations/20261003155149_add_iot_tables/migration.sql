-- 由 scripts/generate-table-migration.ts 生成，请勿手改。
-- 来源: scripts/data/iot-source-tables.ts#IOT_TABLES
-- 背景: 这些表的定义来自低代码 CodegenConfig；此前只生成代码、不生成建表 SQL，
--       导致"仓储在查但无处创建"。本迁移补齐 DDL。
-- IoT 告警配置
CREATE TABLE "iot_alert_config" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "level" INTEGER,
    "status" INTEGER,
    "scene_rule_ids" TEXT,
    "receive_user_ids" TEXT,
    "receive_types" TEXT,
    "sms_template_code" VARCHAR(255),
    "mail_template_code" VARCHAR(255),
    "notify_template_code" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "iot_alert_config_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "iot_alert_config_tenant_id_idx" ON "iot_alert_config"("tenant_id");

-- IoT 告警记录
CREATE TABLE "iot_alert_record" (
    "id" TEXT NOT NULL,
    "config_id" BIGINT,
    "config_name" VARCHAR(255),
    "config_level" INTEGER,
    "scene_rule_id" BIGINT,
    "product_id" BIGINT,
    "device_id" BIGINT,
    "device_message" VARCHAR(255),
    "process_status" BOOLEAN,
    "process_remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "iot_alert_record_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "iot_alert_record_tenant_id_idx" ON "iot_alert_record"("tenant_id");

-- IoT 数据流转规则 DO监听 数据源，转发到 数据目的
CREATE TABLE "iot_data_rule" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "status" INTEGER,
    "source_configs" TEXT,
    "sink_ids" TEXT,
    "method" VARCHAR(255),
    "product_id" BIGINT,
    "device_id" BIGINT,
    "identifier" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "iot_data_rule_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "iot_data_rule_tenant_id_idx" ON "iot_data_rule"("tenant_id");

-- IoT 数据流转目的
CREATE TABLE "iot_data_sink" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "status" INTEGER,
    "type" INTEGER,
    "config" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "iot_data_sink_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "iot_data_sink_tenant_id_idx" ON "iot_data_sink"("tenant_id");

-- IoT 设备
CREATE TABLE "iot_device" (
    "id" TEXT NOT NULL,
    "device_name" VARCHAR(255),
    "nickname" VARCHAR(255),
    "serial_number" VARCHAR(255),
    "pic_url" VARCHAR(255),
    "group_ids" TEXT,
    "product_id" BIGINT,
    "product_key" VARCHAR(255),
    "device_type" INTEGER,
    "gateway_id" BIGINT,
    "state" INTEGER,
    "online_time" TIMESTAMP(3),
    "offline_time" TIMESTAMP(3),
    "active_time" TIMESTAMP(3),
    "firmware_id" BIGINT,
    "device_secret" VARCHAR(255),
    "latitude" DECIMAL(18,2),
    "longitude" DECIMAL(18,2),
    "config" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "iot_device_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "iot_device_tenant_id_idx" ON "iot_device"("tenant_id");

-- IoT 设备分组
CREATE TABLE "iot_device_group" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "status" INTEGER,
    "description" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "iot_device_group_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "iot_device_group_tenant_id_idx" ON "iot_device_group"("tenant_id");

-- IoT 设备 Modbus 连接配置
CREATE TABLE "iot_device_modbus_config" (
    "id" TEXT NOT NULL,
    "product_id" BIGINT,
    "device_id" BIGINT,
    "ip" VARCHAR(255),
    "port" INTEGER,
    "slave_id" INTEGER,
    "timeout" INTEGER,
    "retry_interval" INTEGER,
    "mode" INTEGER,
    "frame_format" INTEGER,
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "iot_device_modbus_config_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "iot_device_modbus_config_tenant_id_idx" ON "iot_device_modbus_config"("tenant_id");

-- IoT 设备 Modbus 点位配置
CREATE TABLE "iot_device_modbus_point" (
    "id" TEXT NOT NULL,
    "device_id" BIGINT,
    "thing_model_id" BIGINT,
    "identifier" VARCHAR(255),
    "name" VARCHAR(255),
    "function_code" INTEGER,
    "register_address" INTEGER,
    "register_count" INTEGER,
    "byte_order" VARCHAR(255),
    "raw_data_type" VARCHAR(255),
    "scale" DECIMAL(18,2),
    "poll_interval" INTEGER,
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "iot_device_modbus_point_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "iot_device_modbus_point_tenant_id_idx" ON "iot_device_modbus_point"("tenant_id");

-- IoT OTA 固件
CREATE TABLE "iot_ota_firmware" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "version" VARCHAR(255),
    "product_id" BIGINT,
    "file_url" VARCHAR(255),
    "file_size" BIGINT,
    "file_digest_algorithm" VARCHAR(255),
    "file_digest_value" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "iot_ota_firmware_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "iot_ota_firmware_tenant_id_idx" ON "iot_ota_firmware"("tenant_id");

-- IoT OTA 升级任务
CREATE TABLE "iot_ota_task" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "firmware_id" BIGINT,
    "status" INTEGER,
    "device_scope" INTEGER,
    "device_total_count" INTEGER,
    "device_success_count" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "iot_ota_task_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "iot_ota_task_tenant_id_idx" ON "iot_ota_task"("tenant_id");

-- IoT OTA 升级任务记录
CREATE TABLE "iot_ota_task_record" (
    "id" TEXT NOT NULL,
    "firmware_id" BIGINT,
    "task_id" BIGINT,
    "device_id" BIGINT,
    "from_firmware_id" BIGINT,
    "status" INTEGER,
    "progress" INTEGER,
    "description" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "iot_ota_task_record_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "iot_ota_task_record_tenant_id_idx" ON "iot_ota_task_record"("tenant_id");

-- IoT 产品
CREATE TABLE "iot_product" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "product_key" VARCHAR(255),
    "product_secret" VARCHAR(255),
    "register_enabled" BOOLEAN,
    "category_id" BIGINT,
    "icon" VARCHAR(255),
    "pic_url" VARCHAR(255),
    "description" VARCHAR(255),
    "status" INTEGER,
    "device_type" INTEGER,
    "net_type" INTEGER,
    "protocol_type" VARCHAR(255),
    "serialize_type" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "iot_product_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "iot_product_tenant_id_idx" ON "iot_product"("tenant_id");

-- IoT 产品分类
CREATE TABLE "iot_product_category" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "sort" INTEGER,
    "status" INTEGER,
    "description" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "iot_product_category_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "iot_product_category_tenant_id_idx" ON "iot_product_category"("tenant_id");

-- IoT 场景联动规则
CREATE TABLE "iot_scene_rule" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "status" INTEGER,
    "last_trigger_time" TIMESTAMP(3),
    "triggers" TEXT,
    "actions" TEXT,
    "type" INTEGER,
    "product_id" BIGINT,
    "device_id" BIGINT,
    "identifier" VARCHAR(255),
    "operator" VARCHAR(255),
    "value" VARCHAR(255),
    "cron_expression" VARCHAR(255),
    "condition_groups" TEXT,
    "type" INTEGER,
    "product_id" BIGINT,
    "device_id" BIGINT,
    "identifier" VARCHAR(255),
    "operator" VARCHAR(255),
    "param" VARCHAR(255),
    "type" INTEGER,
    "product_id" BIGINT,
    "device_id" BIGINT,
    "identifier" VARCHAR(255),
    "params" VARCHAR(255),
    "alert_config_id" BIGINT,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "iot_scene_rule_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "iot_scene_rule_tenant_id_idx" ON "iot_scene_rule"("tenant_id");

-- IoT 产品物模型功能 DO每个 和 是“一对多”的关系，它的每个属性、事件、服务都对应一条记录
CREATE TABLE "iot_thing_model" (
    "id" TEXT NOT NULL,
    "identifier" VARCHAR(255),
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "product_id" BIGINT,
    "product_key" VARCHAR(255),
    "type" INTEGER,
    "property" VARCHAR(255),
    "event" VARCHAR(255),
    "service" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "iot_thing_model_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "iot_thing_model_tenant_id_idx" ON "iot_thing_model"("tenant_id");
