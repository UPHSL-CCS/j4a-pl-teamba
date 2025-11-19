enum ChatSender {
  user,
  bot,
}

class ChatMessage {
  final String id;
  final ChatSender sender;
  final String text;
  final DateTime timestamp;
  final String? intent;
  final String? language;
  final double? confidence;
  final List<String> suggestedActions;
  final Map<String, dynamic>? metadata;

  const ChatMessage({
    required this.id,
    required this.sender,
    required this.text,
    required this.timestamp,
    this.intent,
    this.language,
    this.confidence,
    this.suggestedActions = const [],
    this.metadata,
  });

  factory ChatMessage.fromHistory(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id']?.toString() ??
          DateTime.now().millisecondsSinceEpoch.toString(),
      sender: json['role'] == 'assistant' ? ChatSender.bot : ChatSender.user,
      text: json['text'] ?? '',
      timestamp: json['timestamp'] != null
          ? DateTime.parse(json['timestamp'])
          : DateTime.now(),
      intent: json['intent']?.toString(),
      language: json['language']?.toString(),
      confidence: json['confidence'] is num
          ? (json['confidence'] as num).toDouble()
          : null,
      suggestedActions: json['suggested_actions'] != null
          ? List<String>.from(json['suggested_actions'])
          : const [],
      metadata: json['metadata'] as Map<String, dynamic>?,
    );
  }

  factory ChatMessage.fromResponse(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id']?.toString() ??
          DateTime.now().millisecondsSinceEpoch.toString(),
      sender: ChatSender.bot,
      text: json['response'] ?? json['text'] ?? '',
      timestamp: json['timestamp'] != null
          ? DateTime.parse(json['timestamp'])
          : DateTime.now(),
      intent: json['intent']?.toString(),
      language: json['language']?.toString(),
      confidence: json['confidence'] is num
          ? (json['confidence'] as num).toDouble()
          : null,
      suggestedActions: json['suggested_actions'] != null
          ? List<String>.from(json['suggested_actions'])
          : const [],
      metadata: json['metadata'] as Map<String, dynamic>?,
    );
  }
}
