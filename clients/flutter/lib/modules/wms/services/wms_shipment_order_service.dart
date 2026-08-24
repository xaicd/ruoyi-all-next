// Auto-generated Flutter Service for 出库单
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/wms_shipment_order_model.dart';

class WmsShipmentOrderService {
  final String baseUrl;
  WmsShipmentOrderService({required this.baseUrl});

  Future<List<WmsShipmentOrderModel>> fetchList() async {
    final response = await http.get(Uri.parse('$baseUrl/api/v1/app/wms/wms-shipment-order'));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final items = (data['data']?['items'] as List?) ?? [];
      return items.map((i) => WmsShipmentOrderModel.fromJson(i)).toList();
    }
    throw Exception('Failed to load 出库单');
  }
}
