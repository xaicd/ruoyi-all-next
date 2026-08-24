// Auto-generated Flutter Service for 渠道代理商
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/aigw_partner_model.dart';

class AigwPartnerService {
  final String baseUrl;
  AigwPartnerService({required this.baseUrl});

  Future<List<AigwPartnerModel>> fetchList() async {
    final response = await http.get(Uri.parse('$baseUrl/api/v1/app/aigw/aigw-partner'));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final items = (data['data']?['items'] as List?) ?? [];
      return items.map((i) => AigwPartnerModel.fromJson(i)).toList();
    }
    throw Exception('Failed to load 渠道代理商');
  }
}
