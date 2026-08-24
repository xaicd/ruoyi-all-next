// Auto-generated Flutter Model for 盘点单

class WmsCheckOrderModel {
  final String id;
  final String? order_no;
  final String? warehouse_id;
  final String? check_type;
  final String? status;

  WmsCheckOrderModel({
    required this.id,
    this.order_no,
    this.warehouse_id,
    this.check_type,
    this.status,
  });

  factory WmsCheckOrderModel.fromJson(Map<String, dynamic> json) {
    return WmsCheckOrderModel(
      id: json['id'] as String? ?? '',
      order_no: json['order_no']?.toString(),
      warehouse_id: json['warehouse_id']?.toString(),
      check_type: json['check_type']?.toString(),
      status: json['status']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'order_no': order_no,
      'warehouse_id': warehouse_id,
      'check_type': check_type,
      'status': status,
    };
  }
}
