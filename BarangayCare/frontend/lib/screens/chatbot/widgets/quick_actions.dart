import 'package:flutter/material.dart';

class QuickAction {
  final IconData icon;
  final String label;
  final String message;

  const QuickAction({
    required this.icon,
    required this.label,
    required this.message,
  });
}

class QuickActions extends StatelessWidget {
  final List<QuickAction> actions;
  final ValueChanged<String> onSelected;
  final bool isSending;

  const QuickActions({
    super.key,
    required this.actions,
    required this.onSelected,
    required this.isSending,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 44,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemBuilder: (context, index) {
          final action = actions[index];
          return ActionChip(
            avatar: Icon(
              action.icon,
              size: 18,
            ),
            label: Text(action.label),
            onPressed: isSending ? null : () => onSelected(action.message),
          );
        },
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemCount: actions.length,
      ),
    );
  }
}
