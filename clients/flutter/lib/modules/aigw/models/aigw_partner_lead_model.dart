// Auto-generated Flutter Model for 商机报备与锁定

class AigwPartnerLeadModel {
  final String id;
  final String? lead_no;
  final String? partner_id;
  final String? partner_name;
  final String? customer_name;

  AigwPartnerLeadModel({
    required this.id,
    this.lead_no,
    this.partner_id,
    this.partner_name,
    this.customer_name,
  });

  factory AigwPartnerLeadModel.fromJson(Map<String, dynamic> json) {
    return AigwPartnerLeadModel(
      id: json['id'] as String? ?? '',
      lead_no: json['lead_no']?.toString(),
      partner_id: json['partner_id']?.toString(),
      partner_name: json['partner_name']?.toString(),
      customer_name: json['customer_name']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'lead_no': lead_no,
      'partner_id': partner_id,
      'partner_name': partner_name,
      'customer_name': customer_name,
    };
  }
}
