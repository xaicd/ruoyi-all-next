-- 由 scripts/generate-table-migration.ts 生成，请勿手改。
-- 来源: scripts/data/ai-source-tables.ts#AI_TABLES
-- 背景: 这些表的定义来自低代码 CodegenConfig；此前只生成代码、不生成建表 SQL，
--       导致"仓储在查但无处创建"。本迁移补齐 DDL。
-- AiApiKey（源框架导入）
CREATE TABLE "ai_api_key" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "api_key" VARCHAR(255),
    "platform" VARCHAR(255),
    "url" VARCHAR(255),
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_api_key_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ai_api_key_tenant_id_idx" ON "ai_api_key"("tenant_id");

-- AiChatConversation（源框架导入）
CREATE TABLE "ai_chat_conversation" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "title" VARCHAR(255),
    "pinned" BOOLEAN,
    "pinned_time" TIMESTAMP(3),
    "role_id" BIGINT,
    "model_id" BIGINT,
    "model" VARCHAR(255),
    "system_message" VARCHAR(255),
    "temperature" DECIMAL(18,2),
    "max_tokens" INTEGER,
    "max_contexts" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_chat_conversation_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ai_chat_conversation_tenant_id_idx" ON "ai_chat_conversation"("tenant_id");

-- AiChatMessage（源框架导入）
CREATE TABLE "ai_chat_message" (
    "id" TEXT NOT NULL,
    "conversation_id" BIGINT,
    "reply_id" BIGINT,
    "type" VARCHAR(255),
    "user_id" BIGINT,
    "role_id" BIGINT,
    "model" VARCHAR(255),
    "model_id" BIGINT,
    "content" VARCHAR(255),
    "reasoning_content" VARCHAR(255),
    "use_context" BOOLEAN,
    "segment_ids" TEXT,
    "web_search_pages" TEXT,
    "attachment_urls" TEXT,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_chat_message_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ai_chat_message_tenant_id_idx" ON "ai_chat_message"("tenant_id");

-- AiChatRole（源框架导入）
CREATE TABLE "ai_chat_role" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "avatar" VARCHAR(255),
    "category" VARCHAR(255),
    "description" VARCHAR(255),
    "system_message" VARCHAR(255),
    "user_id" BIGINT,
    "model_id" BIGINT,
    "knowledge_ids" TEXT,
    "tool_ids" TEXT,
    "mcp_client_names" TEXT,
    "public_status" BOOLEAN,
    "sort" INTEGER,
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_chat_role_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ai_chat_role_tenant_id_idx" ON "ai_chat_role"("tenant_id");

-- AiImage（源框架导入）
CREATE TABLE "ai_image" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "prompt" VARCHAR(255),
    "platform" VARCHAR(255),
    "model_id" BIGINT,
    "model" VARCHAR(255),
    "width" INTEGER,
    "height" INTEGER,
    "status" INTEGER,
    "finish_time" TIMESTAMP(3),
    "error_message" VARCHAR(255),
    "pic_url" VARCHAR(255),
    "public_status" BOOLEAN,
    "options" TEXT,
    "buttons" TEXT,
    "task_id" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_image_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ai_image_tenant_id_idx" ON "ai_image"("tenant_id");

-- AiKnowledge（源框架导入）
CREATE TABLE "ai_knowledge" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "embedding_model_id" BIGINT,
    "embedding_model" VARCHAR(255),
    "top_k" INTEGER,
    "similarity_threshold" DECIMAL(18,2),
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_knowledge_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ai_knowledge_tenant_id_idx" ON "ai_knowledge"("tenant_id");

-- AiKnowledgeDocument（源框架导入）
CREATE TABLE "ai_knowledge_document" (
    "id" TEXT NOT NULL,
    "knowledge_id" BIGINT,
    "name" VARCHAR(255),
    "url" VARCHAR(255),
    "content" VARCHAR(255),
    "content_length" INTEGER,
    "tokens" INTEGER,
    "segment_max_tokens" INTEGER,
    "retrieval_count" INTEGER,
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_knowledge_document_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ai_knowledge_document_tenant_id_idx" ON "ai_knowledge_document"("tenant_id");

-- AiKnowledgeSegment（源框架导入）
CREATE TABLE "ai_knowledge_segment" (
    "id" TEXT NOT NULL,
    "knowledge_id" BIGINT,
    "document_id" BIGINT,
    "content" VARCHAR(255),
    "content_length" INTEGER,
    "vector_id" VARCHAR(255),
    "tokens" INTEGER,
    "retrieval_count" INTEGER,
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_knowledge_segment_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ai_knowledge_segment_tenant_id_idx" ON "ai_knowledge_segment"("tenant_id");

-- AiMindMap（源框架导入）
CREATE TABLE "ai_mind_map" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "platform" VARCHAR(255),
    "model_id" BIGINT,
    "model" VARCHAR(255),
    "prompt" VARCHAR(255),
    "generated_content" VARCHAR(255),
    "error_message" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_mind_map_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ai_mind_map_tenant_id_idx" ON "ai_mind_map"("tenant_id");

-- AiModel（源框架导入）
CREATE TABLE "ai_model" (
    "id" TEXT NOT NULL,
    "key_id" BIGINT,
    "name" VARCHAR(255),
    "model" VARCHAR(255),
    "platform" VARCHAR(255),
    "type" INTEGER,
    "sort" INTEGER,
    "status" INTEGER,
    "temperature" DECIMAL(18,2),
    "max_tokens" INTEGER,
    "max_contexts" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_model_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ai_model_tenant_id_idx" ON "ai_model"("tenant_id");

-- AiMusic（源框架导入）
CREATE TABLE "ai_music" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "title" VARCHAR(255),
    "lyric" VARCHAR(255),
    "image_url" VARCHAR(255),
    "audio_url" VARCHAR(255),
    "video_url" VARCHAR(255),
    "status" INTEGER,
    "generate_mode" INTEGER,
    "description" VARCHAR(255),
    "platform" VARCHAR(255),
    "model" VARCHAR(255),
    "tags" TEXT,
    "duration" DECIMAL(18,2),
    "public_status" BOOLEAN,
    "task_id" VARCHAR(255),
    "error_message" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_music_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ai_music_tenant_id_idx" ON "ai_music"("tenant_id");

-- AiTool（源框架导入）
CREATE TABLE "ai_tool" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_tool_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ai_tool_tenant_id_idx" ON "ai_tool"("tenant_id");

-- AiWorkflow（源框架导入）
CREATE TABLE "ai_workflow" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "code" VARCHAR(255),
    "graph" VARCHAR(255),
    "remark" VARCHAR(255),
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_workflow_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ai_workflow_tenant_id_idx" ON "ai_workflow"("tenant_id");

-- AiWrite（源框架导入）
CREATE TABLE "ai_write" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "type" INTEGER,
    "platform" VARCHAR(255),
    "model_id" BIGINT,
    "model" VARCHAR(255),
    "prompt" VARCHAR(255),
    "generated_content" VARCHAR(255),
    "original_content" VARCHAR(255),
    "length" INTEGER,
    "format" INTEGER,
    "tone" INTEGER,
    "language" INTEGER,
    "error_message" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ai_write_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ai_write_tenant_id_idx" ON "ai_write"("tenant_id");
