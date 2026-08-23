import 'package:dio/dio.dart';

class RuoyiHttpClient {
  static final Dio dio = Dio(
    BaseOptions(
      baseUrl: 'https://api.example.com/api/v1',
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Channel': 'flutter',
      },
    ),
  );
}
