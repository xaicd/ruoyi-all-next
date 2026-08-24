// Auto-generated Flutter Service for 移库明细
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/wms_movement_order_detail_model.dart';

class WmsMovementOrderDetailService {
  final String baseUrl;
  WmsMovementOrderDetailService({required this.baseUrl});

  Future<List<WmsMovementOrderDetailModel>> fetchList() async {
    final response = await http.get(Uri.parse('$baseUrl/api/v1/app/wms/wms-movement-order-detail'));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final items = (data['data']?['items'] as List?) ?? [];
      return items.map((i) => WmsMovementOrderDetailModel.fromJson(i)).toList();
    }
    throw Exception('Failed to load 移库明细');
  }
}
