// Auto-generated Flutter Service for 库存流水
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/wms_inventory_history_model.dart';

class WmsInventoryHistoryService {
  final String baseUrl;
  WmsInventoryHistoryService({required this.baseUrl});

  Future<List<WmsInventoryHistoryModel>> fetchList() async {
    final response = await http.get(Uri.parse('$baseUrl/api/v1/app/wms/wms-inventory-history'));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final items = (data['data']?['items'] as List?) ?? [];
      return items.map((i) => WmsInventoryHistoryModel.fromJson(i)).toList();
    }
    throw Exception('Failed to load 库存流水');
  }
}
