var Web3 = require('web3');
var numeral = require('numeral');
const web3 = new Web3('https://api.avax.network/ext/bc/C/rpc');
const abiContracts = require('./data/abiContracts');
const contracts = require('./data/contracts.json');

const usdtXwavaxPoolAddress = "0x9ee0a4e21bd333a6bb2ab298194320b8daa26516";
const wavaxAddressContract = "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7";
const usdtAddressContract = "0xde3a24028580884448a5397872046a019649b084";

module.exports = {
  balance: function balance(userInput, callback) {
    let contractsData = contracts[userInput];

    if (contractsData) {
      let sporeXwavaxPoolAddress = contractsData.poolContrat;
      let abiContract = abiContracts.spore;
      let tokenAdress = contractsData.contract;
      var tokenInst = new web3.eth.Contract(abiContract, wavaxAddressContract);
      let wavaxBalance = 0;
      let sporeBalance = 0;
      try {
        tokenInst.methods
          .balanceOf(sporeXwavaxPoolAddress)
          .call()
          .then(function (bal) {
            wavaxBalance = bal / 10 ** 18;
            var tokenInst = new web3.eth.Contract(abiContract, tokenAdress);
            tokenInst.methods
              .balanceOf(sporeXwavaxPoolAddress)
              .call()
              .then(function (bal) {
                sporeBalance = bal / contractsData.decimal;
                let avax2Spore = sporeBalance / wavaxBalance;
                // on calcule l'avax vers l'usdt
                wavaxBalance = 0;
                var usdtBalance = 0;
                var tokenInst = new web3.eth.Contract(
                  abiContract,
                  wavaxAddressContract
                );
                tokenInst.methods
                  .balanceOf(usdtXwavaxPoolAddress)
                  .call()
                  .then(function (bal) {
                    wavaxBalance = bal / 10 ** 18;
                    var tokenInst = new web3.eth.Contract(
                      abiContract,
                      usdtAddressContract
                    );
                    tokenInst.methods
                      .balanceOf(usdtXwavaxPoolAddress)
                      .call()
                      .then(function (bal) {
                        usdtBalance = bal / 10 ** 6;
                        let avax2usdt = usdtBalance / wavaxBalance;
                        let spore2usdt = avax2usdt / avax2Spore;
                        return callback(
                          `🪙 TOKEN: ${userInput}\n1 ${userInput} = ${numeral(spore2usdt).format(
                            '0.00e+0'
                          )} USDT\n\n1 AVAX = ${numeral(avax2Spore).format(
                            '0,0.0000'
                          )}(${numeral(avax2Spore).format('0.0a')}) ${userInput} `
                        );
                      });
                  });
              });
          });
      } catch (e) {
        return callback(
          `😬 Sorry I haven't integrated this token yet! I'll let @glfss and @jmtpf know. `
        );
      }
    } else {
      return callback(
        `😬 Sorry I haven't integrated this token yet! I'll let @glfss and @jmtpf know. `
      );
    }
  }
};
