// Auto-generated Flutter Model for 物料品牌

class WmsItemBrandModel {
  final String id;
  final String? name;
  final String? code;
  final String? logo;
  final String? status;

  WmsItemBrandModel({
    required this.id,
    this.name,
    this.code,
    this.logo,
    this.status,
  });

  factory WmsItemBrandModel.fromJson(Map<String, dynamic> json) {
    return WmsItemBrandModel(
      id: json['id'] as String? ?? '',
      name: json['name']?.toString(),
      code: json['code']?.toString(),
      logo: json['logo']?.toString(),
      status: json['status']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'code': code,
      'logo': logo,
      'status': status,
    };
  }
}
