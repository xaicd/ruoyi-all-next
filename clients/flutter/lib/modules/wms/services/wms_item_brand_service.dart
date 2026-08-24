// Auto-generated Flutter Service for 物料品牌
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/wms_item_brand_model.dart';

class WmsItemBrandService {
  final String baseUrl;
  WmsItemBrandService({required this.baseUrl});

  Future<List<WmsItemBrandModel>> fetchList() async {
    final response = await http.get(Uri.parse('$baseUrl/api/v1/app/wms/wms-item-brand'));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final items = (data['data']?['items'] as List?) ?? [];
      return items.map((i) => WmsItemBrandModel.fromJson(i)).toList();
    }
    throw Exception('Failed to load 物料品牌');
  }
}
