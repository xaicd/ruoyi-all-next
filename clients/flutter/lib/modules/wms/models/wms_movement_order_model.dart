// Auto-generated Flutter Model for 移库单

class WmsMovementOrderModel {
  final String id;
  final String? order_no;
  final String? from_warehouse_id;
  final String? to_warehouse_id;
  final String? total_qty;

  WmsMovementOrderModel({
    required this.id,
    this.order_no,
    this.from_warehouse_id,
    this.to_warehouse_id,
    this.total_qty,
  });

  factory WmsMovementOrderModel.fromJson(Map<String, dynamic> json) {
    return WmsMovementOrderModel(
      id: json['id'] as String? ?? '',
      order_no: json['order_no']?.toString(),
      from_warehouse_id: json['from_warehouse_id']?.toString(),
      to_warehouse_id: json['to_warehouse_id']?.toString(),
      total_qty: json['total_qty']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'order_no': order_no,
      'from_warehouse_id': from_warehouse_id,
      'to_warehouse_id': to_warehouse_id,
      'total_qty': total_qty,
    };
  }
}
