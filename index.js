const express = require('express');
const { Telegraf } = require('telegraf');

const app = express();

const apiToken = '6632695365:AAH234LsLWIcoCL5EzKy_kGyj18skhd5xCU'; // вставьте свой токен
const webhookUrl = `https://gjob-test/bot${apiToken}`; // вставьте свой публичный URL

const bot = new Telegraf(apiToken, {
  telegram: {
    webhookReply: false,
  },
});

// Успешно установить webhook при запуске
bot.telegram.setWebhook(webhookUrl)
  .then(() => console.log('Webhook успешно установлен'))
  .catch((err) => console.error('Ошибка установки webhook:', err));

// Обработка входящих запросов
app.use(express.json());
app.use(bot.webhookCallback(`/bot${apiToken}`));

app.get('/', (_req, res) => {
  res.send('Сервер запущен');
});

// Запуск сервера
app.listen(3212, () => {
  console.log('Сервер работает на порту 3212');
});
