-- 插件来源: builtin(内置/平台模块) | installed(外部安装)。
--
-- 为什么需要: 统一扩展模型后, 域(Platform Module)也作为"内置插件"出现在同一个注册表里,
-- 但两者的管理方式不同 —— builtin 由代码/契约(module.manifest.json)派生、不落库,
-- installed 才有安装记录。用 kind 区分, 而不是给域也建安装记录(那会造成两处真源)。
ALTER TABLE "plugin" ADD COLUMN "kind" VARCHAR(20) NOT NULL DEFAULT 'installed';
