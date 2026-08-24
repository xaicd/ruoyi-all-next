// Auto-generated Flutter Service for 移库单
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/wms_movement_order_model.dart';

class WmsMovementOrderService {
  final String baseUrl;
  WmsMovementOrderService({required this.baseUrl});

  Future<List<WmsMovementOrderModel>> fetchList() async {
    final response = await http.get(Uri.parse('$baseUrl/api/v1/app/wms/wms-movement-order'));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final items = (data['data']?['items'] as List?) ?? [];
      return items.map((i) => WmsMovementOrderModel.fromJson(i)).toList();
    }
    throw Exception('Failed to load 移库单');
  }
}
