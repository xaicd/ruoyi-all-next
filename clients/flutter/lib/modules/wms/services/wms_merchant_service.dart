// Auto-generated Flutter Service for 货主管理
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/wms_merchant_model.dart';

class WmsMerchantService {
  final String baseUrl;
  WmsMerchantService({required this.baseUrl});

  Future<List<WmsMerchantModel>> fetchList() async {
    final response = await http.get(Uri.parse('$baseUrl/api/v1/app/wms/wms-merchant'));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final items = (data['data']?['items'] as List?) ?? [];
      return items.map((i) => WmsMerchantModel.fromJson(i)).toList();
    }
    throw Exception('Failed to load 货主管理');
  }
}
