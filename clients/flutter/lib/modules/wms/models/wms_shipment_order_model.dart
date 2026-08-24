// Auto-generated Flutter Model for 出库单

class WmsShipmentOrderModel {
  final String id;
  final String? order_no;
  final String? shipment_type;
  final String? warehouse_id;
  final String? merchant_id;

  WmsShipmentOrderModel({
    required this.id,
    this.order_no,
    this.shipment_type,
    this.warehouse_id,
    this.merchant_id,
  });

  factory WmsShipmentOrderModel.fromJson(Map<String, dynamic> json) {
    return WmsShipmentOrderModel(
      id: json['id'] as String? ?? '',
      order_no: json['order_no']?.toString(),
      shipment_type: json['shipment_type']?.toString(),
      warehouse_id: json['warehouse_id']?.toString(),
      merchant_id: json['merchant_id']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'order_no': order_no,
      'shipment_type': shipment_type,
      'warehouse_id': warehouse_id,
      'merchant_id': merchant_id,
    };
  }
}
