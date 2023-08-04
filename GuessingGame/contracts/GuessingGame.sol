// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GuessingGame {
    address public owner;
    uint256 public pot;
    uint256 public closingTime;
    bool public closed;

    struct Player {
        uint256 guess;
        address addr;
    }

    mapping(uint256 => Player) public players;
    uint256 public numPlayers;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    modifier notClosed() {
        require(!closed, "The game is closed.");
        _;
    }

    constructor(uint256 _closingTime) {
        owner = msg.sender;
        pot = 0;
        closingTime = _closingTime;
        closed = false;
        numPlayers = 0;
    }

    function guessNumber(uint256 _guess) public payable notClosed {
        require(_guess >= 1 && _guess <= 10, "Guess must be between 1 and 10.");
        require(msg.value > 0.01 ether, "Minimum bet is 0.01 ether.");

        players[numPlayers] = Player(_guess, msg.sender);
        numPlayers++;
        pot += msg.value;
    }

    function closeGame() public onlyOwner notClosed {
        require(block.timestamp >= closingTime, "Game is not yet closed.");

        uint256 winningNumber = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % 10 + 1;
        address winner;

        for (uint256 i = 0; i < numPlayers; i++) {
            if (players[i].guess == winningNumber) {
                winner = players[i].addr;
                break;
            }
        }

        if (winner != address(0)) {
            closed = true;
            payable(winner).transfer(pot);
        }
    }
}
