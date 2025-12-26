const express = require('express');
const { Telegraf } = require('telegraf');

const app = express();

const apiToken = '6632695365:AAH234LsLWIcoCL5EzKy_kGyj18skhd5xCU';

const bot = new Telegraf(apiToken, {
    telegram: {
        webhookReply: false
    }
});

// Укажите полный URL вашего вебхука, например, ваш домен + путь
const webhookUrl = `https://gjob-test.vercel.app/bot${apiToken}`;
// Устанавливаем webhook при запуске
bot.telegram.setWebhook(webhookUrl);

app.use(express.json());
app.use(bot.webhookCallback(`/bot${apiToken}`));

app.get('/', (_req, res) => {
    res.send('Server is running');
});

app.listen(3212, () => {
    console.log('Server is running on port 3212');
});
