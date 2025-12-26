const { Telegraf } = require('telegraf');
const axios = require('axios');

const token = '6632695365:AAH234LsLWIcoCL5EzKy_kGyj18skhd5xCU'; // вставьте сюда ваш токен
const bot = new Telegraf(token);

// API-ключ OpenRouter (или другого AI API)
const OPENROUTER_API_KEY = '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';

// Обработчик команды /start
bot.start(async (ctx) => {
    await ctx.reply('Привет! Я AI-бот. Напиши мне сообщение, и я отвечу тебе с помощью ИИ.');
});

// Обработка всех сообщений и ответ с помощью AI
bot.on('message', async (ctx) => {
    const userMessage = ctx.message.text;

    try {
        // Отправляем запрос к AI API
        const response = await axios.post('https://openrouter.io/v1/completions', {
            prompt: userMessage,
            model: 'deepseek/deepseek-v3.2', // укажите нужную модель
            max_tokens: 150,
            temperature: 0.7,
        }, {
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        const aiReply = response.data.choices[0].text.trim();

        // Отправляем ответ пользователю
        await ctx.reply(aiReply);
    } catch (err) {
        console.error('Ошибка при запросе к AI:', err);
        await ctx.reply('Извините, возникла ошибка при получении ответа.');
    }
});

bot.launch();