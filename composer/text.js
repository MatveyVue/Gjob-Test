const { Telegraf } = require('telegraf');

const token = '6632695365:AAH234LsLWIcoCL5EzKy_kGyj18skhd5xCU'; // вставьте свой Telegram Token
const openRouterApiKey = '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'; // вставьте свой OpenRouter API ключ

const bot = new Telegraf(token);

bot.start(async (ctx) => {
    await ctx.reply('Привет! Я Gjob, чем могу помочь.');
});

bot.on('message', async (ctx) => {
    const userMessage = ctx.message.text || '';
    const responseText = await getOpenRouterResponse(userMessage);
    if (responseText) {
        await ctx.reply(responseText);
    } else {
        await ctx.reply('Произошла ошибка при обработке вашего сообщения.');
    }
});

async function getOpenRouterResponse(prompt) {
    const apiUrl = 'https://openrouter.ai/api/v1'; // замените на актуальный endpoint
    const payload = {
        prompt: prompt,
        max_tokens: 200,
        temperature: 0.7,
        // добавьте другие параметры по необходимости
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

module.exports = bot; // экспорт для index.js
