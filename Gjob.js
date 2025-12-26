const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');

const TELEGRAM_TOKEN = '6632695365:AAH234LsLWIcoCL5EzKy_kGyj18skhd5xCU';
// Укажите ваш chat_id (например, свой личный чат или группу)
const ADMIN_CHAT_ID = YOUR_CHAT_ID_HERE; // замените на ваш chat_id

const OPENROUTER_API_KEY = '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';

const WEBHOOK_URL = 'https://yourdomain.com:port/path'; // ваш актуальный URL

const app = express();
app.use(express.json()); 

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false }); // только для вебхуков

// Устанавливаем вебхук
(async () => {
  await bot.setWebHook(WEBHOOK_URL);
  console.log('Webhook установлен');

  // Отправляем сообщение о запуске
  try {
    await bot.sendMessage(ADMIN_CHAT_ID, 'Бот запущен и готов к работе.');
    console.log('Сообщение о запуске отправлено.');
  } catch (err) {
    console.error('Ошибка при отправке сообщения о запуске:', err);
  }
})();

// функция обращения к OpenRouter API
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

// Обработка запросов с вебхука
app.post('/webhook', async (req, res) => {
  const update = req.body;

  if (update.message && update.message.text) {
    const chatId = update.message.chat.id;
    const text = update.message.text.trim();

    if (text === '/start') {
      // Ответ на команду /start
      await bot.sendMessage(chatId, 'Привет! Я Gjob. Чем могу помочь?');
    } else {
      // Обработка обычного сообщения
      const reply = await callOpenRouter(text);
      await bot.sendMessage(chatId, reply);
    }
  }

  res.sendStatus(200);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});