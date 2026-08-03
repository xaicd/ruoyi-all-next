# RuoYi 全域深度证据扫描

- 生成时间: 2026-08-03T02:27:33.659Z
- 域总数: 15

## 迁移优先级总览

| 域 | 矩阵状态 | 后端(Cont/Serv/Map/DO/Enum) | 前端(Vue/API) | all-next 文件数 | 六要素缺口 |
|---|---|---|---|---:|---|
| mes | PARTIAL | 127/134/135/133/65 | 284/127 | 9 | none |
| mall | PARTIAL | 73/51/55/49/36 | 124/40 | 12 | none |
| crm | PARTIAL | 24/25/28/21/11 | 118/24 | 12 | none |
| im | PARTIAL | 30/18/18/17/16 | 101/28 | 9 | none |
| system | PARTIAL | 35/34/32/32/18 | 66/28 | 134 | none |
| erp | PARTIAL | 23/23/35/33/2 | 63/23 | 12 | none |
| infra | PARTIAL | 16/15/22/16/11 | 51/16 | 128 | none |
| wms | PARTIAL | 17/17/17/16/5 | 39/17 | 9 | none |
| bpm | PARTIAL | 12/13/8/8/30 | 45/12 | 12 | none |
| iot | PARTIAL | 18/20/15/17/28 | 91/16 | 0 | api,service,validator,page,permission,logAudit,test |
| mp | PARTIAL | 12/9/8/8/3 | 46/11 | 23 | none |
| ai | PARTIAL | 14/14/14/14/8 | 69/14 | 0 | api,service,validator,page,permission,logAudit,test |
| member | PARTIAL | 20/12/11/11/2 | 32/10 | 0 | api,service,validator,page,permission,logAudit,test |
| pay | PARTIAL | 19/12/14/14/10 | 23/11 | 0 | api,service,validator,page,permission,logAudit,test |
| report | PARTIAL | 2/4/1/1/0 | 3/0 | 0 | api,service,validator,page,permission,logAudit,test |

## mes

- 矩阵状态: PARTIAL
- all-next 六要素缺口: none
- 后端证据样本:
  - Controller: 127
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mes/src/main/java/cn/iocoder/yudao/module/mes/controller/admin/wm/warehouse/MesWmWarehouseAreaController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mes/src/main/java/cn/iocoder/yudao/module/mes/controller/admin/wm/warehouse/MesWmWarehouseController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mes/src/main/java/cn/iocoder/yudao/module/mes/controller/admin/wm/warehouse/MesWmWarehouseLocationController.java
  - ServiceImpl: 134
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mes/src/main/java/cn/iocoder/yudao/module/mes/service/wm/warehouse/MesWmWarehouseAreaServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mes/src/main/java/cn/iocoder/yudao/module/mes/service/wm/warehouse/MesWmWarehouseLocationServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mes/src/main/java/cn/iocoder/yudao/module/mes/service/wm/warehouse/MesWmWarehouseServiceImpl.java
  - Mapper: 135
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mes/src/main/java/cn/iocoder/yudao/module/mes/dal/mysql/wm/warehouse/MesWmWarehouseAreaMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mes/src/main/java/cn/iocoder/yudao/module/mes/dal/mysql/wm/warehouse/MesWmWarehouseLocationMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mes/src/main/java/cn/iocoder/yudao/module/mes/dal/mysql/wm/warehouse/MesWmWarehouseMapper.java
- 前端证据样本:
  - Vue: 284
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/mes/wm/warehouse/WarehouseForm.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/mes/wm/warehouse/index.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/mes/wm/warehouse/location/LocationForm.vue
  - API: 127
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/mes/wm/warehouse/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/mes/wm/warehouse/location/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/mes/wm/warehouse/area/index.ts

## mall

- 矩阵状态: PARTIAL
- all-next 六要素缺口: none
- 后端证据样本:
  - Controller: 73
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mall/yudao-module-trade/src/main/java/cn/iocoder/yudao/module/trade/controller/app/order/AppTradeOrderController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mall/yudao-module-trade/src/main/java/cn/iocoder/yudao/module/trade/controller/app/delivery/AppDeliverExpressController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mall/yudao-module-trade/src/main/java/cn/iocoder/yudao/module/trade/controller/app/delivery/AppDeliverPickUpStoreController.java
  - ServiceImpl: 51
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mall/yudao-module-trade/src/main/java/cn/iocoder/yudao/module/trade/service/price/TradePriceServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mall/yudao-module-trade/src/main/java/cn/iocoder/yudao/module/trade/service/order/TradeOrderLogServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mall/yudao-module-trade/src/main/java/cn/iocoder/yudao/module/trade/service/order/TradeOrderQueryServiceImpl.java
  - Mapper: 55
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mall/yudao-module-trade/src/main/java/cn/iocoder/yudao/module/trade/dal/mysql/order/TradeOrderItemMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mall/yudao-module-trade/src/main/java/cn/iocoder/yudao/module/trade/dal/mysql/order/TradeOrderLogMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mall/yudao-module-trade/src/main/java/cn/iocoder/yudao/module/trade/dal/mysql/order/TradeOrderMapper.java
- 前端证据样本:
  - Vue: 124
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/mall/trade/order/index.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/mall/trade/order/form/OrderDeliveryForm.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/mall/trade/order/form/OrderPickUpForm.vue
  - API: 40
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/mall/trade/order/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/mall/trade/delivery/pickUpStore/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/mall/trade/delivery/expressTemplate/index.ts

## crm

- 矩阵状态: PARTIAL
- all-next 六要素缺口: none
- 后端证据样本:
  - Controller: 24
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-crm/src/main/java/cn/iocoder/yudao/module/crm/controller/admin/statistics/CrmStatisticsCustomerController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-crm/src/main/java/cn/iocoder/yudao/module/crm/controller/admin/statistics/CrmStatisticsFunnelController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-crm/src/main/java/cn/iocoder/yudao/module/crm/controller/admin/statistics/CrmStatisticsPerformanceController.java
  - ServiceImpl: 25
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-crm/src/main/java/cn/iocoder/yudao/module/crm/service/statistics/CrmStatisticsCustomerServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-crm/src/main/java/cn/iocoder/yudao/module/crm/service/statistics/CrmStatisticsFunnelServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-crm/src/main/java/cn/iocoder/yudao/module/crm/service/statistics/CrmStatisticsPerformanceServiceImpl.java
  - Mapper: 28
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-crm/src/main/java/cn/iocoder/yudao/module/crm/dal/mysql/statistics/CrmStatisticsCustomerMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-crm/src/main/java/cn/iocoder/yudao/module/crm/dal/mysql/statistics/CrmStatisticsFunnelMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-crm/src/main/java/cn/iocoder/yudao/module/crm/dal/mysql/statistics/CrmStatisticsPerformanceMapper.java
- 前端证据样本:
  - Vue: 118
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/crm/statistics/rank/index.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/crm/statistics/rank/components/ContactCountRank.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/crm/statistics/rank/components/ContractCountRank.vue
  - API: 24
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/crm/statistics/customer.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/crm/statistics/funnel.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/crm/statistics/performance.ts

## im

- 矩阵状态: PARTIAL
- all-next 六要素缺口: none
- 后端证据样本:
  - Controller: 30
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-im/src/main/java/cn/iocoder/yudao/module/im/controller/admin/rtc/ImRtcCallController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-im/src/main/java/cn/iocoder/yudao/module/im/controller/admin/rtc/ImRtcLiveKitController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-im/src/main/java/cn/iocoder/yudao/module/im/controller/admin/message/ImChannelMessageController.java
  - ServiceImpl: 18
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-im/src/main/java/cn/iocoder/yudao/module/im/service/websocket/ImWebSocketServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-im/src/main/java/cn/iocoder/yudao/module/im/service/statistics/ImStatisticsManagerServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-im/src/main/java/cn/iocoder/yudao/module/im/service/sensitiveword/ImSensitiveWordServiceImpl.java
  - Mapper: 18
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-im/src/main/java/cn/iocoder/yudao/module/im/dal/mysql/statistics/ImStatisticsManagerMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-im/src/main/java/cn/iocoder/yudao/module/im/dal/mysql/sensitiveword/ImSensitiveWordMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-im/src/main/java/cn/iocoder/yudao/module/im/dal/mysql/rtc/ImRtcCallMapper.java
- 前端证据样本:
  - Vue: 101
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/im/manager/statistics/index.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/im/manager/statistics/components/GroupSizeChart.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/im/manager/statistics/components/MessageTrendChart.vue
  - API: 28
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/im/rtc/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/im/message/private/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/im/message/group/index.ts

## system

- 矩阵状态: PARTIAL
- all-next 六要素缺口: none
- 后端证据样本:
  - Controller: 35
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-system/src/main/java/cn/iocoder/yudao/module/system/controller/app/tenant/AppTenantController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-system/src/main/java/cn/iocoder/yudao/module/system/controller/app/ip/AppAreaController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-system/src/main/java/cn/iocoder/yudao/module/system/controller/app/dict/AppDictDataController.java
  - ServiceImpl: 34
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-system/src/main/java/cn/iocoder/yudao/module/system/service/user/AdminUserServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-system/src/main/java/cn/iocoder/yudao/module/system/service/tenant/TenantPackageServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-system/src/main/java/cn/iocoder/yudao/module/system/service/tenant/TenantServiceImpl.java
  - Mapper: 32
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-system/src/main/java/cn/iocoder/yudao/module/system/dal/mysql/user/AdminUserMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-system/src/main/java/cn/iocoder/yudao/module/system/dal/mysql/tenant/TenantMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-system/src/main/java/cn/iocoder/yudao/module/system/dal/mysql/tenant/TenantPackageMapper.java
- 前端证据样本:
  - Vue: 66
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/system/user/UserAssignRoleForm.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/system/user/UserForm.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/system/user/UserImportForm.vue
  - API: 28
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/system/user/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/system/user/profile.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/system/user/socialUser.ts

## erp

- 矩阵状态: PARTIAL
- all-next 六要素缺口: none
- 后端证据样本:
  - Controller: 23
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-erp/src/main/java/cn/iocoder/yudao/module/erp/controller/admin/stock/ErpStockCheckController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-erp/src/main/java/cn/iocoder/yudao/module/erp/controller/admin/stock/ErpStockController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-erp/src/main/java/cn/iocoder/yudao/module/erp/controller/admin/stock/ErpStockInController.java
  - ServiceImpl: 23
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-erp/src/main/java/cn/iocoder/yudao/module/erp/service/stock/ErpStockCheckServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-erp/src/main/java/cn/iocoder/yudao/module/erp/service/stock/ErpStockInServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-erp/src/main/java/cn/iocoder/yudao/module/erp/service/stock/ErpStockMoveServiceImpl.java
  - Mapper: 35
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-erp/src/main/java/cn/iocoder/yudao/module/erp/dal/mysql/stock/ErpStockCheckItemMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-erp/src/main/java/cn/iocoder/yudao/module/erp/dal/mysql/stock/ErpStockCheckMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-erp/src/main/java/cn/iocoder/yudao/module/erp/dal/mysql/stock/ErpStockInItemMapper.java
- 前端证据样本:
  - Vue: 63
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/erp/stock/warehouse/WarehouseForm.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/erp/stock/warehouse/index.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/erp/stock/stock/index.vue
  - API: 23
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/erp/stock/warehouse/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/erp/stock/stock/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/erp/stock/record/index.ts

## infra

- 矩阵状态: PARTIAL
- all-next 六要素缺口: none
- 后端证据样本:
  - Controller: 16
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-infra/src/main/java/cn/iocoder/yudao/module/infra/controller/app/file/AppFileController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-infra/src/main/java/cn/iocoder/yudao/module/infra/controller/admin/redis/RedisController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-infra/src/main/java/cn/iocoder/yudao/module/infra/controller/admin/logger/ApiAccessLogController.java
  - ServiceImpl: 15
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-infra/src/main/java/cn/iocoder/yudao/module/infra/service/logger/ApiAccessLogServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-infra/src/main/java/cn/iocoder/yudao/module/infra/service/logger/ApiErrorLogServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-infra/src/main/java/cn/iocoder/yudao/module/infra/service/job/JobLogServiceImpl.java
  - Mapper: 22
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-infra/src/main/java/cn/iocoder/yudao/module/infra/dal/mysql/logger/ApiAccessLogMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-infra/src/main/java/cn/iocoder/yudao/module/infra/dal/mysql/logger/ApiErrorLogMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-infra/src/main/java/cn/iocoder/yudao/module/infra/dal/mysql/job/JobLogMapper.java
- 前端证据样本:
  - Vue: 51
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/infra/webSocket/index.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/infra/swagger/index.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/infra/skywalking/index.vue
  - API: 16
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/infra/redis/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/infra/redis/types.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/infra/jobLog/index.ts

## wms

- 矩阵状态: PARTIAL
- all-next 六要素缺口: none
- 后端证据样本:
  - Controller: 17
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-wms/src/main/java/cn/iocoder/yudao/module/wms/controller/admin/order/shipment/WmsShipmentOrderController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-wms/src/main/java/cn/iocoder/yudao/module/wms/controller/admin/order/shipment/WmsShipmentOrderDetailController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-wms/src/main/java/cn/iocoder/yudao/module/wms/controller/admin/order/receipt/WmsReceiptOrderController.java
  - ServiceImpl: 17
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-wms/src/main/java/cn/iocoder/yudao/module/wms/service/order/shipment/WmsShipmentOrderDetailServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-wms/src/main/java/cn/iocoder/yudao/module/wms/service/order/shipment/WmsShipmentOrderServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-wms/src/main/java/cn/iocoder/yudao/module/wms/service/order/receipt/WmsReceiptOrderDetailServiceImpl.java
  - Mapper: 17
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-wms/src/main/java/cn/iocoder/yudao/module/wms/dal/mysql/order/shipment/WmsShipmentOrderDetailMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-wms/src/main/java/cn/iocoder/yudao/module/wms/dal/mysql/order/shipment/WmsShipmentOrderMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-wms/src/main/java/cn/iocoder/yudao/module/wms/dal/mysql/order/receipt/WmsReceiptOrderDetailMapper.java
- 前端证据样本:
  - Vue: 39
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/wms/order/shipment/ShipmentOrderDetail.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/wms/order/shipment/ShipmentOrderForm.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/wms/order/shipment/ShipmentOrderPrint.vue
  - API: 17
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/wms/order/shipment/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/wms/order/shipment/detail/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/wms/order/receipt/index.ts

## bpm

- 矩阵状态: PARTIAL
- all-next 六要素缺口: none
- 后端证据样本:
  - Controller: 12
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-bpm/src/main/java/cn/iocoder/yudao/module/bpm/controller/admin/task/BpmProcessInstanceController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-bpm/src/main/java/cn/iocoder/yudao/module/bpm/controller/admin/task/BpmProcessInstanceCopyController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-bpm/src/main/java/cn/iocoder/yudao/module/bpm/controller/admin/task/BpmTaskController.java
  - ServiceImpl: 13
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-bpm/src/main/java/cn/iocoder/yudao/module/bpm/service/task/BpmProcessInstanceCopyServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-bpm/src/main/java/cn/iocoder/yudao/module/bpm/service/task/BpmProcessInstanceServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-bpm/src/main/java/cn/iocoder/yudao/module/bpm/service/task/BpmTaskServiceImpl.java
  - Mapper: 8
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-bpm/src/main/java/cn/iocoder/yudao/module/bpm/dal/mysql/task/BpmProcessInstanceCopyMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-bpm/src/main/java/cn/iocoder/yudao/module/bpm/dal/mysql/oa/BpmOALeaveMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-bpm/src/main/java/cn/iocoder/yudao/module/bpm/dal/mysql/definition/BpmFormMapper.java
- 前端证据样本:
  - Vue: 45
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/bpm/task/todo/index.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/bpm/task/manager/index.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/bpm/task/done/index.vue
  - API: 12
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/bpm/userGroup/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/bpm/task/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/bpm/simple/index.ts

## iot

- 矩阵状态: PARTIAL
- all-next 六要素缺口: api, service, validator, page, permission, logAudit, test
- 后端证据样本:
  - Controller: 18
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-iot/yudao-module-iot-biz/src/main/java/cn/iocoder/yudao/module/iot/controller/admin/thingmodel/IotThingModelController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-iot/yudao-module-iot-biz/src/main/java/cn/iocoder/yudao/module/iot/controller/admin/statistics/IotStatisticsController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-iot/yudao-module-iot-biz/src/main/java/cn/iocoder/yudao/module/iot/controller/admin/rule/IotDataRuleController.java
  - ServiceImpl: 20
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-iot/yudao-module-iot-gateway/src/main/java/cn/iocoder/yudao/module/iot/gateway/service/device/IotDeviceServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-iot/yudao-module-iot-gateway/src/main/java/cn/iocoder/yudao/module/iot/gateway/service/device/message/IotDeviceMessageServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-iot/yudao-module-iot-gateway/src/main/java/cn/iocoder/yudao/module/iot/gateway/service/auth/IotDeviceTokenServiceImpl.java
  - Mapper: 15
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-iot/yudao-module-iot-biz/src/main/java/cn/iocoder/yudao/module/iot/dal/mysql/thingmodel/IotThingModelMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-iot/yudao-module-iot-biz/src/main/java/cn/iocoder/yudao/module/iot/dal/mysql/rule/IotDataRuleMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-iot/yudao-module-iot-biz/src/main/java/cn/iocoder/yudao/module/iot/dal/mysql/rule/IotDataSinkMapper.java
- 前端证据样本:
  - Vue: 91
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/iot/thingmodel/ThingModelEvent.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/iot/thingmodel/ThingModelForm.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/iot/thingmodel/ThingModelInputOutputParam.vue
  - API: 16
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/iot/thingmodel/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/iot/statistics/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/iot/rule/scene/index.ts

## mp

- 矩阵状态: PARTIAL
- all-next 六要素缺口: none
- 后端证据样本:
  - Controller: 12
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mp/src/main/java/cn/iocoder/yudao/module/mp/controller/admin/user/MpUserController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mp/src/main/java/cn/iocoder/yudao/module/mp/controller/admin/tag/MpTagController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mp/src/main/java/cn/iocoder/yudao/module/mp/controller/admin/statistics/MpStatisticsController.java
  - ServiceImpl: 9
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mp/src/main/java/cn/iocoder/yudao/module/mp/service/user/MpUserServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mp/src/main/java/cn/iocoder/yudao/module/mp/service/tag/MpTagServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mp/src/main/java/cn/iocoder/yudao/module/mp/service/statistics/MpStatisticsServiceImpl.java
  - Mapper: 8
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mp/src/main/java/cn/iocoder/yudao/module/mp/dal/mysql/user/MpUserMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mp/src/main/java/cn/iocoder/yudao/module/mp/dal/mysql/tag/MpTagMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-mp/src/main/java/cn/iocoder/yudao/module/mp/dal/mysql/message/MpAutoReplyMapper.java
- 前端证据样本:
  - Vue: 46
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/mp/user/UserForm.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/mp/user/index.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/mp/tag/TagForm.vue
  - API: 11
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/mp/user/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/mp/tag/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/mp/statistics/index.ts

## ai

- 矩阵状态: PARTIAL
- all-next 六要素缺口: api, service, validator, page, permission, logAudit, test
- 后端证据样本:
  - Controller: 14
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-ai/src/main/java/cn/iocoder/yudao/module/ai/controller/admin/write/AiWriteController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-ai/src/main/java/cn/iocoder/yudao/module/ai/controller/admin/workflow/AiWorkflowController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-ai/src/main/java/cn/iocoder/yudao/module/ai/controller/admin/music/AiMusicController.java
  - ServiceImpl: 14
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-ai/src/main/java/cn/iocoder/yudao/module/ai/service/write/AiWriteServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-ai/src/main/java/cn/iocoder/yudao/module/ai/service/workflow/AiWorkflowServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-ai/src/main/java/cn/iocoder/yudao/module/ai/service/music/AiMusicServiceImpl.java
  - Mapper: 14
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-ai/src/main/java/cn/iocoder/yudao/module/ai/dal/mysql/write/AiWriteMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-ai/src/main/java/cn/iocoder/yudao/module/ai/dal/mysql/workflow/AiWorkflowMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-ai/src/main/java/cn/iocoder/yudao/module/ai/dal/mysql/music/AiMusicMapper.java
- 前端证据样本:
  - Vue: 69
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/ai/write/manager/index.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/ai/write/index/index.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/ai/write/index/components/Left.vue
  - API: 14
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/ai/write/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/ai/workflow/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/ai/music/index.ts

## member

- 矩阵状态: PARTIAL
- all-next 六要素缺口: api, service, validator, page, permission, logAudit, test
- 后端证据样本:
  - Controller: 20
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-member/src/main/java/cn/iocoder/yudao/module/member/controller/app/user/AppMemberUserController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-member/src/main/java/cn/iocoder/yudao/module/member/controller/app/social/AppSocialUserController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-member/src/main/java/cn/iocoder/yudao/module/member/controller/app/signin/AppMemberSignInConfigController.java
  - ServiceImpl: 12
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-member/src/main/java/cn/iocoder/yudao/module/member/service/user/MemberUserServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-member/src/main/java/cn/iocoder/yudao/module/member/service/tag/MemberTagServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-member/src/main/java/cn/iocoder/yudao/module/member/service/signin/MemberSignInConfigServiceImpl.java
  - Mapper: 11
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-member/src/main/java/cn/iocoder/yudao/module/member/dal/mysql/user/MemberUserMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-member/src/main/java/cn/iocoder/yudao/module/member/dal/mysql/tag/MemberTagMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-member/src/main/java/cn/iocoder/yudao/module/member/dal/mysql/signin/MemberSignInConfigMapper.java
- 前端证据样本:
  - Vue: 32
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/member/user/UserForm.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/member/user/index.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/member/user/detail/UserAccountInfo.vue
  - API: 10
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/member/user/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/member/tag/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/member/signin/record/index.ts

## pay

- 矩阵状态: PARTIAL
- all-next 六要素缺口: api, service, validator, page, permission, logAudit, test
- 后端证据样本:
  - Controller: 19
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-pay/src/main/java/cn/iocoder/yudao/module/pay/controller/app/wallet/AppPayWalletController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-pay/src/main/java/cn/iocoder/yudao/module/pay/controller/app/wallet/AppPayWalletRechargeController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-pay/src/main/java/cn/iocoder/yudao/module/pay/controller/app/wallet/AppPayWalletRechargePackageController.java
  - ServiceImpl: 12
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-pay/src/main/java/cn/iocoder/yudao/module/pay/service/wallet/PayWalletRechargePackageServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-pay/src/main/java/cn/iocoder/yudao/module/pay/service/wallet/PayWalletRechargeServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-pay/src/main/java/cn/iocoder/yudao/module/pay/service/wallet/PayWalletServiceImpl.java
  - Mapper: 14
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-pay/src/main/java/cn/iocoder/yudao/module/pay/dal/mysql/wallet/PayWalletMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-pay/src/main/java/cn/iocoder/yudao/module/pay/dal/mysql/wallet/PayWalletRechargeMapper.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-pay/src/main/java/cn/iocoder/yudao/module/pay/dal/mysql/wallet/PayWalletRechargePackageMapper.java
- 前端证据样本:
  - Vue: 23
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/pay/wallet/transaction/WalletTransactionList.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/pay/wallet/rechargePackage/WalletRechargePackageForm.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/pay/wallet/rechargePackage/index.vue
  - API: 11
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/pay/wallet/transaction/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/pay/wallet/rechargePackage/index.ts
    - apps/ruoyi/yudao-ui-admin-vue3/src/api/pay/wallet/balance/index.ts

## report

- 矩阵状态: PARTIAL
- all-next 六要素缺口: api, service, validator, page, permission, logAudit, test
- 后端证据样本:
  - Controller: 2
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-report/src/main/java/cn/iocoder/yudao/module/report/controller/admin/goview/GoViewDataController.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-report/src/main/java/cn/iocoder/yudao/module/report/controller/admin/goview/GoViewProjectController.java
  - ServiceImpl: 4
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-report/src/main/java/cn/iocoder/yudao/module/report/service/goview/GoViewDataServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-report/src/main/java/cn/iocoder/yudao/module/report/service/goview/GoViewProjectServiceImpl.java
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-report/src/main/java/cn/iocoder/yudao/module/report/framework/jmreport/core/service/JmOnlDragExternalServiceImpl.java
  - Mapper: 1
    - apps/ruoyi/ruoyi-vue-pro/yudao-module-report/src/main/java/cn/iocoder/yudao/module/report/dal/mysql/goview/GoViewProjectMapper.java
- 前端证据样本:
  - Vue: 3
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/report/jmreport/bi.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/report/jmreport/index.vue
    - apps/ruoyi/yudao-ui-admin-vue3/src/views/report/goview/index.vue
  - API: 0

## 说明

1. 该报告用于全量复制执行分解，非质量验收结论。
2. 完整证据路径明细请查看同名 JSON。
3. 六要素判定为静态扫描，开发完成后仍需测试与评审。
