// Auto-generated Flutter Service for 实时库存
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/wms_inventory_model.dart';

class WmsInventoryService {
  final String baseUrl;
  WmsInventoryService({required this.baseUrl});

  Future<List<WmsInventoryModel>> fetchList() async {
    final response = await http.get(Uri.parse('$baseUrl/api/v1/app/wms/wms-inventory'));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final items = (data['data']?['items'] as List?) ?? [];
      return items.map((i) => WmsInventoryModel.fromJson(i)).toList();
    }
    throw Exception('Failed to load 实时库存');
  }
}
