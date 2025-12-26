const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');

const openRouterApiKey = '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'; // замените на ваш API-ключ OpenRouter
const bot = new Telegraf(token);

// Обработка команды /start
bot.start(async (ctx) => {
  await ctx.reply('Привет! Я Gjob,чем могу помочь.');
});

// Обработка всех сообщений
bot.on('message', async (ctx) => {
  const userMessage = ctx.message.text || '';

  // Отправляем сообщение в OpenRouter для получения ответа
  const responseText = await getOpenRouterResponse(userMessage);

  if (responseText) {
    // Отправляем ответ обратно в чат
    await ctx.reply(responseText);
    // Также пересылаем сообщение в другой чат, если нужно
  } else {
    await ctx.reply('Произошла ошибка при обработке вашего сообщения.');
  }
});

// Функция для взаимодействия с OpenRouter
async function getOpenRouterResponse(prompt) {
  const apiUrl = 'https://openrouter.ai/api/v1'; // пример URL, уточните у документации
  // Обратите внимание, что адрес API зависит от документации OpenRouter, приведите правильный URL и параметры

  const payload = {
    prompt: prompt,
    max_tokens: 200, // настройте параметры по необходимости
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok && data && data.choices && data.choices.length > 0) {
      return data.choices[0].text.trim();
    } else {
      console.error('Ошибочный ответ API:', data);
      return null;
    }
  } catch (err) {
    console.error('Ошибка при запросе к OpenRouter:', err);
    return null;
  }
}

bot.launch();
