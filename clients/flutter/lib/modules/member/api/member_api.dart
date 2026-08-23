import '../../../shared/http_client.dart';
import '../models/member_user.dart';

class MemberApi {
  static Future<MemberUser> getProfile() async {
    final res = await RuoyiHttpClient.dio.get('/app/member/user/profile');
    return MemberUser.fromJson(res.data['data']);
  }
}
