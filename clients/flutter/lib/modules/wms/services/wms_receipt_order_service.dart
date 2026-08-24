// Auto-generated Flutter Service for 入库单
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/wms_receipt_order_model.dart';

class WmsReceiptOrderService {
  final String baseUrl;
  WmsReceiptOrderService({required this.baseUrl});

  Future<List<WmsReceiptOrderModel>> fetchList() async {
    final response = await http.get(Uri.parse('$baseUrl/api/v1/app/wms/wms-receipt-order'));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final items = (data['data']?['items'] as List?) ?? [];
      return items.map((i) => WmsReceiptOrderModel.fromJson(i)).toList();
    }
    throw Exception('Failed to load 入库单');
  }
}
