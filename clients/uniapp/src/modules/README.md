# uni-app 业务域

域目录名与后端 `domain-catalog` 对齐。每个域固定 `api/` `models/` `pages/` `components/`。

`pages/*.vue` 路由文件只 re-export 对应 `src/modules/<domain>/pages`。
