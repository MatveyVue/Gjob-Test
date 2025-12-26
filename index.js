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
    const apiUrl = 'https://openrouter.ai/api/v1/chat/completions'; // Corrected API endpoint
    const payload = {
        model: 'deepseek/deepseek-v3.2',
        messages: [{ role: "user", content: prompt }], // Use messages array as required by the API
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
            return data.choices[0].message.content.trim(); // Access the text from the correct field
        } else {
            console.error('Ответ API:', data);
            return null;
        }
    } catch (err) {
        console.error('Ошибка при запросе к OpenRouter:', err);
        return null;
    }
}
