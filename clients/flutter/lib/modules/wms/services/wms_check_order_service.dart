// Auto-generated Flutter Service for 盘点单
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/wms_check_order_model.dart';

class WmsCheckOrderService {
  final String baseUrl;
  WmsCheckOrderService({required this.baseUrl});

  Future<List<WmsCheckOrderModel>> fetchList() async {
    final response = await http.get(Uri.parse('$baseUrl/api/v1/app/wms/wms-check-order'));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final items = (data['data']?['items'] as List?) ?? [];
      return items.map((i) => WmsCheckOrderModel.fromJson(i)).toList();
    }
    throw Exception('Failed to load 盘点单');
  }
}
