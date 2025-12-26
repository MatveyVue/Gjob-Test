const { Telegraf } = require('telegraf');
const axios = require('axios');

const token = '6632695365:AAH234LsLWIcoCL5EzKy_kGyj18skhd5xCU'; // ваш токен бота
const bot = new Telegraf(token);

// OpenRouter API-ключ
const OPENROUTER_API_KEY = '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';

bot.start(async (ctx) => {
    await ctx.reply('Привет! Я AI-бот. Напиши мне сообщение, и я отвечу тебе с помощью ИИ.');
});

bot.on('message', async (ctx) => {
    const userMessage = ctx.message.text;
    if (!userMessage) return; // Обработка только текстовых сообщений

    try {
        const response = await axios.post(
            'https://api.openrouter.ai/v1/completions',
            {
                prompt: userMessage,
                model: 'deepseek/deepseek-v3.2', // Выберите подходящую модель
                max_tokens: 150,
                temperature: 0.7,
            },
            {
                headers: {
                    'Api-Key': OPENROUTER_API_KEY,
                    'Content-Type': 'application/json',
                }
            }
        );

        // Структура ответа стоит проверить, по примеру ниже
        const choices = response.data.choices;
        if (choices && choices.length > 0) {
            const aiReply = choices[0].text.trim();
            await ctx.reply(aiReply);
        } else {
            await ctx.reply('Не удалось получить ответ от ИИ.');
        }

    } catch (err) {
        console.error('Ошибка при запросе к AI:', err.message);
        await ctx.reply('Извините, возникла ошибка при получении ответа.');
    }
});

bot.launch();
