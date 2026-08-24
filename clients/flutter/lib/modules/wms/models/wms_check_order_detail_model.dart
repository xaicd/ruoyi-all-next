// Auto-generated Flutter Model for 盘点明细

class WmsCheckOrderDetailModel {
  final String id;
  final String? check_order_id;
  final String? item_id;
  final String? system_qty;
  final String? check_qty;

  WmsCheckOrderDetailModel({
    required this.id,
    this.check_order_id,
    this.item_id,
    this.system_qty,
    this.check_qty,
  });

  factory WmsCheckOrderDetailModel.fromJson(Map<String, dynamic> json) {
    return WmsCheckOrderDetailModel(
      id: json['id'] as String? ?? '',
      check_order_id: json['check_order_id']?.toString(),
      item_id: json['item_id']?.toString(),
      system_qty: json['system_qty']?.toString(),
      check_qty: json['check_qty']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'check_order_id': check_order_id,
      'item_id': item_id,
      'system_qty': system_qty,
      'check_qty': check_qty,
    };
  }
}
