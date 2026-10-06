-- 由 scripts/generate-table-migration.ts 生成，请勿手改。
-- 来源: scripts/data/ai-source-tables.ts#AI_TABLES
-- 背景: 这些表的定义来自低代码 CodegenConfig；此前只生成代码、不生成建表 SQL，
--       导致"仓储在查但无处创建"。本迁移补齐 DDL。
-- AI API 秘钥
CREATE TABLE IF NOT EXISTS "ai_api_key" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "api_key" VARCHAR(255),
    "platform" VARCHAR(255),
    "url" VARCHAR(255),
    "status" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_api_key_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ai_api_key" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255) NOT NULL;
ALTER TABLE "ai_api_key" ADD COLUMN IF NOT EXISTS "api_key" VARCHAR(255);
ALTER TABLE "ai_api_key" ADD COLUMN IF NOT EXISTS "platform" VARCHAR(255);
ALTER TABLE "ai_api_key" ADD COLUMN IF NOT EXISTS "url" VARCHAR(255);
ALTER TABLE "ai_api_key" ADD COLUMN IF NOT EXISTS "status" VARCHAR(255);
ALTER TABLE "ai_api_key" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "ai_api_key" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "ai_api_key" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "ai_api_key" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_api_key" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "ai_api_key" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_api_key" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "ai_api_key_tenant_id_idx" ON "ai_api_key"("tenant_id");

-- AI Chat 对话 DO用户每次发起 Chat 聊天时，会创建一个 对象，将它
CREATE TABLE IF NOT EXISTS "ai_chat_conversation" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "pinned" BOOLEAN NOT NULL,
    "pinned_time" TIMESTAMP(3),
    "role_id" TEXT,
    "model_id" TEXT,
    "model" VARCHAR(255) NOT NULL,
    "system_message" VARCHAR(255),
    "temperature" DECIMAL(18,2),
    "max_tokens" INTEGER,
    "max_contexts" INTEGER,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "system_prompt" TEXT,
    CONSTRAINT "ai_chat_conversation_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ai_chat_conversation" ADD COLUMN IF NOT EXISTS "user_id" TEXT NOT NULL;
ALTER TABLE "ai_chat_conversation" ALTER COLUMN "user_id" TYPE TEXT USING "user_id"::TEXT;
ALTER TABLE "ai_chat_conversation" ADD COLUMN IF NOT EXISTS "title" VARCHAR(255) NOT NULL;
ALTER TABLE "ai_chat_conversation" ADD COLUMN IF NOT EXISTS "pinned" BOOLEAN NOT NULL;
ALTER TABLE "ai_chat_conversation" ADD COLUMN IF NOT EXISTS "pinned_time" TIMESTAMP(3);
ALTER TABLE "ai_chat_conversation" ADD COLUMN IF NOT EXISTS "role_id" TEXT;
ALTER TABLE "ai_chat_conversation" ALTER COLUMN "role_id" TYPE TEXT USING "role_id"::TEXT;
ALTER TABLE "ai_chat_conversation" ADD COLUMN IF NOT EXISTS "model_id" TEXT;
ALTER TABLE "ai_chat_conversation" ALTER COLUMN "model_id" TYPE TEXT USING "model_id"::TEXT;
ALTER TABLE "ai_chat_conversation" ADD COLUMN IF NOT EXISTS "model" VARCHAR(255) NOT NULL;
ALTER TABLE "ai_chat_conversation" ADD COLUMN IF NOT EXISTS "system_message" VARCHAR(255);
ALTER TABLE "ai_chat_conversation" ADD COLUMN IF NOT EXISTS "temperature" DECIMAL(18,2);
ALTER TABLE "ai_chat_conversation" ADD COLUMN IF NOT EXISTS "max_tokens" INTEGER;
ALTER TABLE "ai_chat_conversation" ADD COLUMN IF NOT EXISTS "max_contexts" INTEGER;
ALTER TABLE "ai_chat_conversation" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "ai_chat_conversation" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "ai_chat_conversation" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "ai_chat_conversation" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_chat_conversation" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "ai_chat_conversation" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_chat_conversation" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "ai_chat_conversation" ADD COLUMN IF NOT EXISTS "system_prompt" TEXT;
CREATE INDEX IF NOT EXISTS "ai_chat_conversation_tenant_id_idx" ON "ai_chat_conversation"("tenant_id");

-- AI Chat 消息
CREATE TABLE IF NOT EXISTS "ai_chat_message" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "reply_id" TEXT,
    "type" VARCHAR(255),
    "user_id" TEXT,
    "role_id" TEXT,
    "model" VARCHAR(255),
    "model_id" TEXT,
    "content" VARCHAR(255) NOT NULL,
    "reasoning_content" VARCHAR(255),
    "use_context" BOOLEAN,
    "segment_ids" TEXT,
    "web_search_pages" TEXT,
    "attachment_urls" TEXT,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "role" VARCHAR(255) NOT NULL,
    "tokens" INTEGER NOT NULL,
    CONSTRAINT "ai_chat_message_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ai_chat_message" ADD COLUMN IF NOT EXISTS "conversation_id" TEXT NOT NULL;
ALTER TABLE "ai_chat_message" ALTER COLUMN "conversation_id" TYPE TEXT USING "conversation_id"::TEXT;
ALTER TABLE "ai_chat_message" ADD COLUMN IF NOT EXISTS "reply_id" TEXT;
ALTER TABLE "ai_chat_message" ALTER COLUMN "reply_id" TYPE TEXT USING "reply_id"::TEXT;
ALTER TABLE "ai_chat_message" ADD COLUMN IF NOT EXISTS "type" VARCHAR(255);
ALTER TABLE "ai_chat_message" ADD COLUMN IF NOT EXISTS "user_id" TEXT;
ALTER TABLE "ai_chat_message" ALTER COLUMN "user_id" TYPE TEXT USING "user_id"::TEXT;
ALTER TABLE "ai_chat_message" ADD COLUMN IF NOT EXISTS "role_id" TEXT;
ALTER TABLE "ai_chat_message" ALTER COLUMN "role_id" TYPE TEXT USING "role_id"::TEXT;
ALTER TABLE "ai_chat_message" ADD COLUMN IF NOT EXISTS "model" VARCHAR(255);
ALTER TABLE "ai_chat_message" ADD COLUMN IF NOT EXISTS "model_id" TEXT;
ALTER TABLE "ai_chat_message" ALTER COLUMN "model_id" TYPE TEXT USING "model_id"::TEXT;
ALTER TABLE "ai_chat_message" ADD COLUMN IF NOT EXISTS "content" VARCHAR(255) NOT NULL;
ALTER TABLE "ai_chat_message" ADD COLUMN IF NOT EXISTS "reasoning_content" VARCHAR(255);
ALTER TABLE "ai_chat_message" ADD COLUMN IF NOT EXISTS "use_context" BOOLEAN;
ALTER TABLE "ai_chat_message" ADD COLUMN IF NOT EXISTS "segment_ids" TEXT;
ALTER TABLE "ai_chat_message" ADD COLUMN IF NOT EXISTS "web_search_pages" TEXT;
ALTER TABLE "ai_chat_message" ADD COLUMN IF NOT EXISTS "attachment_urls" TEXT;
ALTER TABLE "ai_chat_message" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "ai_chat_message" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "ai_chat_message" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "ai_chat_message" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_chat_message" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "ai_chat_message" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_chat_message" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "ai_chat_message" ADD COLUMN IF NOT EXISTS "role" VARCHAR(255) NOT NULL;
ALTER TABLE "ai_chat_message" ADD COLUMN IF NOT EXISTS "tokens" INTEGER NOT NULL;
CREATE INDEX IF NOT EXISTS "ai_chat_message_tenant_id_idx" ON "ai_chat_message"("tenant_id");

-- AI 聊天角色
CREATE TABLE IF NOT EXISTS "ai_chat_role" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "avatar" VARCHAR(255),
    "category" VARCHAR(255),
    "description" VARCHAR(255),
    "system_message" VARCHAR(255),
    "user_id" TEXT,
    "model_id" TEXT,
    "knowledge_ids" TEXT,
    "tool_ids" TEXT,
    "mcp_client_names" TEXT,
    "public_status" BOOLEAN,
    "sort" INTEGER,
    "status" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_chat_role_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ai_chat_role" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255) NOT NULL;
ALTER TABLE "ai_chat_role" ADD COLUMN IF NOT EXISTS "avatar" VARCHAR(255);
ALTER TABLE "ai_chat_role" ADD COLUMN IF NOT EXISTS "category" VARCHAR(255);
ALTER TABLE "ai_chat_role" ADD COLUMN IF NOT EXISTS "description" VARCHAR(255);
ALTER TABLE "ai_chat_role" ADD COLUMN IF NOT EXISTS "system_message" VARCHAR(255);
ALTER TABLE "ai_chat_role" ADD COLUMN IF NOT EXISTS "user_id" TEXT;
ALTER TABLE "ai_chat_role" ALTER COLUMN "user_id" TYPE TEXT USING "user_id"::TEXT;
ALTER TABLE "ai_chat_role" ADD COLUMN IF NOT EXISTS "model_id" TEXT;
ALTER TABLE "ai_chat_role" ALTER COLUMN "model_id" TYPE TEXT USING "model_id"::TEXT;
ALTER TABLE "ai_chat_role" ADD COLUMN IF NOT EXISTS "knowledge_ids" TEXT;
ALTER TABLE "ai_chat_role" ADD COLUMN IF NOT EXISTS "tool_ids" TEXT;
ALTER TABLE "ai_chat_role" ADD COLUMN IF NOT EXISTS "mcp_client_names" TEXT;
ALTER TABLE "ai_chat_role" ADD COLUMN IF NOT EXISTS "public_status" BOOLEAN;
ALTER TABLE "ai_chat_role" ADD COLUMN IF NOT EXISTS "sort" INTEGER;
ALTER TABLE "ai_chat_role" ADD COLUMN IF NOT EXISTS "status" VARCHAR(255);
ALTER TABLE "ai_chat_role" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "ai_chat_role" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "ai_chat_role" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "ai_chat_role" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_chat_role" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "ai_chat_role" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_chat_role" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "ai_chat_role_tenant_id_idx" ON "ai_chat_role"("tenant_id");

-- AI 绘画
CREATE TABLE IF NOT EXISTS "ai_image" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "prompt" VARCHAR(255),
    "platform" VARCHAR(255),
    "model_id" TEXT,
    "model" VARCHAR(255),
    "width" INTEGER,
    "height" INTEGER,
    "status" VARCHAR(255),
    "finish_time" TIMESTAMP(3),
    "error_message" VARCHAR(255),
    "pic_url" VARCHAR(255),
    "public_status" BOOLEAN,
    "options" TEXT,
    "buttons" TEXT,
    "task_id" TEXT,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_image_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ai_image" ADD COLUMN IF NOT EXISTS "user_id" TEXT;
ALTER TABLE "ai_image" ALTER COLUMN "user_id" TYPE TEXT USING "user_id"::TEXT;
ALTER TABLE "ai_image" ADD COLUMN IF NOT EXISTS "prompt" VARCHAR(255);
ALTER TABLE "ai_image" ADD COLUMN IF NOT EXISTS "platform" VARCHAR(255);
ALTER TABLE "ai_image" ADD COLUMN IF NOT EXISTS "model_id" TEXT;
ALTER TABLE "ai_image" ALTER COLUMN "model_id" TYPE TEXT USING "model_id"::TEXT;
ALTER TABLE "ai_image" ADD COLUMN IF NOT EXISTS "model" VARCHAR(255);
ALTER TABLE "ai_image" ADD COLUMN IF NOT EXISTS "width" INTEGER;
ALTER TABLE "ai_image" ADD COLUMN IF NOT EXISTS "height" INTEGER;
ALTER TABLE "ai_image" ADD COLUMN IF NOT EXISTS "status" VARCHAR(255);
ALTER TABLE "ai_image" ADD COLUMN IF NOT EXISTS "finish_time" TIMESTAMP(3);
ALTER TABLE "ai_image" ADD COLUMN IF NOT EXISTS "error_message" VARCHAR(255);
ALTER TABLE "ai_image" ADD COLUMN IF NOT EXISTS "pic_url" VARCHAR(255);
ALTER TABLE "ai_image" ADD COLUMN IF NOT EXISTS "public_status" BOOLEAN;
ALTER TABLE "ai_image" ADD COLUMN IF NOT EXISTS "options" TEXT;
ALTER TABLE "ai_image" ADD COLUMN IF NOT EXISTS "buttons" TEXT;
ALTER TABLE "ai_image" ADD COLUMN IF NOT EXISTS "task_id" TEXT;
ALTER TABLE "ai_image" ALTER COLUMN "task_id" TYPE TEXT USING "task_id"::TEXT;
ALTER TABLE "ai_image" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "ai_image" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "ai_image" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "ai_image" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_image" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "ai_image" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_image" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "ai_image_tenant_id_idx" ON "ai_image"("tenant_id");

-- AI 知识库
CREATE TABLE IF NOT EXISTS "ai_knowledge" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "embedding_model_id" TEXT,
    "embedding_model" VARCHAR(255),
    "top_k" INTEGER,
    "similarity_threshold" DECIMAL(18,2),
    "status" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_knowledge_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ai_knowledge" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255) NOT NULL;
ALTER TABLE "ai_knowledge" ADD COLUMN IF NOT EXISTS "description" VARCHAR(255);
ALTER TABLE "ai_knowledge" ADD COLUMN IF NOT EXISTS "embedding_model_id" TEXT;
ALTER TABLE "ai_knowledge" ALTER COLUMN "embedding_model_id" TYPE TEXT USING "embedding_model_id"::TEXT;
ALTER TABLE "ai_knowledge" ADD COLUMN IF NOT EXISTS "embedding_model" VARCHAR(255);
ALTER TABLE "ai_knowledge" ADD COLUMN IF NOT EXISTS "top_k" INTEGER;
ALTER TABLE "ai_knowledge" ADD COLUMN IF NOT EXISTS "similarity_threshold" DECIMAL(18,2);
ALTER TABLE "ai_knowledge" ADD COLUMN IF NOT EXISTS "status" VARCHAR(255);
ALTER TABLE "ai_knowledge" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "ai_knowledge" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "ai_knowledge" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "ai_knowledge" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_knowledge" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "ai_knowledge" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_knowledge" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "ai_knowledge_tenant_id_idx" ON "ai_knowledge"("tenant_id");

-- AI 知识库-文档
CREATE TABLE IF NOT EXISTS "ai_knowledge_document" (
    "id" TEXT NOT NULL,
    "knowledge_id" TEXT,
    "name" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255),
    "content" VARCHAR(255),
    "content_length" INTEGER,
    "tokens" INTEGER,
    "segment_max_tokens" INTEGER,
    "retrieval_count" INTEGER,
    "status" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_knowledge_document_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ai_knowledge_document" ADD COLUMN IF NOT EXISTS "knowledge_id" TEXT;
ALTER TABLE "ai_knowledge_document" ALTER COLUMN "knowledge_id" TYPE TEXT USING "knowledge_id"::TEXT;
ALTER TABLE "ai_knowledge_document" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255) NOT NULL;
ALTER TABLE "ai_knowledge_document" ADD COLUMN IF NOT EXISTS "url" VARCHAR(255);
ALTER TABLE "ai_knowledge_document" ADD COLUMN IF NOT EXISTS "content" VARCHAR(255);
ALTER TABLE "ai_knowledge_document" ADD COLUMN IF NOT EXISTS "content_length" INTEGER;
ALTER TABLE "ai_knowledge_document" ADD COLUMN IF NOT EXISTS "tokens" INTEGER;
ALTER TABLE "ai_knowledge_document" ADD COLUMN IF NOT EXISTS "segment_max_tokens" INTEGER;
ALTER TABLE "ai_knowledge_document" ADD COLUMN IF NOT EXISTS "retrieval_count" INTEGER;
ALTER TABLE "ai_knowledge_document" ADD COLUMN IF NOT EXISTS "status" VARCHAR(255);
ALTER TABLE "ai_knowledge_document" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "ai_knowledge_document" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "ai_knowledge_document" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "ai_knowledge_document" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_knowledge_document" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "ai_knowledge_document" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_knowledge_document" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "ai_knowledge_document_tenant_id_idx" ON "ai_knowledge_document"("tenant_id");

-- AI 知识库-文档分段
CREATE TABLE IF NOT EXISTS "ai_knowledge_segment" (
    "id" TEXT NOT NULL,
    "knowledge_id" TEXT,
    "document_id" TEXT,
    "content" VARCHAR(255),
    "content_length" INTEGER,
    "vector_id" TEXT,
    "tokens" INTEGER,
    "retrieval_count" INTEGER,
    "status" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_knowledge_segment_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ai_knowledge_segment" ADD COLUMN IF NOT EXISTS "knowledge_id" TEXT;
ALTER TABLE "ai_knowledge_segment" ALTER COLUMN "knowledge_id" TYPE TEXT USING "knowledge_id"::TEXT;
ALTER TABLE "ai_knowledge_segment" ADD COLUMN IF NOT EXISTS "document_id" TEXT;
ALTER TABLE "ai_knowledge_segment" ALTER COLUMN "document_id" TYPE TEXT USING "document_id"::TEXT;
ALTER TABLE "ai_knowledge_segment" ADD COLUMN IF NOT EXISTS "content" VARCHAR(255);
ALTER TABLE "ai_knowledge_segment" ADD COLUMN IF NOT EXISTS "content_length" INTEGER;
ALTER TABLE "ai_knowledge_segment" ADD COLUMN IF NOT EXISTS "vector_id" TEXT;
ALTER TABLE "ai_knowledge_segment" ALTER COLUMN "vector_id" TYPE TEXT USING "vector_id"::TEXT;
ALTER TABLE "ai_knowledge_segment" ADD COLUMN IF NOT EXISTS "tokens" INTEGER;
ALTER TABLE "ai_knowledge_segment" ADD COLUMN IF NOT EXISTS "retrieval_count" INTEGER;
ALTER TABLE "ai_knowledge_segment" ADD COLUMN IF NOT EXISTS "status" VARCHAR(255);
ALTER TABLE "ai_knowledge_segment" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "ai_knowledge_segment" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "ai_knowledge_segment" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "ai_knowledge_segment" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_knowledge_segment" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "ai_knowledge_segment" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_knowledge_segment" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "ai_knowledge_segment_tenant_id_idx" ON "ai_knowledge_segment"("tenant_id");

-- AI 思维导图
CREATE TABLE IF NOT EXISTS "ai_mind_map" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "platform" VARCHAR(255),
    "model_id" TEXT,
    "model" VARCHAR(255),
    "prompt" VARCHAR(255),
    "generated_content" VARCHAR(255),
    "error_message" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_mind_map_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ai_mind_map" ADD COLUMN IF NOT EXISTS "user_id" TEXT;
ALTER TABLE "ai_mind_map" ALTER COLUMN "user_id" TYPE TEXT USING "user_id"::TEXT;
ALTER TABLE "ai_mind_map" ADD COLUMN IF NOT EXISTS "platform" VARCHAR(255);
ALTER TABLE "ai_mind_map" ADD COLUMN IF NOT EXISTS "model_id" TEXT;
ALTER TABLE "ai_mind_map" ALTER COLUMN "model_id" TYPE TEXT USING "model_id"::TEXT;
ALTER TABLE "ai_mind_map" ADD COLUMN IF NOT EXISTS "model" VARCHAR(255);
ALTER TABLE "ai_mind_map" ADD COLUMN IF NOT EXISTS "prompt" VARCHAR(255);
ALTER TABLE "ai_mind_map" ADD COLUMN IF NOT EXISTS "generated_content" VARCHAR(255);
ALTER TABLE "ai_mind_map" ADD COLUMN IF NOT EXISTS "error_message" VARCHAR(255);
ALTER TABLE "ai_mind_map" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "ai_mind_map" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "ai_mind_map" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "ai_mind_map" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_mind_map" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "ai_mind_map" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_mind_map" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "ai_mind_map_tenant_id_idx" ON "ai_mind_map"("tenant_id");

-- AI 模型 DO默认模型： 为开启，并且 排序第一
CREATE TABLE IF NOT EXISTS "ai_model" (
    "id" TEXT NOT NULL,
    "key_id" TEXT,
    "name" VARCHAR(255) NOT NULL,
    "model" VARCHAR(255),
    "platform" VARCHAR(255),
    "type" INTEGER,
    "sort" INTEGER NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "temperature" DECIMAL(18,2),
    "max_tokens" INTEGER,
    "max_contexts" INTEGER,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "model_key" VARCHAR(255) NOT NULL,
    "input_ratio" VARCHAR(255) NOT NULL,
    "output_ratio" VARCHAR(255) NOT NULL,
    "provider" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    CONSTRAINT "ai_model_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ai_model" ADD COLUMN IF NOT EXISTS "key_id" TEXT;
ALTER TABLE "ai_model" ALTER COLUMN "key_id" TYPE TEXT USING "key_id"::TEXT;
ALTER TABLE "ai_model" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255) NOT NULL;
ALTER TABLE "ai_model" ADD COLUMN IF NOT EXISTS "model" VARCHAR(255);
ALTER TABLE "ai_model" ADD COLUMN IF NOT EXISTS "platform" VARCHAR(255);
ALTER TABLE "ai_model" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "ai_model" ADD COLUMN IF NOT EXISTS "sort" INTEGER NOT NULL;
ALTER TABLE "ai_model" ADD COLUMN IF NOT EXISTS "status" VARCHAR(255) NOT NULL;
ALTER TABLE "ai_model" ADD COLUMN IF NOT EXISTS "temperature" DECIMAL(18,2);
ALTER TABLE "ai_model" ADD COLUMN IF NOT EXISTS "max_tokens" INTEGER;
ALTER TABLE "ai_model" ADD COLUMN IF NOT EXISTS "max_contexts" INTEGER;
ALTER TABLE "ai_model" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "ai_model" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "ai_model" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "ai_model" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_model" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "ai_model" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_model" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "ai_model" ADD COLUMN IF NOT EXISTS "model_key" VARCHAR(255) NOT NULL;
ALTER TABLE "ai_model" ADD COLUMN IF NOT EXISTS "input_ratio" VARCHAR(255) NOT NULL;
ALTER TABLE "ai_model" ADD COLUMN IF NOT EXISTS "output_ratio" VARCHAR(255) NOT NULL;
ALTER TABLE "ai_model" ADD COLUMN IF NOT EXISTS "provider" VARCHAR(255) NOT NULL;
ALTER TABLE "ai_model" ADD COLUMN IF NOT EXISTS "description" VARCHAR(255);
CREATE INDEX IF NOT EXISTS "ai_model_tenant_id_idx" ON "ai_model"("tenant_id");

-- AI 音乐
CREATE TABLE IF NOT EXISTS "ai_music" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "title" VARCHAR(255) NOT NULL,
    "lyric" VARCHAR(255),
    "image_url" VARCHAR(255),
    "audio_url" VARCHAR(255),
    "video_url" VARCHAR(255),
    "status" VARCHAR(255),
    "generate_mode" INTEGER,
    "description" VARCHAR(255),
    "platform" VARCHAR(255),
    "model" VARCHAR(255),
    "tags" TEXT,
    "duration" DECIMAL(18,2),
    "public_status" BOOLEAN,
    "task_id" TEXT,
    "error_message" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_music_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ai_music" ADD COLUMN IF NOT EXISTS "user_id" TEXT;
ALTER TABLE "ai_music" ALTER COLUMN "user_id" TYPE TEXT USING "user_id"::TEXT;
ALTER TABLE "ai_music" ADD COLUMN IF NOT EXISTS "title" VARCHAR(255) NOT NULL;
ALTER TABLE "ai_music" ADD COLUMN IF NOT EXISTS "lyric" VARCHAR(255);
ALTER TABLE "ai_music" ADD COLUMN IF NOT EXISTS "image_url" VARCHAR(255);
ALTER TABLE "ai_music" ADD COLUMN IF NOT EXISTS "audio_url" VARCHAR(255);
ALTER TABLE "ai_music" ADD COLUMN IF NOT EXISTS "video_url" VARCHAR(255);
ALTER TABLE "ai_music" ADD COLUMN IF NOT EXISTS "status" VARCHAR(255);
ALTER TABLE "ai_music" ADD COLUMN IF NOT EXISTS "generate_mode" INTEGER;
ALTER TABLE "ai_music" ADD COLUMN IF NOT EXISTS "description" VARCHAR(255);
ALTER TABLE "ai_music" ADD COLUMN IF NOT EXISTS "platform" VARCHAR(255);
ALTER TABLE "ai_music" ADD COLUMN IF NOT EXISTS "model" VARCHAR(255);
ALTER TABLE "ai_music" ADD COLUMN IF NOT EXISTS "tags" TEXT;
ALTER TABLE "ai_music" ADD COLUMN IF NOT EXISTS "duration" DECIMAL(18,2);
ALTER TABLE "ai_music" ADD COLUMN IF NOT EXISTS "public_status" BOOLEAN;
ALTER TABLE "ai_music" ADD COLUMN IF NOT EXISTS "task_id" TEXT;
ALTER TABLE "ai_music" ALTER COLUMN "task_id" TYPE TEXT USING "task_id"::TEXT;
ALTER TABLE "ai_music" ADD COLUMN IF NOT EXISTS "error_message" VARCHAR(255);
ALTER TABLE "ai_music" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "ai_music" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "ai_music" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "ai_music" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_music" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "ai_music" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_music" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "ai_music_tenant_id_idx" ON "ai_music"("tenant_id");

-- AI 工具
CREATE TABLE IF NOT EXISTS "ai_tool" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "status" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_tool_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ai_tool" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255) NOT NULL;
ALTER TABLE "ai_tool" ADD COLUMN IF NOT EXISTS "description" VARCHAR(255);
ALTER TABLE "ai_tool" ADD COLUMN IF NOT EXISTS "status" VARCHAR(255);
ALTER TABLE "ai_tool" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "ai_tool" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "ai_tool" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "ai_tool" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_tool" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "ai_tool" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_tool" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "ai_tool_tenant_id_idx" ON "ai_tool"("tenant_id");

-- AI 工作流
CREATE TABLE IF NOT EXISTS "ai_workflow" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255),
    "graph" VARCHAR(255),
    "remark" VARCHAR(255),
    "status" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_workflow_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ai_workflow" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255) NOT NULL;
ALTER TABLE "ai_workflow" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "ai_workflow" ADD COLUMN IF NOT EXISTS "graph" VARCHAR(255);
ALTER TABLE "ai_workflow" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "ai_workflow" ADD COLUMN IF NOT EXISTS "status" VARCHAR(255);
ALTER TABLE "ai_workflow" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "ai_workflow" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "ai_workflow" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "ai_workflow" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_workflow" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "ai_workflow" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_workflow" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "ai_workflow_tenant_id_idx" ON "ai_workflow"("tenant_id");

-- AI 写作
CREATE TABLE IF NOT EXISTS "ai_write" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "type" INTEGER,
    "platform" VARCHAR(255),
    "model_id" TEXT,
    "model" VARCHAR(255),
    "prompt" VARCHAR(255),
    "generated_content" VARCHAR(255),
    "original_content" VARCHAR(255),
    "length" INTEGER,
    "format" INTEGER,
    "tone" INTEGER,
    "language" INTEGER,
    "error_message" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_write_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ai_write" ADD COLUMN IF NOT EXISTS "user_id" TEXT;
ALTER TABLE "ai_write" ALTER COLUMN "user_id" TYPE TEXT USING "user_id"::TEXT;
ALTER TABLE "ai_write" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "ai_write" ADD COLUMN IF NOT EXISTS "platform" VARCHAR(255);
ALTER TABLE "ai_write" ADD COLUMN IF NOT EXISTS "model_id" TEXT;
ALTER TABLE "ai_write" ALTER COLUMN "model_id" TYPE TEXT USING "model_id"::TEXT;
ALTER TABLE "ai_write" ADD COLUMN IF NOT EXISTS "model" VARCHAR(255);
ALTER TABLE "ai_write" ADD COLUMN IF NOT EXISTS "prompt" VARCHAR(255);
ALTER TABLE "ai_write" ADD COLUMN IF NOT EXISTS "generated_content" VARCHAR(255);
ALTER TABLE "ai_write" ADD COLUMN IF NOT EXISTS "original_content" VARCHAR(255);
ALTER TABLE "ai_write" ADD COLUMN IF NOT EXISTS "length" INTEGER;
ALTER TABLE "ai_write" ADD COLUMN IF NOT EXISTS "format" INTEGER;
ALTER TABLE "ai_write" ADD COLUMN IF NOT EXISTS "tone" INTEGER;
ALTER TABLE "ai_write" ADD COLUMN IF NOT EXISTS "language" INTEGER;
ALTER TABLE "ai_write" ADD COLUMN IF NOT EXISTS "error_message" VARCHAR(255);
ALTER TABLE "ai_write" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "ai_write" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "ai_write" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "ai_write" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_write" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "ai_write" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "ai_write" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "ai_write_tenant_id_idx" ON "ai_write"("tenant_id");
