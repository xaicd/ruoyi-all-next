// Auto-generated Flutter Service for 商机报备与锁定
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/aigw_partner_lead_model.dart';

class AigwPartnerLeadService {
  final String baseUrl;
  AigwPartnerLeadService({required this.baseUrl});

  Future<List<AigwPartnerLeadModel>> fetchList() async {
    final response = await http.get(Uri.parse('$baseUrl/api/v1/app/aigw/aigw-partner-lead'));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final items = (data['data']?['items'] as List?) ?? [];
      return items.map((i) => AigwPartnerLeadModel.fromJson(i)).toList();
    }
    throw Exception('Failed to load 商机报备与锁定');
  }
}
