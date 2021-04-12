require('dotenv').config();

const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
const balance = require('./balance');

var express = require('express');
var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', function(req, res) {
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
});

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

