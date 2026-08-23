import 'package:flutter/material.dart';
import '../components/member_avatar.dart';

class MemberProfilePage extends StatelessWidget {
  const MemberProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('会员中心')),
      body: const Center(
        child: MemberAvatar(nickname: 'Flutter 会员'),
      ),
    );
  }
}
