// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PredictionMarketFixedModel is Ownable {
    enum Category { ELECTION, SPORTS, CRYPTO, TV }

    ERC20 public immutable usdcToken;

    uint256 public totalYesBets;
    uint256 public totalNoBets;

    mapping(address => uint256) public yesBets;
    mapping(address => uint256) public noBets;

    Category public category;
    string public question;
    address public oracle;
    bool public resolved;
    bool public outcome; // true for YES, false for NO

    event Bet(address indexed user, bool onYes);
    event Resolved(bool outcome);
    event Claimed(address indexed user, uint256 amount);

    constructor(
        string memory _question,
        Category _category,
        address _oracle,
        address _usdcToken
    ) Ownable(msg.sender) {
        question = _question;
        category = _category;
        oracle = _oracle;
        usdcToken = ERC20(_usdcToken);
    }

    function bet(bool onYes) public {
        require(!resolved, "Market is already resolved");

        // Each bet is 1 USDC (assuming 6 decimals for USDC)
        uint256 betAmount = 1 * 10**6;

        usdcToken.transferFrom(msg.sender, address(this), betAmount);

        if (onYes) {
            yesBets[msg.sender]++;
            totalYesBets++;
        } else {
            noBets[msg.sender]++;
            totalNoBets++;
        }

        emit Bet(msg.sender, onYes);
    }

    function resolve(bool _outcome) public {
        require(msg.sender == oracle, "Only oracle can resolve");
        require(!resolved, "Market is already resolved");

        resolved = true;
        outcome = _outcome;
        emit Resolved(_outcome);
    }

    function claim() public {
        require(resolved, "Market is not resolved yet");

        uint256 winnings;
        if (outcome) { // YES won
            uint256 userBets = yesBets[msg.sender];
            require(userBets > 0, "No winnings to claim");
            require(totalYesBets > 0, "No yes bets were made");

            uint256 noPot = totalNoBets * 10**6; // Total USDC from NO bets
            uint256 profit = (noPot * userBets) / totalYesBets;
            winnings = profit + (userBets * 10**6); // Add original stake back

            yesBets[msg.sender] = 0; // Prevent double claim
        } else { // NO won
            uint256 userBets = noBets[msg.sender];
            require(userBets > 0, "No winnings to claim");
            require(totalNoBets > 0, "No no bets were made");

            uint256 yesPot = totalYesBets * 10**6; // Total USDC from YES bets
            uint256 profit = (yesPot * userBets) / totalNoBets;
            winnings = profit + (userBets * 10**6); // Add original stake back

            noBets[msg.sender] = 0; // Prevent double claim
        }
        
        require(winnings > 0, "Winnings must be greater than zero");
        usdcToken.transfer(msg.sender, winnings);
        emit Claimed(msg.sender, winnings);
    }
}
