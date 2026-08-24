// Auto-generated Flutter Model for 入库明细

class WmsReceiptOrderDetailModel {
  final String id;
  final String? receipt_order_id;
  final String? item_id;
  final String? plan_qty;
  final String? real_qty;

  WmsReceiptOrderDetailModel({
    required this.id,
    this.receipt_order_id,
    this.item_id,
    this.plan_qty,
    this.real_qty,
  });

  factory WmsReceiptOrderDetailModel.fromJson(Map<String, dynamic> json) {
    return WmsReceiptOrderDetailModel(
      id: json['id'] as String? ?? '',
      receipt_order_id: json['receipt_order_id']?.toString(),
      item_id: json['item_id']?.toString(),
      plan_qty: json['plan_qty']?.toString(),
      real_qty: json['real_qty']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'receipt_order_id': receipt_order_id,
      'item_id': item_id,
      'plan_qty': plan_qty,
      'real_qty': real_qty,
    };
  }
}
