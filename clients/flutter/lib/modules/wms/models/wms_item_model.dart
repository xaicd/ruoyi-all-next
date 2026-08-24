// Auto-generated Flutter Model for 物料主数据

class WmsItemModel {
  final String id;
  final String? item_code;
  final String? item_name;
  final String? category_id;
  final String? brand_id;

  WmsItemModel({
    required this.id,
    this.item_code,
    this.item_name,
    this.category_id,
    this.brand_id,
  });

  factory WmsItemModel.fromJson(Map<String, dynamic> json) {
    return WmsItemModel(
      id: json['id'] as String? ?? '',
      item_code: json['item_code']?.toString(),
      item_name: json['item_name']?.toString(),
      category_id: json['category_id']?.toString(),
      brand_id: json['brand_id']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'item_code': item_code,
      'item_name': item_name,
      'category_id': category_id,
      'brand_id': brand_id,
    };
  }
}
