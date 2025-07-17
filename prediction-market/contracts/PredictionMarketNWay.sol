// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MintableERC20.sol";

contract PredictionMarketNWay {
    enum Category { ELECTION, SPORTS, CRYPTO, OTHER }

    ERC20 public usdcToken;
    MintableERC20[] public outcomeTokens;
    Category public category;
    string public question;
    address public oracle;
    bool public resolved;
    uint256 public winningOutcome;

    event MarketCreated(address indexed marketAddress, string question, Category category);
    event Bet(address indexed user, uint256 amount, uint256 indexed outcomeIndex);
    event Resolved(uint256 winningOutcome);
    event Claimed(address indexed user, uint256 amount);

    constructor(
        string memory _question,
        Category _category,
        address _oracle,
        address _usdcToken,
        string[] memory _outcomeNames,
        string[] memory _outcomeSymbols,
        uint256 initialLiquidity
    ) {
        question = _question;
        category = _category;
        oracle = _oracle;
        usdcToken = ERC20(_usdcToken);

        for (uint256 i = 0; i < _outcomeNames.length; i++) {
            MintableERC20 token = new MintableERC20(_outcomeNames[i], _outcomeSymbols[i]);
            outcomeTokens.push(token);
            token.mint(address(this), initialLiquidity);
        }

        emit MarketCreated(address(this), _question, _category);
    }

    function getProbabilities() public view returns (uint256[] memory) {
        uint256 numOutcomes = outcomeTokens.length;
        uint256[] memory probabilities = new uint256[](numOutcomes);
        uint256 totalTokens = 0;

        for (uint256 i = 0; i < numOutcomes; i++) {
            totalTokens += outcomeTokens[i].balanceOf(address(this));
        }

        if (totalTokens == 0) {
            return probabilities;
        }

        for (uint256 i = 0; i < numOutcomes; i++) {
            probabilities[i] = (outcomeTokens[i].balanceOf(address(this)) * 1e18) / totalTokens;
        }

        return probabilities;
    }

    function bet(uint256 amount, uint256 outcomeIndex) external {
        require(!resolved, "Market is resolved");
        require(outcomeIndex < outcomeTokens.length, "Invalid outcome index");

        usdcToken.transferFrom(msg.sender, address(this), amount);

        uint256 numOutcomes = outcomeTokens.length;
        for (uint256 i = 0; i < numOutcomes; i++) {
            outcomeTokens[i].mint(address(this), amount);
        }

        outcomeTokens[outcomeIndex].transfer(msg.sender, amount);

        emit Bet(msg.sender, amount, outcomeIndex);
    }

    function resolve(uint256 _winningOutcome) external {
        require(msg.sender == oracle, "Only oracle can resolve");
        require(!resolved, "Market already resolved");
        require(_winningOutcome < outcomeTokens.length, "Invalid outcome");

        resolved = true;
        winningOutcome = _winningOutcome;
        emit Resolved(_winningOutcome);
    }

    function claim() external {
        require(resolved, "Market not resolved");

        uint256 userBalance = outcomeTokens[winningOutcome].balanceOf(msg.sender);
        require(userBalance > 0, "No winnings to claim");

        outcomeTokens[winningOutcome].transferFrom(msg.sender, address(this), userBalance);
        usdcToken.transfer(msg.sender, userBalance);

        emit Claimed(msg.sender, userBalance);
    }
}
