// Auto-generated Flutter Model for 库存流水

class WmsInventoryHistoryModel {
  final String id;
  final String? warehouse_id;
  final String? item_id;
  final String? change_type;
  final String? qty_change;

  WmsInventoryHistoryModel({
    required this.id,
    this.warehouse_id,
    this.item_id,
    this.change_type,
    this.qty_change,
  });

  factory WmsInventoryHistoryModel.fromJson(Map<String, dynamic> json) {
    return WmsInventoryHistoryModel(
      id: json['id'] as String? ?? '',
      warehouse_id: json['warehouse_id']?.toString(),
      item_id: json['item_id']?.toString(),
      change_type: json['change_type']?.toString(),
      qty_change: json['qty_change']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'warehouse_id': warehouse_id,
      'item_id': item_id,
      'change_type': change_type,
      'qty_change': qty_change,
    };
  }
}
