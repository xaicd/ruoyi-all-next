// Auto-generated Flutter Service for 物料SKU
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/wms_item_sku_model.dart';

class WmsItemSkuService {
  final String baseUrl;
  WmsItemSkuService({required this.baseUrl});

  Future<List<WmsItemSkuModel>> fetchList() async {
    final response = await http.get(Uri.parse('$baseUrl/api/v1/app/wms/wms-item-sku'));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final items = (data['data']?['items'] as List?) ?? [];
      return items.map((i) => WmsItemSkuModel.fromJson(i)).toList();
    }
    throw Exception('Failed to load 物料SKU');
  }
}
