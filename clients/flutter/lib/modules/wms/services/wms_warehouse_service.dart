// Auto-generated Flutter Service for 智能仓库
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/wms_warehouse_model.dart';

class WmsWarehouseService {
  final String baseUrl;
  WmsWarehouseService({required this.baseUrl});

  Future<List<WmsWarehouseModel>> fetchList() async {
    final response = await http.get(Uri.parse('$baseUrl/api/v1/app/wms/wms-warehouse'));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final items = (data['data']?['items'] as List?) ?? [];
      return items.map((i) => WmsWarehouseModel.fromJson(i)).toList();
    }
    throw Exception('Failed to load 智能仓库');
  }
}
