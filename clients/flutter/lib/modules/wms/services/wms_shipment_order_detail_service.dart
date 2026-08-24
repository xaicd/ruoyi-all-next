// Auto-generated Flutter Service for 出库明细
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/wms_shipment_order_detail_model.dart';

class WmsShipmentOrderDetailService {
  final String baseUrl;
  WmsShipmentOrderDetailService({required this.baseUrl});

  Future<List<WmsShipmentOrderDetailModel>> fetchList() async {
    final response = await http.get(Uri.parse('$baseUrl/api/v1/app/wms/wms-shipment-order-detail'));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final items = (data['data']?['items'] as List?) ?? [];
      return items.map((i) => WmsShipmentOrderDetailModel.fromJson(i)).toList();
    }
    throw Exception('Failed to load 出库明细');
  }
}
