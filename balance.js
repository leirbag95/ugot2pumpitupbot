var Web3 = require('web3');
const web3 = new Web3('https://api.avax.network/ext/bc/C/rpc');
const abiContracts = require('./data/abiContracts');

module.exports = {
  sporePoolBalance: function sporePoolBalance(callback) {
    let sporeXwavaxPoolAddress = '0x0a63179a8838b5729e79d239940d7e29e40a0116';
    let usdtXwavaxPoolAddress = '0x9ee0a4e21bd333a6bb2ab298194320b8daa26516';
    let abiContract = abiContracts.spore;

    var wavaxBalance = 0;
    var sporeBalance = 0;
    let wavaxAddressContract = '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7';
    var tokenInst = new web3.eth.Contract(abiContract, wavaxAddressContract);
    tokenInst.methods
      .balanceOf(sporeXwavaxPoolAddress)
      .call()
      .then(function (bal) {
        wavaxBalance = bal / 10 ** 18;
        let sporeAddressContract = '0x6e7f5c0b9f4432716bdd0a77a3601291b9d9e985';
        var tokenInst = new web3.eth.Contract(
          abiContract,
          sporeAddressContract
        );
        tokenInst.methods
          .balanceOf(sporeXwavaxPoolAddress)
          .call()
          .then(function (bal) {
            sporeBalance = bal / 10 ** 9;
            let avax2Spore = sporeBalance / wavaxBalance;
            // on calcule l'avax vers l'usdt
            wavaxBalance = 0;
            var usdtBalance = 0;
            let wavaxAddressContract =
              '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7';
            var tokenInst = new web3.eth.Contract(
              abiContract,
              wavaxAddressContract
            );
            tokenInst.methods
              .balanceOf(usdtXwavaxPoolAddress)
              .call()
              .then(function (bal) {
                wavaxBalance = bal / 10 ** 18;
                let usdtAddressContract =
                  '0xde3a24028580884448a5397872046a019649b084';
                var tokenInst = new web3.eth.Contract(
                  abiContract,
                  usdtAddressContract
                );
                tokenInst.methods
                  .balanceOf(usdtXwavaxPoolAddress)
                  .call()
                  .then(function (bal) {
                    usdtBalance = bal / 10 ** 9;
                    let avax2usdt = wavaxBalance / usdtBalance;
                    let spore2usdt = avax2usdt / avax2Spore;
                    return callback('1 SPORE = ' + spore2usdt + ' USDT\n1 AVAX = '+avax2Spore+' SPORE');
                  });
              });
          });
      });
  }
};
