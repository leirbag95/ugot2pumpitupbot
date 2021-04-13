require('dotenv').config();

const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
const balance = require('./balance');
bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const response_time = new Date() - start;
  var chat_from = ""
  try {
    chat_from = `${ctx.message.chat.first_name} (id: ${ctx.message.chat.id})`;
  } catch {
    chat_from = "REFRESH OPTION"
  }
  console.log(
    `${Date().toLocaleString()} Chat from ${chat_from} (Response Time: ${response_time})`
  );
});

bot.command('p', (ctx) => {
  const userInput = ctx.message.text.split(' ')[1].toLowerCase();
  balance.balance(userInput, function (response) {
    ctx.replyWithMarkdown(response, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Refresh", callback_data: "BALANCE" }]
        ]
      }
    })
  });
})

bot.action('BALANCE', (ctx) => {
  let re = /(?<=\bTOKEN:\s)(\w+)/g
  let text = ctx.update.callback_query.message.text.match(re)
  const userInput = text != [] ? text : 'null';
  balance.balance(userInput, function (response) {
    ctx.editMessageText(response,  {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔁 Refresh", callback_data: "BALANCE" }]
        ]
      }
    })
  });
})


// bot.hears(/p (.+)/i, (ctx) => {
//   const userInput = ctx.match[1].toLowerCase();
//   balance.balance(userInput, function (response) {
//     ctx.reply(response);
//   });
// });

bot.launch();