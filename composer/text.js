// ./composer/text.js
const axios = require('axios');

const OPENROUTER_API_KEY = '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';

module.exports = (bot) => {
  bot.on('message', async (ctx) => {
    const userMessage = ctx.message.text;
    if (!userMessage) return;

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          prompt: userMessage,
          model: 'deepseek/deepseek-chat-v3-0324', // убедитесь, что такая модель поддерживается
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
};
