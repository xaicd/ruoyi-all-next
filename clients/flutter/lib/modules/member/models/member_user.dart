class MemberUser {
  final String id;
  final String nickname;
  final String mobile;
  final int point;

  MemberUser({
    required this.id,
    required this.nickname,
    required this.mobile,
    required this.point,
  });

  factory MemberUser.fromJson(Map<String, dynamic> json) {
    return MemberUser(
      id: json['id'] ?? '',
      nickname: json['nickname'] ?? '',
      mobile: json['mobile'] ?? '',
      point: json['point'] ?? 0,
    );
  }
}
