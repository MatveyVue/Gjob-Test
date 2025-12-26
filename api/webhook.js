import axios from 'axios';

const TELEGRAM_TOKEN = '6632695365:AAH234LsLWIcoCL5EzKy_kGyj18skhd5xCU';
const OPENROUTER_API_KEY = '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';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end(); // Метод не позволяет
    return;
  }

  const update = req.body;

  // Установка вашего chat_id (например, ваш личный чат, можно получить через лог или тест)
  const CHAT_ID = YOUR_CHAT_ID; // замените на свой чат_id

  // Обработка входящего сообщения
  if (update.message && update.message.text) {
    const chatId = update.message.chat.id;
    const text = update.message.text.trim();

    if (text === '/start') {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: 'Привет! Я Gjob. Чем могу помочь?',
        }),
      });
    } else {
      // Вызов OpenRouter API
      const reply = await callOpenRouter(text);
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: reply,
        }),
      });
    }
  }

  res.status(200).end();
}

async function callOpenRouter(prompt) {
  const url = 'https://api.openrouter.ai/v1/completions';

  const headers = {
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const data = {
    model: 'deepseek/deepseek-chat-v3-0324',
    prompt: prompt,
    max_tokens: 150,
    temperature: 0.7,
  };

  try {
    const response = await axios.post(url, data, { headers });
    if (response.status === 200 && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].text.trim();
    } else {
      return 'Ответ не получен.';
    }
  } catch (error) {
    return `Ошибка: ${error.message}`;
  }
}