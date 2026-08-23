# Flutter 包

- 包名：`ruoyi_client_flutter`
- 渠道 id：`flutter`
- 源码根：`lib/`（Dart 约定，不是 `src/`）

```text
clients/flutter/
  pubspec.yaml
  lib/
    app/
    shared/
    modules/
      mall/
        api/
        models/
        pages/
        components/
```

新域加 `lib/modules/<domain>/`，不要把页面堆到 `lib/app`。当前仅有目录标准，没有可运行 App。
