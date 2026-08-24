// Auto-generated Flutter Model for 货主管理

class WmsMerchantModel {
  final String id;
  final String? code;
  final String? name;
  final String? contact_name;
  final String? contact_phone;

  WmsMerchantModel({
    required this.id,
    this.code,
    this.name,
    this.contact_name,
    this.contact_phone,
  });

  factory WmsMerchantModel.fromJson(Map<String, dynamic> json) {
    return WmsMerchantModel(
      id: json['id'] as String? ?? '',
      code: json['code']?.toString(),
      name: json['name']?.toString(),
      contact_name: json['contact_name']?.toString(),
      contact_phone: json['contact_phone']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'code': code,
      'name': name,
      'contact_name': contact_name,
      'contact_phone': contact_phone,
    };
  }
}
