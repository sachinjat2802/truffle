const GuessingGame = artifacts.require("GuessingGame");

contract("GuessingGame", accounts => {
  let instance;
  const owner = accounts[0];
  const player1 = accounts[1];
  const player2 = accounts[2];
  const player3 = accounts[3];

  beforeEach(async () => {
    instance = await GuessingGame.new(Math.floor(Date.now() / 1000) + 60); // Set closing time 1 minute from now
  });

  it("should allow players to guess and close the game correctly", async () => {
    const betAmount = web3.utils.toWei("0.02", "ether");

    await instance.guessNumber(5, { from: player1, value: betAmount });
    await instance.guessNumber(8, { from: player2, value: betAmount });
    await instance.guessNumber(3, { from: player3, value: betAmount });

    await new Promise(resolve => setTimeout(resolve, 60000)); // Wait for the game to close

    const player1BalanceBefore = await web3.eth.getBalance(player1);
    const player2BalanceBefore = await web3.eth.getBalance(player2);
    const player3BalanceBefore = await web3.eth.getBalance(player3);

    await instance.closeGame();

    const player1BalanceAfter = await web3.eth.getBalance(player1);
    const player2BalanceAfter = await web3.eth.getBalance(player2);
    const player3BalanceAfter = await web3.eth.getBalance(player3);

    assert.equal(player1BalanceAfter - player1BalanceBefore, betAmount * 3, "Player 1 should win");
    assert.equal(player2BalanceAfter - player2BalanceBefore, 0, "Player 2 should not win");
    assert.equal(player3BalanceAfter - player3BalanceBefore, 0, "Player 3 should not win");
  });
});
