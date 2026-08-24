// Auto-generated Flutter Model for 物料SKU

class WmsItemSkuModel {
  final String id;
  final String? item_id;
  final String? sku_code;
  final String? sku_name;
  final String? barcode;

  WmsItemSkuModel({
    required this.id,
    this.item_id,
    this.sku_code,
    this.sku_name,
    this.barcode,
  });

  factory WmsItemSkuModel.fromJson(Map<String, dynamic> json) {
    return WmsItemSkuModel(
      id: json['id'] as String? ?? '',
      item_id: json['item_id']?.toString(),
      sku_code: json['sku_code']?.toString(),
      sku_name: json['sku_name']?.toString(),
      barcode: json['barcode']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'item_id': item_id,
      'sku_code': sku_code,
      'sku_name': sku_name,
      'barcode': barcode,
    };
  }
}
