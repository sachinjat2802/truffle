const GuessingGame = artifacts.require("GuessingGame");

module.exports = function (deployer) {
  deployer.deploy(GuessingGame, /* closingTime */ 1630444800); // Replace the timestamp with your desired closing time
};
