const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');

// Введите свои токены
const TELEGRAM_TOKEN = '6632695365:AAH234LsLWIcoCL5EzKy_kGyj18skhd5xCU'; // вставьте сюда
const OPENROUTER_API_KEY = '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'; // вставьте сюда

// Создаем бота
const bot = new Telegraf(TELEGRAM_TOKEN);

bot.start(async (ctx) => {
  await ctx.reply('Привет! Я Gjob, чем могу помочь.');
});

bot.on('message', async (ctx) => {
  const messageText = ctx.message.text || '';
  console.log('Получено сообщение:', messageText);
  const reply = await getResponseFromOpenRouter(messageText);
  if (reply) {
    await ctx.reply(reply);
  } else {
    await ctx.reply('Произошла ошибка при обработке вашего сообщения.');
  }
});

// Функция обращения к OpenRouter API с моделью
async function getResponseFromOpenRouter(prompt) {
  const apiEndpoint = 'https://openrouter.ai/api/v1/completions'; // Основной эндпоинт API для генераций
  const payload = {
    model: 'deepseek/deepseek-chat-v3-0324', // замените на нужную модель, например, 'text-davinci-002' или ту, что есть у вас
    prompt: prompt,
    max_tokens: 200,
    temperature: 0.7,
  };

  try {
    const res = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (res.ok && data && data.choices && data.choices.length > 0) {
      return data.choices[0].text.trim();
    } else {
      console.error('Ошибка API:', data);
      return null;
    }
  } catch (err) {
    console.error('Ошибка при запросе к OpenRouter:', err);
    return null;
  }
}

module.exports = bot;
