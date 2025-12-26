const express = require('express');
const { Telegraf } = require('telegraf');
const fetch = require('node-fetch'); // убедитесь, что установили package

// Настройте параметры
const apiToken = '6632695365:AAH234LsLWIcoCL5EzKy_kGyj18skhd5xCU'; // вставьте свой токен Telegram
const openRouterApiKey = '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'; // вставьте свой API ключ OpenRouter

const app = express();

// Создаем бота
const bot = new Telegraf(apiToken, {
    telegram: { webhookReply: false }
});

// Указываем ваш webhook URL (замените домен и путь)
const webhookUrl = `https://gjob-test.vercel.app/bot${apiToken}`;

// Устанавливаем webhook
bot.telegram.setWebhook(webhookUrl);

// Обработка команд /start
bot.start(async (ctx) => {
    await ctx.reply('Привет! Я Gjob, чем могу помочь.');
});

// Обработка любых текстовых сообщений
bot.on('message', async (ctx) => {
    const userMessage = ctx.message.text || '';
    const responseText = await getOpenRouterResponse(userMessage);
    if (responseText) {
        await ctx.reply(responseText);
    } else {
        await ctx.reply('Произошла ошибка при обработке вашего сообщения.');
    }
});

// Функция обращения к OpenRouter API
async function getOpenRouterResponse(prompt) {
    const apiUrl = 'https://api.openrouter.ai/v1/completions'; // или другой правильный URL по документации
    const payload = {
        model: 'deepseek/deepseek-chat-v3-0324', // или другой модель, если требуется
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

// Настраиваем сервер под webhook
app.use(express.json());
app.use('/bot' + apiToken, bot.webhookCallback('/bot' + apiToken));

app.get('/', (_req, res) => {
    res.send('Сервер запущен');
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
