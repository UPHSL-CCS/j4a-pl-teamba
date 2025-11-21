import { GoogleGenerativeAI } from '@google/generative-ai';
import { collections } from '../config/database.js';
import {
  detectLanguage,
  extractKeywords,
  translateToEnglish,
  translateToFilipino,
} from './nlpService.js';
import { analyzeSymptoms } from './symptomCheckerService.js';

const MAX_CONCURRENT_REQUESTS = 4;
let activeRequests = 0;
const chatQueues = new Map();

const DEFAULT_SUGGESTIONS = [
  'Book Appointment',
  'Request Medicine',
  'View Doctors',
  'Emergency Contacts',
];

const geminiClient = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({
      model: 'gemini-2.5-flash',
    })
  : null;

export function enqueueChatRequest(userId, payload) {
  if (!chatQueues.has(userId)) {
    chatQueues.set(userId, []);
  }

  return new Promise((resolve, reject) => {
    chatQueues.get(userId).push({ payload, resolve, reject });
    processQueue(userId);
  });
}

async function processQueue(userId) {
  const queue = chatQueues.get(userId);
  if (!queue || queue.length === 0) {
    return;
  }

  if (activeRequests >= MAX_CONCURRENT_REQUESTS) {
    return;
  }

  const job = queue.shift();
  activeRequests++;

  try {
    const result = await handleChatMessage(job.payload);
    job.resolve(result);
  } catch (error) {
    job.reject(error);
  } finally {
    activeRequests--;
    if (queue.length === 0) {
      chatQueues.delete(userId);
    }
    processQueue(userId);
  }
}

function classifyIntent(text) {
  const normalized = text.toLowerCase();

  if (
    normalized.includes('fever') ||
    normalized.includes('cough') ||
    normalized.includes('symptom') ||
    normalized.includes('sakit')
  ) {
    return 'symptom_check';
  }

  if (
    normalized.includes('medicine') ||
    normalized.includes('gamot') ||
    normalized.includes('medication')
  ) {
    return 'medicine_info';
  }

  if (
    normalized.includes('appointment') ||
    normalized.includes('schedule') ||
    normalized.includes('consult')
  ) {
    return 'book_appointment';
  }

  if (
    normalized.includes('emergency') ||
    normalized.includes('help now') ||
    normalized.includes('911')
  ) {
    return 'emergency';
  }

  if (
    normalized.includes('hello') ||
    normalized.includes('hi') ||
    normalized.includes('kumusta')
  ) {
    return 'greeting';
  }

  if (normalized.includes('faq') || normalized.includes('information')) {
    return 'faq';
  }

  return 'general_inquiry';
}

async function handleChatMessage({ userId, message, preferredLanguage }) {
  if (!message || !message.trim()) {
    throw new Error('Message cannot be empty');
  }

  const trimmedMessage = message.trim();
  const detectedLanguage = preferredLanguage || detectLanguage(trimmedMessage);
  const normalizedMessage =
    detectedLanguage === 'fil'
      ? translateToEnglish(trimmedMessage)
      : trimmedMessage;

  const keywords = extractKeywords(normalizedMessage);
  let intent = classifyIntent(normalizedMessage);

  // Get conversation history for context
  const recentHistory = await getRecentConversationHistory(userId, 5);

  const {
    response,
    suggestedActions,
    metadata,
    confidence,
    resolvedIntent,
  } = await generateResponse({
    intent,
    keywords,
    message: trimmedMessage,
    normalizedMessage,
    detectedLanguage,
    userId,
    conversationHistory: recentHistory,
  });

  intent = resolvedIntent ?? intent;

  const saved = await logConversation({
    userId,
    originalMessage: trimmedMessage,
    normalizedMessage,
    intent,
    response,
    language: detectedLanguage,
    suggestedActions,
    keywords,
    metadata,
    confidence,
  });

  return {
    id: saved._id.toString(),
    user_message: trimmedMessage,
    response,
    intent,
    language: detectedLanguage,
    suggested_actions: suggestedActions,
    keywords,
    confidence,
    timestamp: saved.timestamp.toISOString(),
    metadata,
  };
}

async function generateResponse({
  intent,
  keywords,
  message,
  normalizedMessage,
  detectedLanguage,
  userId,
  conversationHistory = [],
}) {
  let response = '';
  let suggestedActions = [...DEFAULT_SUGGESTIONS];
  let metadata = {};
  let confidence = 0.8;
  let resolvedIntent = intent;

  // Build context from conversation history
  const contextMessages = conversationHistory
    .slice(-6) // Last 6 messages (3 exchanges)
    .map((msg) => {
      const role = msg.role === 'user' ? 'User' : 'Assistant';
      return `${role}: ${msg.text}`;
    })
    .join('\n');

  // Use Gemini as primary response generator with context
  const aiResponse = await generateGeminiResponse({
    message,
    normalizedMessage,
    detectedLanguage,
    intent,
    keywords,
    contextMessages,
    userId,
  });

  if (aiResponse) {
    response = aiResponse.response;
    confidence = aiResponse.confidence || 0.8;
    
    // Enhance with domain-specific information based on intent
    if (intent === 'symptom_check') {
      const analysis = analyzeSymptoms(keywords);
      const symptomRecord = await collections.symptomDatabase().findOne({
        keywords: { $in: keywords },
      });
      if (symptomRecord) {
        suggestedActions = symptomRecord.recommended_actions ?? analysis.suggestedActions;
        metadata = { analysis, symptomRecord };
      } else {
        suggestedActions = analysis.suggestedActions;
        metadata = { analysis };
      }
    } else if (intent === 'medicine_info') {
      const faq = await searchFAQByCategory('medicines', keywords);
      if (faq) {
        metadata = { faq };
        suggestedActions = ['Request Medicine', 'View Medicines'];
      }
    } else if (intent === 'book_appointment') {
      suggestedActions = ['View Doctors', 'Book Appointment'];
    } else if (intent === 'emergency') {
      suggestedActions = ['Emergency Contacts', 'Call Hotline'];
      confidence = 0.95;
    } else if (intent === 'greeting') {
      suggestedActions = [
        'Symptom Check',
        'Book Appointment',
        'Request Medicine',
        'Emergency Contacts',
      ];
    } else {
      // Try FAQ as fallback for general inquiries
      const faqResult = await searchFAQByKeywords(keywords, normalizedMessage);
      if (faqResult) {
        metadata = { faq: faqResult };
        suggestedActions = ['View FAQ', 'Book Appointment'];
        resolvedIntent = 'faq';
      }
    }
  } else {
    // Fallback to rule-based responses if Gemini fails
    if (intent === 'symptom_check') {
      const analysis = analyzeSymptoms(keywords);
      response = analysis.advice;
      suggestedActions = analysis.suggestedActions;
      metadata = { analysis };
      confidence = analysis.confidence;
    } else if (intent === 'medicine_info') {
      const faq = await searchFAQByCategory('medicines', keywords);
      if (faq) {
        response = faq.answer;
        suggestedActions = ['Request Medicine', 'View Medicines'];
        metadata = { faq };
        confidence = 0.75;
      }
    } else if (intent === 'book_appointment') {
      response =
        'I can help you book a consultation. Which doctor or clinic service would you like to schedule?';
      suggestedActions = ['View Doctors', 'Book Appointment'];
      confidence = 0.7;
    } else if (intent === 'emergency') {
      response =
        'If this is an emergency, please contact the nearest barangay health center or call your local emergency hotline immediately.';
      suggestedActions = ['Emergency Contacts', 'Call Hotline'];
      confidence = 0.9;
    } else if (intent === 'greeting') {
      response =
        'Hello! I am your Barangay Health Assistant. How can I support you today?';
      suggestedActions = [
        'Symptom Check',
        'Book Appointment',
        'Request Medicine',
        'Emergency Contacts',
      ];
      confidence = 0.8;
    } else {
      const faqResult = await searchFAQByKeywords(keywords, normalizedMessage);
      if (faqResult) {
        response = faqResult.answer;
        suggestedActions = ['View FAQ', 'Book Appointment'];
        metadata = { faq: faqResult };
        confidence = 0.7;
        resolvedIntent = 'faq';
      }
    }

    if (!response) {
      response =
        'I am still learning how to respond to that question. Please try asking in a different way or choose one of the quick actions.';
      suggestedActions = ['View FAQ', 'Talk to Admin'];
      confidence = 0.35;
    }
  }

  return { response, suggestedActions, metadata, confidence, resolvedIntent };
}

async function generateGeminiResponse({
  message,
  normalizedMessage,
  detectedLanguage,
  intent,
  keywords,
  contextMessages,
  userId,
}) {
  if (!geminiClient) {
    console.warn('Gemini client not initialized. Check GEMINI_API_KEY in .env');
    return null;
  }

  try {
    const language = detectedLanguage === 'fil' ? 'Filipino' : 'English';
    const contextSection = contextMessages
      ? `\n\nPrevious conversation:\n${contextMessages}\n`
      : '';

    const systemPrompt = `You are BarangayCare, a helpful and friendly barangay health assistant chatbot. Your role is to provide health guidance, answer questions about appointments, medicines, and symptoms, and help patients navigate the barangay health system.

Guidelines:
- Respond naturally and conversationally in ${language}
- Be empathetic, clear, and helpful
- For medical emergencies, always direct users to contact emergency services immediately
- When discussing symptoms, remind users to consult with healthcare professionals
- Keep responses concise but informative (2-4 sentences typically)
- Use a warm, caring tone appropriate for a community health assistant
- If asked about booking appointments, guide them to use the "Book Appointment" feature
- If asked about medicines, mention they can request medicines through the app
${contextSection}
Current user message: ${message}
Detected intent: ${intent}
Keywords: ${keywords.join(', ') || 'none'}

Respond naturally as if you're having a conversation. Don't mention intents or technical details.`;

    const result = await geminiClient.generateContent([{ text: systemPrompt }]);
    const text = result?.response?.text();
    
    if (!text || !text.trim()) {
      return null;
    }

    return {
      response: text.trim(),
      confidence: 0.85,
    };
  } catch (error) {
    console.error('Gemini generation error:', error.message);
    return null;
  }
}

async function getRecentConversationHistory(userId, limit = 5) {
  try {
    const history = await collections
      .chatMessages()
      .find({ user_id: userId })
      .sort({ timestamp: -1 })
      .limit(limit * 2) // Get more to account for pairs
      .toArray();

    // Convert to conversation format
    const conversations = [];
    for (const entry of history.reverse()) {
      conversations.push({
        role: 'user',
        text: entry.message,
      });
      conversations.push({
        role: 'assistant',
        text: entry.response,
      });
    }

    return conversations.slice(-limit * 2); // Return last N pairs
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    return [];
  }
}

async function searchFAQByCategory(category, keywords) {
  return collections
    .faqDatabase()
    .findOne({
      category,
      keywords: { $in: keywords },
    });
}

async function searchFAQByKeywords(keywords, fallbackText) {
  if (!keywords.length) {
    return null;
  }

  const faq = await collections
    .faqDatabase()
    .findOne({
      keywords: { $in: keywords },
    });

  if (faq) {
    return faq;
  }

  return collections.faqDatabase().findOne({
    $or: keywords.map((kw) => ({
      question: { $regex: kw, $options: 'i' },
    })),
  });
}

async function logConversation({
  userId,
  originalMessage,
  normalizedMessage,
  intent,
  response,
  language,
  suggestedActions,
  keywords,
  metadata,
  confidence,
}) {
  const record = {
    user_id: userId,
    message: originalMessage,
    normalized_message: normalizedMessage,
    response,
    intent,
    confidence,
    language,
    suggested_actions: suggestedActions,
    keywords,
    metadata,
    timestamp: new Date(),
  };

  const result = await collections.chatMessages().insertOne(record);
  return { ...record, _id: result.insertedId };
}

export async function getChatHistory(userId) {
  const history = await collections
    .chatMessages()
    .find({ user_id: userId })
    .sort({ timestamp: 1 })
    .toArray();

  return history.flatMap((entry) => [
    {
      id: `${entry._id.toString()}-user`,
      role: 'user',
      text: entry.message,
      intent: entry.intent,
      timestamp: entry.timestamp?.toISOString?.() ?? new Date().toISOString(),
    },
    {
      id: entry._id.toString(),
      role: 'assistant',
      text: entry.response,
      intent: entry.intent,
      suggested_actions: entry.suggested_actions,
      timestamp: entry.timestamp?.toISOString?.() ?? new Date().toISOString(),
      metadata: entry.metadata,
    },
  ]);
}

export async function clearChatHistory(userId) {
  await collections.chatMessages().deleteMany({ user_id: userId });
  return { success: true };
}

export async function getFaqEntries(limit = 20) {
  return collections
    .faqDatabase()
    .find({})
    .sort({ category: 1, question: 1 })
    .limit(limit)
    .toArray();
}


