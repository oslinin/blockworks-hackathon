// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PredictionMarketNWayFixedModel is Ownable {
    enum Category { ELECTION, SPORTS, CRYPTO, TV }

    ERC20 public immutable usdcToken;

    uint256[] public totalBetsPerOutcome;
    mapping(uint256 => mapping(address => uint256)) public betsPerOutcome; // outcomeIndex => user => numberOfBets

    Category public category;
    string public question;
    address public oracle;
    bool public resolved;
    uint256 public winningOutcome;

    event Bet(address indexed user, uint256 indexed outcomeIndex);
    event Resolved(uint256 winningOutcome);
    event Claimed(address indexed user, uint256 amount);

    constructor(
        string memory _question,
        Category _category,
        address _oracle,
        address _usdcToken,
        uint256 _numOutcomes
    ) Ownable(msg.sender) {
        question = _question;
        category = _category;
        oracle = _oracle;
        usdcToken = ERC20(_usdcToken);
        totalBetsPerOutcome = new uint256[](_numOutcomes);
    }

    function bet(uint256 outcomeIndex) public {
        require(!resolved, "Market is already resolved");
        require(outcomeIndex < totalBetsPerOutcome.length, "Invalid outcome index");

        // Each bet is 1 USDC (assuming 6 decimals for USDC)
        uint256 betAmount = 1 * 10**6;

        require(usdcToken.balanceOf(msg.sender) >= betAmount, "Insufficient USDC balance");
        usdcToken.transferFrom(msg.sender, address(this), betAmount);

        betsPerOutcome[outcomeIndex][msg.sender]++;
        totalBetsPerOutcome[outcomeIndex]++;

        emit Bet(msg.sender, outcomeIndex);
    }

    function getNumOutcomes() public view returns (uint256) {
        return totalBetsPerOutcome.length;
    }

    function resolve(uint256 _winningOutcome) public {
        require(msg.sender == oracle, "Only oracle can resolve");
        require(!resolved, "Market is already resolved");
        require(_winningOutcome < totalBetsPerOutcome.length, "Invalid outcome");

        resolved = true;
        winningOutcome = _winningOutcome;
        emit Resolved(_winningOutcome);
    }

    function claim() public {
        require(resolved, "Market is not resolved yet");

        uint256 userBets = betsPerOutcome[winningOutcome][msg.sender];
        require(userBets > 0, "No winnings to claim");

        uint256 totalWinningBets = totalBetsPerOutcome[winningOutcome];
        require(totalWinningBets > 0, "No winning bets were made");

        uint256 totalLosingPot = 0;
        for (uint i = 0; i < totalBetsPerOutcome.length; i++) {
            if (i != winningOutcome) {
                totalLosingPot += totalBetsPerOutcome[i] * 10**6;
            }
        }

        uint256 profit = (totalLosingPot * userBets) / totalWinningBets;
        uint256 winnings = profit + (userBets * 10**6); // Add original stake back

        betsPerOutcome[winningOutcome][msg.sender] = 0; // Prevent double claim
        
        require(winnings > 0, "Winnings must be greater than zero");
        usdcToken.transfer(msg.sender, winnings);
        emit Claimed(msg.sender, winnings);
    }
}
