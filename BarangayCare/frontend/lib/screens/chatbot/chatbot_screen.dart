import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/chat_message.dart';
import '../../providers/auth_provider.dart';
import '../../services/chatbot_service.dart';
import 'widgets/chat_bubble.dart';
import 'widgets/quick_actions.dart';

class ChatbotScreen extends StatefulWidget {
  const ChatbotScreen({super.key});

  @override
  State<ChatbotScreen> createState() => _ChatbotScreenState();
}

class _ChatbotScreenState extends State<ChatbotScreen> {
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<ChatMessage> _messages = [];
  bool _isLoadingHistory = true;
  bool _isSending = false;

  final List<QuickAction> _quickActions = const [
    QuickAction(
      icon: Icons.monitor_heart_outlined,
      label: 'Symptom Check',
      message: 'I have a fever and cough. What should I do?',
    ),
    QuickAction(
      icon: Icons.medication_liquid_outlined,
      label: 'Medicine Info',
      message: 'Tell me more about paracetamol dosage.',
    ),
    QuickAction(
      icon: Icons.calendar_today_outlined,
      label: 'Book Doctor',
      message: 'Help me book an appointment with a doctor.',
    ),
    QuickAction(
      icon: Icons.emergency_outlined,
      label: 'Emergency',
      message: 'What are the emergency numbers in our barangay?',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _loadHistory();
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _loadHistory() async {
    final auth = context.read<AuthProvider>();
    final token = await auth.getIdToken();
    if (!mounted) return;

    if (token == null) {
      _showSnackBar('Please login to use the chatbot.');
      setState(() {
        _isLoadingHistory = false;
      });
      return;
    }

    try {
      final history = await ChatbotService.fetchHistory(token);
      setState(() {
        _messages
          ..clear()
          ..addAll(history);
        _isLoadingHistory = false;
      });
      _scrollToBottom();
    } catch (e) {
      setState(() {
        _isLoadingHistory = false;
      });
      _showSnackBar('Failed to load chat history: $e');
    }
  }

  Future<void> _sendMessage(String text) async {
    final trimmed = text.trim();
    if (trimmed.isEmpty || _isSending) return;

    final auth = context.read<AuthProvider>();
    final token = await auth.getIdToken();
    if (token == null) {
      _showSnackBar('Please login again to continue.');
      return;
    }

    final userMessage = ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      sender: ChatSender.user,
      text: trimmed,
      timestamp: DateTime.now(),
    );

    setState(() {
      _messages.add(userMessage);
      _isSending = true;
    });

    _controller.clear();
    _scrollToBottom();

    try {
      final botMessage =
          await ChatbotService.sendMessage(message: trimmed, token: token);
      setState(() {
        _messages.add(botMessage);
        _isSending = false;
      });
      _scrollToBottom();
    } catch (e) {
      setState(() {
        _isSending = false;
      });
      _showSnackBar('Failed to send message: $e');
    }
  }

  Future<void> _clearHistory() async {
    final auth = context.read<AuthProvider>();
    final token = await auth.getIdToken();
    if (token == null) return;

    try {
      await ChatbotService.clearHistory(token);
      setState(() {
        _messages.clear();
      });
      _showSnackBar('Chat history cleared');
    } catch (e) {
      _showSnackBar('Unable to clear history: $e');
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!_scrollController.hasClients) return;
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent + 64,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    });
  }

  void _showSnackBar(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Barangay Health Assistant'),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_outline),
            tooltip: 'Clear chat history',
            onPressed: _messages.isEmpty || _isSending
                ? null
                : () async {
                    final confirmed = await showDialog<bool>(
                      context: context,
                      builder: (context) => AlertDialog(
                        title: const Text('Clear chat history?'),
                        content: const Text(
                            'This will remove all previous messages for this account.'),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context, false),
                            child: const Text('Cancel'),
                          ),
                          FilledButton(
                            onPressed: () => Navigator.pop(context, true),
                            child: const Text('Clear'),
                          )
                        ],
                      ),
                    );
                    if (confirmed == true) {
                      await _clearHistory();
                    }
                  },
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: QuickActions(
              actions: _quickActions,
              isSending: _isSending,
              onSelected: (value) {
                _controller.text = value;
                _controller.selection = TextSelection.fromPosition(
                  TextPosition(offset: value.length),
                );
                _sendMessage(value);
              },
            ),
          ),
          Expanded(
            child: _isLoadingHistory
                ? const Center(child: CircularProgressIndicator())
                : _messages.isEmpty
                    ? _buildEmptyState(context)
                    : ListView.builder(
                        controller: _scrollController,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 12,
                        ),
                        itemCount: _messages.length,
                        itemBuilder: (context, index) {
                          final message = _messages[index];
                          return ChatBubble(message: message);
                        },
                      ),
          ),
          _buildComposer(context),
        ],
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.chat_bubble_outline,
            size: 48,
            color: Theme.of(context).colorScheme.primary,
          ),
          const SizedBox(height: 12),
          Text(
            'Start a conversation',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 8),
          Text(
            'Ask about symptoms, medicines, or appointments.',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Colors.black54,
                ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildComposer(BuildContext context) {
    return SafeArea(
      top: false,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: _controller,
                minLines: 1,
                maxLines: 4,
                textInputAction: TextInputAction.send,
                onSubmitted: _sendMessage,
                decoration: const InputDecoration(
                  hintText: 'Type your message...',
                  border: OutlineInputBorder(),
                ),
              ),
            ),
            const SizedBox(width: 12),
            FilledButton(
              onPressed:
                  _isSending ? null : () => _sendMessage(_controller.text),
              child: _isSending
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Icon(Icons.send),
            )
          ],
        ),
      ),
    );
  }
}
