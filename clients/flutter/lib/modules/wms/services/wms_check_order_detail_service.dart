// Auto-generated Flutter Service for 盘点明细
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/wms_check_order_detail_model.dart';

class WmsCheckOrderDetailService {
  final String baseUrl;
  WmsCheckOrderDetailService({required this.baseUrl});

  Future<List<WmsCheckOrderDetailModel>> fetchList() async {
    final response = await http.get(Uri.parse('$baseUrl/api/v1/app/wms/wms-check-order-detail'));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final items = (data['data']?['items'] as List?) ?? [];
      return items.map((i) => WmsCheckOrderDetailModel.fromJson(i)).toList();
    }
    throw Exception('Failed to load 盘点明细');
  }
}
