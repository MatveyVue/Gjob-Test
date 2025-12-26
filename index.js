import { Telegraf } from 'telegraf';

const apiToken = '6632695365:AAH234LsLWIcoCL5EzKy_kGyj18skhd5xCU';
const openRouterApiKey = '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';

const bot = new Telegraf(apiToken);

// Обработка команд и сообщений
bot.start(async (ctx) => {
  await ctx.reply('Привет! Я Gjob,задайте любой вопрос.');
});

bot.on('message', async (ctx) => {
  const userMessage = ctx.message.text || '';
  // Отправляем сообщение в API ИИ и получаем ответ
  const responseText = await getOpenRouterResponse(userMessage);
  if (responseText) {
    await ctx.reply(responseText);
  } else {
    await ctx.reply('Произошла ошибка при получении ответа.');
  }
});

// Обработка входящих запросов через webhook
export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      await bot.handleUpdate(req.body);
    }
    res.status(200).end();
  } catch (err) {
    console.error('Ошибка при обработке:', err);
    res.status(500).send('Произошла ошибка');
  }
}

async function getOpenRouterResponse(prompt) {
  const apiUrl = 'https://api.openrouter.ai/v1/completions';

  const payload = {
    model: 'deepseek/deepseek-chat-v3-0324', // или другой актуальный
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
      // Проверка безопаснее: возвращаем содержимое первой вариации
      return data.choices[0].text.trim();
    } else {
      console.error('Ошибка API:', data);
      return 'Извините, я не смог ответить на этот вопрос.';
    }
  } catch (err) {
    console.error('Ошибка при запросе к API:', err);
    return 'Ну что, сеть сломалась или API недоступен.';
  }
}
