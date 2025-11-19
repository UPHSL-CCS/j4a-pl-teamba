import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  enqueueChatRequest,
  getChatHistory,
  clearChatHistory,
  getFaqEntries,
} from '../services/chatbotService.js';

const chatbot = new Hono();

chatbot.use('/*', authMiddleware);

chatbot.post('/message', async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const message = body?.message;

    if (!message || !message.trim()) {
      return c.json({ success: false, error: 'Message is required' }, 400);
    }

    const result = await enqueueChatRequest(user.uid, {
      userId: user.uid,
      message,
    });

    return c.json({ success: true, data: result });
  } catch (error) {
    return c.json(
      { success: false, error: error.message || 'Failed to process message' },
      400
    );
  }
});

chatbot.get('/history', async (c) => {
  try {
    const user = c.get('user');
    const history = await getChatHistory(user.uid);
    return c.json({ success: true, data: { messages: history } });
  } catch (error) {
    return c.json(
      { success: false, error: error.message || 'Failed to load history' },
      500
    );
  }
});

chatbot.delete('/history', async (c) => {
  try {
    const user = c.get('user');
    await clearChatHistory(user.uid);
    return c.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    return c.json(
      { success: false, error: error.message || 'Failed to clear history' },
      500
    );
  }
});

chatbot.get('/faq', async (c) => {
  try {
    const faqs = await getFaqEntries();
    return c.json({ success: true, data: { faqs } });
  } catch (error) {
    return c.json(
      { success: false, error: error.message || 'Failed to load FAQ' },
      500
    );
  }
});

export default chatbot;


