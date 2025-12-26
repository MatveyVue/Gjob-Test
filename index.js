// /api/index.js
import { Telegraf } from 'telegraf';

const apiToken = '6632695365:AAH234LsLWIcoCL5EzKy_kGyj18skhd5xCU'; // вставьте свой
const openRouterApiKey = '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'; // вставьте

const bot = new Telegraf(apiToken);

// Устанавливаем webhook URL внутри этого файла не нужно
// Вместо этого, Vercel вызывает эту функцию для каждого входящего запроса
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Обрабатываем входящее обновление от Telegram
      await bot.handleUpdate(req.body);
      res.status(200).end();
    } catch (err) {
      console.error('Ошибка обработки:', err);
      res.status(500).send('Ошибка обработки');
    }
  } else {
    // Можно вернуть простой ответ для проверки
    res.status(200).send('OK');
  }
}

// Инициализация обработчиков команд и сообщений
bot.start(async (ctx) => {
  await ctx.reply('Привет! Я Gjob, чем могу помочь.');
});

bot.on('message', async (ctx) => {
  const userMessage = ctx.message.text || '';
  const responseText = await getOpenRouterResponse(userMessage);
  if (responseText) {
    await ctx.reply(responseText);
  } else {
    await ctx.reply('Произошла ошибка.');
  }
});

// Функция обращения к API
async function getOpenRouterResponse(prompt) {
  const apiUrl = 'https://api.openrouter.ai/v1/completions';
  const payload = {
    model: 'deepseek/deepseek-chat-v3-0324',
    prompt: prompt,
    max_tokens: 200,
    temperature: 0.7,
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

    if (response.ok && data.choices && data.choices.length > 0) {
      return data.choices[0].text.trim();
    } else {
      console.error('Ответ API:', data);
      return null;
    }
  } catch (err) {
    console.error('Ошибка при запросе к OpenRouter:', err);
    return null;
  }
}
