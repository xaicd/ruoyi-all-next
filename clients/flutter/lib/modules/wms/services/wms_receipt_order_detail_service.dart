// Auto-generated Flutter Service for 入库明细
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/wms_receipt_order_detail_model.dart';

class WmsReceiptOrderDetailService {
  final String baseUrl;
  WmsReceiptOrderDetailService({required this.baseUrl});

  Future<List<WmsReceiptOrderDetailModel>> fetchList() async {
    final response = await http.get(Uri.parse('$baseUrl/api/v1/app/wms/wms-receipt-order-detail'));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final items = (data['data']?['items'] as List?) ?? [];
      return items.map((i) => WmsReceiptOrderDetailModel.fromJson(i)).toList();
    }
    throw Exception('Failed to load 入库明细');
  }
}
