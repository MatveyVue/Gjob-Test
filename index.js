import { Telegraf } from 'telegraf';

const apiToken = '6632695365:AAH234LsLWIcoCL5EzKy_kGyj18skhd5xCU'; // Замените на свой токен Telegram бота
const openRouterApiKey = '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'; // Замените на свой OpenRouter API ключ

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

bot.on('text', async (ctx) => {
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
    const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    const modelName = 'deepseek/deepseek-v3.2';
    const apiKey = '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'; // Replace with your actual API key

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: modelName,
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('OpenRouter API Error:', response.status, error);
            return null;
        }

        const data = await response.json();
        const reply = data.choices[0]?.message?.content?.trim();
        return reply || null;

    } catch (error) {
        console.error('Request failed:', error);
        return null;
    }
}
