// Auto-generated Flutter Model for 智能仓库

class WmsWarehouseModel {
  final String id;
  final String? code;
  final String? name;
  final String? capacity;
  final String? active;

  WmsWarehouseModel({
    required this.id,
    this.code,
    this.name,
    this.capacity,
    this.active,
  });

  factory WmsWarehouseModel.fromJson(Map<String, dynamic> json) {
    return WmsWarehouseModel(
      id: json['id'] as String? ?? '',
      code: json['code']?.toString(),
      name: json['name']?.toString(),
      capacity: json['capacity']?.toString(),
      active: json['active']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'code': code,
      'name': name,
      'capacity': capacity,
      'active': active,
    };
  }
}
