// Auto-generated Flutter Model for 渠道代理商

class AigwPartnerModel {
  final String id;
  final String? partner_code;
  final String? name;
  final String? level;
  final String? registered_capital;

  AigwPartnerModel({
    required this.id,
    this.partner_code,
    this.name,
    this.level,
    this.registered_capital,
  });

  factory AigwPartnerModel.fromJson(Map<String, dynamic> json) {
    return AigwPartnerModel(
      id: json['id'] as String? ?? '',
      partner_code: json['partner_code']?.toString(),
      name: json['name']?.toString(),
      level: json['level']?.toString(),
      registered_capital: json['registered_capital']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'partner_code': partner_code,
      'name': name,
      'level': level,
      'registered_capital': registered_capital,
    };
  }
}
