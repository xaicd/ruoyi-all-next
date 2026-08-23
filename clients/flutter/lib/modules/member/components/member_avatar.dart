import 'package:flutter/material.dart';

class MemberAvatar extends StatelessWidget {
  final String nickname;
  const MemberAvatar({super.key, required this.nickname});

  @override
  Widget build(BuildContext context) {
    return CircleAvatar(
      radius: 30,
      backgroundColor: Colors.blue.shade100,
      child: Text(
        nickname.isNotEmpty ? nickname.substring(0, 1) : 'U',
        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.blue),
      ),
    );
  }
}
