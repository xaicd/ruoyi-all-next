// Auto-generated Flutter Model for 入库单

class WmsReceiptOrderModel {
  final String id;
  final String? order_no;
  final String? receipt_type;
  final String? warehouse_id;
  final String? merchant_id;

  WmsReceiptOrderModel({
    required this.id,
    this.order_no,
    this.receipt_type,
    this.warehouse_id,
    this.merchant_id,
  });

  factory WmsReceiptOrderModel.fromJson(Map<String, dynamic> json) {
    return WmsReceiptOrderModel(
      id: json['id'] as String? ?? '',
      order_no: json['order_no']?.toString(),
      receipt_type: json['receipt_type']?.toString(),
      warehouse_id: json['warehouse_id']?.toString(),
      merchant_id: json['merchant_id']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'order_no': order_no,
      'receipt_type': receipt_type,
      'warehouse_id': warehouse_id,
      'merchant_id': merchant_id,
    };
  }
}
