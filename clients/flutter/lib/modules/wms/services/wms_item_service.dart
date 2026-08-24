// Auto-generated Flutter Service for 物料主数据
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/wms_item_model.dart';

class WmsItemService {
  final String baseUrl;
  WmsItemService({required this.baseUrl});

  Future<List<WmsItemModel>> fetchList() async {
    final response = await http.get(Uri.parse('$baseUrl/api/v1/app/wms/wms-item'));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final items = (data['data']?['items'] as List?) ?? [];
      return items.map((i) => WmsItemModel.fromJson(i)).toList();
    }
    throw Exception('Failed to load 物料主数据');
  }
}
