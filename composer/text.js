// Импортируем необходимые модули
const { Telegraf } = require('telegraf');
const fetch = require('node-fetch'); // убедитесь, что установлен пакет node-fetch

// Токен Telegram бота и API-ключ OpenRouter
const TELEGRAM_TOKEN = '6632695365:AAH234LsLWIcoCL5EzKy_kGyj18skhd5xCU'; // вставьте свой бот-токен
const OPENROUTER_API_KEY = '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'; // вставьте ключ OpenRouter

// Создаем бота
const bot = new Telegraf(TELEGRAM_TOKEN);

// Обработчик команды /start
bot.start(async (ctx) => {
  await ctx.reply('Привет! Я Gjob, чем могу помочь.');
});

// Обработчик любого текстового сообщения
bot.on('message', async (ctx) => {
  const userMessage = ctx.message.text || '';
  console.log('Получено сообщение:', userMessage);

  const response = await getOpenRouterResponse(userMessage);
  if (response) {
    await ctx.reply(response);
  } else {
    await ctx.reply('Произошла ошибка при обработке вашего сообщения.');
  }
});

// Функция для отправки запроса к OpenRouter
async function getOpenRouterResponse(prompt) {
  const apiUrl = 'https://openrouter.ai/api/v1'; // замените на актуальный API endpoint
  const payload = {
    prompt: prompt,
    max_tokens: 200,
    temperature: 0.7,
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (response.ok && data && data.choices && data.choices.length > 0) {
      return data.choices[0].text.trim();
    } else {
      console.error('Ошибка API:', data);
      return null;
    }
  } catch (err) {
    console.error('При запросе к OpenRouter:', err);
    return null;
  }
}

module.exports = bot; // экспортируем бота
