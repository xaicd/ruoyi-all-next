# H5 业务域

目录名必须与 `domain-catalog.json` 的 `domains[].name` 相同，例如 `mall`、`member`、`pay`。

每个域内部固定为：

```text
<domain>/
  api/          # 只调 /api/v1/app/<domain>
  models/       # 与 OpenAPI 字段同名
  pages/
  components/
```

域与域之间禁止互相 import 内部文件，只能走 `shared`。没有接入的域不要建空目录。
