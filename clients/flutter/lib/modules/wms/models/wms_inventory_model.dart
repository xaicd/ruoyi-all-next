// Auto-generated Flutter Model for 实时库存

class WmsInventoryModel {
  final String id;
  final String? warehouse_id;
  final String? item_id;
  final String? merchant_id;
  final String? qty;

  WmsInventoryModel({
    required this.id,
    this.warehouse_id,
    this.item_id,
    this.merchant_id,
    this.qty,
  });

  factory WmsInventoryModel.fromJson(Map<String, dynamic> json) {
    return WmsInventoryModel(
      id: json['id'] as String? ?? '',
      warehouse_id: json['warehouse_id']?.toString(),
      item_id: json['item_id']?.toString(),
      merchant_id: json['merchant_id']?.toString(),
      qty: json['qty']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'warehouse_id': warehouse_id,
      'item_id': item_id,
      'merchant_id': merchant_id,
      'qty': qty,
    };
  }
}
