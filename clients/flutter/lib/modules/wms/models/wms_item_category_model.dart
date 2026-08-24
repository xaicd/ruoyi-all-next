// Auto-generated Flutter Model for 物料分类

class WmsItemCategoryModel {
  final String id;
  final String? parent_id;
  final String? name;
  final String? code;
  final String? sort;

  WmsItemCategoryModel({
    required this.id,
    this.parent_id,
    this.name,
    this.code,
    this.sort,
  });

  factory WmsItemCategoryModel.fromJson(Map<String, dynamic> json) {
    return WmsItemCategoryModel(
      id: json['id'] as String? ?? '',
      parent_id: json['parent_id']?.toString(),
      name: json['name']?.toString(),
      code: json['code']?.toString(),
      sort: json['sort']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'parent_id': parent_id,
      'name': name,
      'code': code,
      'sort': sort,
    };
  }
}
