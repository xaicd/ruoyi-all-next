-- 插件运行形态: isolated(独立进程, 默认) | merged(同进程加载)
--
-- 列名用 runtime_mode 而非 mode: `mode` 是 PostgreSQL 的 ordered-set 聚合函数名,
-- 直接叫 mode 会踩到 "WITHIN GROUP is required for ordered-set aggregate mode"。
--
-- 为什么默认 isolated: 合并运行没有进程隔离, 插件未捕获异常/死循环会带走宿主。
-- 因此"合并"必须是运营对某个插件的显式选择（UPDATE plugin SET runtime_mode='merged'）,
-- 而不是默认行为。已安装插件沿用默认值, 行为不变。
ALTER TABLE "plugin" ADD COLUMN "runtime_mode" VARCHAR(20) NOT NULL DEFAULT 'isolated';
