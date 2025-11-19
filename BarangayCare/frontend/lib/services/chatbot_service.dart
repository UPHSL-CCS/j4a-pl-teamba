import '../config/api_config.dart';
import '../models/chat_message.dart';
import 'api_service.dart';

class ChatbotService {
  static Future<ChatMessage> sendMessage({
    required String message,
    required String token,
  }) async {
    final response = await ApiService.post(
        ApiConfig.chatbotMessage, {'message': message},
        token: token);
    final data = response['data'] as Map<String, dynamic>? ?? {};
    return ChatMessage.fromResponse(data);
  }

  static Future<List<ChatMessage>> fetchHistory(String token) async {
    final response =
        await ApiService.get(ApiConfig.chatbotHistory, token: token);
    final data = response['data'] as Map<String, dynamic>? ?? {};
    final messages = data['messages'] as List<dynamic>? ?? [];
    return messages
        .map((item) => ChatMessage.fromHistory(item as Map<String, dynamic>))
        .toList();
  }

  static Future<void> clearHistory(String token) async {
    await ApiService.delete(ApiConfig.chatbotHistory, token: token);
  }

  static Future<List<Map<String, dynamic>>> fetchFaq(String token) async {
    final response = await ApiService.get(ApiConfig.chatbotFaq, token: token);
    final data = response['data'] as Map<String, dynamic>? ?? {};
    final faqs = data['faqs'] as List<dynamic>? ?? [];
    return faqs.cast<Map<String, dynamic>>();
  }
}
