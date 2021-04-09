require('dotenv').config()

const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

var Web3 = require("web3")
const web3 = new Web3("https://api.avax.network/ext/bc/C/rpc")

let sporeXwavaxPoolAddress = "0x0a63179a8838b5729e79d239940d7e29e40a0116";
let usdtXwavaxPoolAddress = "0x9ee0a4e21bd333a6bb2ab298194320b8daa26516";
let abiContract = [{"type":"constructor","stateMutability":"nonpayable","inputs":[]},{"type":"event","name":"Approval","inputs":[{"type":"address","name":"owner","internalType":"address","indexed":true},{"type":"address","name":"spender","internalType":"address","indexed":true},{"type":"uint256","name":"value","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"OwnershipTransferred","inputs":[{"type":"address","name":"previousOwner","internalType":"address","indexed":true},{"type":"address","name":"newOwner","internalType":"address","indexed":true}],"anonymous":false},{"type":"event","name":"Transfer","inputs":[{"type":"address","name":"from","internalType":"address","indexed":true},{"type":"address","name":"to","internalType":"address","indexed":true},{"type":"uint256","name":"value","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"allowTradeAt","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"allowance","inputs":[{"type":"address","name":"owner","internalType":"address"},{"type":"address","name":"spender","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"approve","inputs":[{"type":"address","name":"spender","internalType":"address"},{"type":"uint256","name":"amount","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"balanceOf","inputs":[{"type":"address","name":"account","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint8","name":"","internalType":"uint8"}],"name":"decimals","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"decreaseAllowance","inputs":[{"type":"address","name":"spender","internalType":"address"},{"type":"uint256","name":"subtractedValue","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"enableFairLaunch","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"excludeAccount","inputs":[{"type":"address","name":"account","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"includeAccount","inputs":[{"type":"address","name":"account","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"increaseAllowance","inputs":[{"type":"address","name":"spender","internalType":"address"},{"type":"uint256","name":"addedValue","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"isExcluded","inputs":[{"type":"address","name":"account","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"string","name":"","internalType":"string"}],"name":"name","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"owner","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"reflect","inputs":[{"type":"uint256","name":"tAmount","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"reflectionFromToken","inputs":[{"type":"uint256","name":"tAmount","internalType":"uint256"},{"type":"bool","name":"deductTransferFee","internalType":"bool"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"renounceOwnership","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"string","name":"","internalType":"string"}],"name":"symbol","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"tokenFromReflection","inputs":[{"type":"uint256","name":"rAmount","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"totalFees","inputs":[]},{"type":"function","stateMutability":"pure","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"totalSupply","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"transfer","inputs":[{"type":"address","name":"recipient","internalType":"address"},{"type":"uint256","name":"amount","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"transferFrom","inputs":[{"type":"address","name":"sender","internalType":"address"},{"type":"address","name":"recipient","internalType":"address"},{"type":"uint256","name":"amount","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"transferOwnership","inputs":[{"type":"address","name":"newOwner","internalType":"address"}]}]

function sporePoolBalance(callback) {
    var wavaxBalance = 0;
    var sporeBalance = 0;
    let wavaxAddressContract = "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7";
    var tokenInst = new web3.eth.Contract(abiContract, wavaxAddressContract);
    tokenInst.methods.balanceOf(sporeXwavaxPoolAddress).call().then(function (bal) {
        wavaxBalance = bal / 10**18;
        let sporeAddressContract = "0x6e7f5c0b9f4432716bdd0a77a3601291b9d9e985";
        var tokenInst = new web3.eth.Contract(abiContract, sporeAddressContract);
        tokenInst.methods.balanceOf(sporeXwavaxPoolAddress).call().then(function (bal) {
            sporeBalance = bal / 10**9;
            let avax2Spore = sporeBalance / wavaxBalance;
            // on calcule l'avax vers l'usdt
            wavaxBalance = 0;
            var usdtBalance = 0;
            let wavaxAddressContract = "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7";
            var tokenInst = new web3.eth.Contract(abiContract, wavaxAddressContract);
            tokenInst.methods.balanceOf(usdtXwavaxPoolAddress).call().then(function (bal) {
                wavaxBalance = bal / 10**18;
                let usdtAddressContract = "0xde3a24028580884448a5397872046a019649b084";
                var tokenInst = new web3.eth.Contract(abiContract, usdtAddressContract);
                tokenInst.methods.balanceOf(usdtXwavaxPoolAddress).call().then(function (bal) {
                    usdtBalance = bal / 10**9;
                    let avax2usdt = wavaxBalance/usdtBalance;
                    let spore2usdt = avax2usdt/ avax2Spore ;
                    return callback("1 SPORE = "+ spore2usdt+ " USDT")
                })
            })
        })
    })
}

bot.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const response_time = new Date() - start
  const chat_from = `${ctx.message.chat.first_name} (id: ${ctx.message.chat.id})`
  console.log(`Chat from ${chat_from} (Response Time: ${response_time})`)
})

bot.hears('/help', (ctx) => ctx.reply('Hello ! 🎱🎱 \n'))
sporePoolBalance( function(response) {
    bot.hears('/p spore', (ctx) => ctx.reply(response))
})
bot.launch()