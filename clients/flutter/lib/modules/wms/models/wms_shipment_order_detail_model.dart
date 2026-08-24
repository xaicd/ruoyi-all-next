// Auto-generated Flutter Model for 出库明细

class WmsShipmentOrderDetailModel {
  final String id;
  final String? shipment_order_id;
  final String? item_id;
  final String? plan_qty;
  final String? real_qty;

  WmsShipmentOrderDetailModel({
    required this.id,
    this.shipment_order_id,
    this.item_id,
    this.plan_qty,
    this.real_qty,
  });

  factory WmsShipmentOrderDetailModel.fromJson(Map<String, dynamic> json) {
    return WmsShipmentOrderDetailModel(
      id: json['id'] as String? ?? '',
      shipment_order_id: json['shipment_order_id']?.toString(),
      item_id: json['item_id']?.toString(),
      plan_qty: json['plan_qty']?.toString(),
      real_qty: json['real_qty']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'shipment_order_id': shipment_order_id,
      'item_id': item_id,
      'plan_qty': plan_qty,
      'real_qty': real_qty,
    };
  }
}
