require('dotenv').config();
fs = require('fs');
var schedule = require('node-schedule');
const { Telegraf } = require('telegraf');
const TelegramAPI  = require('node-telegram-bot-api');
const bot = new Telegraf(process.env.BOT_TOKEN);
const botAPI = new TelegramAPI(process.env.BOT_TOKEN)
const balance = require('./balance');

var usdtPrice = null;

var j = schedule.scheduleJob('*/30 * * * *', function(){
  fs.readFile('alertSettings.json', (err, data) => {
    let alertIDs = JSON.parse(data);
    for (const [userID, value] of Object.entries(alertIDs)) {
      for (const [token, value2] of Object.entries(value['tokens'])) {
        balance.balance(token, function (response) {
          if (!usdtPrice) {
            usdtPrice = response[0];
            botAPI.sendMessage(userID, `${token} is setting`)
          } else {
            let tmpUsdtPrice = response[0];
            let diff = ((tmpUsdtPrice - usdtPrice) / usdtPrice) * 100
            if (diff >= 5) {
              bot.sendMessage(userID, `${token} is up`)
            } else if (diff <= -5){
              bot.sendMessage(userID, `${token} is down`)
            }
          }
        })
      }
    }
  })
});
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


bot.command('setAlert', (ctx) => {
  const userInputArray = ctx.message.text.split(' ')
  if (userInputArray.length > 1) {
    const userInput = userInputArray[1].toLowerCase();
    fs.readFile('data/contracts.json', (err, contractsData) => {
      let contractsJSON = JSON.parse(contractsData);
      let contracts = contractsJSON[userInput];
      if (contracts) {
        var chatID = ctx.message.chat.id;
        fs.readFile('alertSettings.json', (err, data) => {
            if (err) throw err;
            let alertIDs = JSON.parse(data);
            var user = {}
            if (chatID in alertIDs) {
              user = alertIDs[chatID];
              const tokenSet = new Set()
              tokenSet.add(userInput)

              user['update'] = new Date();
              user['tokens'][userInput] = 0
            } else {
              const tokenSet = new Set()
              tokenSet.add(userInput)
              alertIDs[chatID] = {
                'tokens': {
                  
                },
                'update':new Date()
              }
              alertIDs[chatID]['tokens'][userInput] = 0
            }
            let alertData = JSON.stringify(alertIDs);
            fs.writeFileSync('alertSettings.json', alertData);
            ctx.reply("⏱Alerts has been set")
        });
      } else {
        ctx.reply("Oups it seems that I dunno this token...")
      }
    })
  }
})

bot.command('stopAlert', (ctx) => {
  fs.readFile('alertSettings.json', (err, data) => {
    let alertIDs = JSON.parse(data);
    var chatID = ctx.message.chat.id;
    if (chatID in alertIDs) {
      delete alertIDs[chatID];
      let alertData = JSON.stringify(alertIDs);
      fs.writeFileSync('alertSettings.json', alertData);
      ctx.reply("All alerts has been stopped")
    } else {
      ctx.reply("No alert has been set")
    }
  })
})

bot.command('p', (ctx) => {
  const userInputArray = ctx.message.text.split(' ')
  if (userInputArray.length > 1) {
    const userInput = userInputArray[1].toLowerCase();
    balance.balance(userInput, function (response) {
      ctx.replyWithMarkdown(response[2], {
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔁 Refresh", callback_data: "BALANCE" }]
          ]
        }
      })
    }); 
  } else {
    ctx.reply("Please enter a valid token")
  }
})

bot.action('BALANCE', (ctx) => {
  let re = /(?<=\bTOKEN:\s)(\w+)/g
  let text = ctx.update.callback_query.message.text.match(re)
  const userInput = text != [] ? text : 'null';
  balance.balance(userInput, function (response) {
    // if response message != previous message (to avoid 400 Bad request ERROR)
    if (response[2] != ctx.update.callback_query.message.text) {
      ctx.editMessageText(response[2],  {
          reply_markup: {
            inline_keyboard: [
              [{ text: "🔁 Refresh", callback_data: "BALANCE" }]
            ]
          }
        })
    }
  });
})

bot.launch();