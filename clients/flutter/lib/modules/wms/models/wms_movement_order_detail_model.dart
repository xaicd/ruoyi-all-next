// Auto-generated Flutter Model for 移库明细

class WmsMovementOrderDetailModel {
  final String id;
  final String? movement_order_id;
  final String? item_id;
  final String? qty;

  WmsMovementOrderDetailModel({
    required this.id,
    this.movement_order_id,
    this.item_id,
    this.qty,
  });

  factory WmsMovementOrderDetailModel.fromJson(Map<String, dynamic> json) {
    return WmsMovementOrderDetailModel(
      id: json['id'] as String? ?? '',
      movement_order_id: json['movement_order_id']?.toString(),
      item_id: json['item_id']?.toString(),
      qty: json['qty']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'movement_order_id': movement_order_id,
      'item_id': item_id,
      'qty': qty,
    };
  }
}
