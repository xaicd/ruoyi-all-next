// Auto-generated Flutter Service for 物料分类
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/wms_item_category_model.dart';

class WmsItemCategoryService {
  final String baseUrl;
  WmsItemCategoryService({required this.baseUrl});

  Future<List<WmsItemCategoryModel>> fetchList() async {
    final response = await http.get(Uri.parse('$baseUrl/api/v1/app/wms/wms-item-category'));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final items = (data['data']?['items'] as List?) ?? [];
      return items.map((i) => WmsItemCategoryModel.fromJson(i)).toList();
    }
    throw Exception('Failed to load 物料分类');
  }
}
