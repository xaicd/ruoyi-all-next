import {
  type CodegenConfig,
  type CodegenOutput,
  formColumns,
  toKebab,
  toPascal,
} from "./common"

export function generateClientFlutter(config: CodegenConfig): CodegenOutput[] {
  const { className, moduleName, businessName } = config
  const kebab = toKebab(className)
  const snake = kebab.replace(/-/g, "_")
  const displayCols = formColumns(config).slice(0, 4)

  const modelContent = `// Auto-generated Flutter Model for ${businessName}

class ${className}Model {
  final String id;
${displayCols.map((c) => `  final String? ${c.name};`).join("\n")}

  ${className}Model({
    required this.id,
${displayCols.map((c) => `    this.${c.name},`).join("\n")}
  });

  factory ${className}Model.fromJson(Map<String, dynamic> json) {
    return ${className}Model(
      id: json['id'] as String? ?? '',
${displayCols.map((c) => `      ${c.name}: json['${c.name}']?.toString(),`).join("\n")}
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
${displayCols.map((c) => `      '${c.name}': ${c.name},`).join("\n")}
    };
  }
}
`

  const serviceContent = `// Auto-generated Flutter Service for ${businessName}
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/${snake}_model.dart';

class ${className}Service {
  final String baseUrl;
  ${className}Service({required this.baseUrl});

  Future<List<${className}Model>> fetchList() async {
    final response = await http.get(Uri.parse('$baseUrl/api/v1/app/${moduleName}/${kebab}'));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final items = (data['data']?['items'] as List?) ?? [];
      return items.map((i) => ${className}Model.fromJson(i)).toList();
    }
    throw Exception('Failed to load ${businessName}');
  }
}
`

  return [
    {
      path: `clients/flutter/lib/modules/${moduleName}/models/${snake}_model.dart`,
      content: modelContent,
      type: "type",
    },
    {
      path: `clients/flutter/lib/modules/${moduleName}/services/${snake}_service.dart`,
      content: serviceContent,
      type: "service",
    },
  ]
}
