require('dotenv').config();

const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
const balance = require('./balance');
bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const response_time = new Date() - start;
  const chat_from = `${ctx.message.chat.first_name} (id: ${ctx.message.chat.id})`;
  console.log(`${Date().toLocaleString()} Chat from ${chat_from} (Response Time: ${response_time})`);
});

balance.sporePoolBalance(function (response) {
  bot.hears(/p (.+)/i, (ctx) => ctx.reply(response));
});
bot.launch();

