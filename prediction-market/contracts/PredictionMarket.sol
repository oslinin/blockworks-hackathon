// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./MintableERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PredictionMarket is ERC20, Ownable {
    enum Category { Sports, Elections, Crypto }

    ERC20 public immutable USDC;
    MintableERC20 public immutable yesToken;
    MintableERC20 public immutable noToken;

    uint256 public constant CFMM_K = 250000 * 1e12; // Constant factor for CFMM (x * y = k), scaled for 6 decimals

    uint256 public yesPool;
    uint256 public noPool;

    Category public marketCategory;
    bool public resolved;
    uint256 public winningOutcome; // 0 for No, 1 for Yes

    event BetPlaced(address indexed user, uint256 yesAmount, uint256 noAmount, Category category);
    event MarketResolved(uint256 outcome);

    constructor(
        address _usdcAddress,
        string memory _question,
        Category _category,
        address initialOwner
    ) ERC20(_question, "PM") Ownable(initialOwner) {
        USDC = ERC20(_usdcAddress);
        yesToken = new MintableERC20(string.concat(_question, " Yes"), "YES");
        noToken = new MintableERC20(string.concat(_question, " No"), "NO");
        marketCategory = _category;
        resolved = false;
    }

    function initializeMarket(uint256 initialLiquidityUSDC) public onlyOwner {
        require(yesPool == 0 && noPool == 0, "Market already initialized");
        require(USDC.transferFrom(msg.sender, address(this), initialLiquidityUSDC), "USDC transfer failed");

        // Mint initial Yes and No tokens for liquidity
        uint256 initialYesTokens = initialLiquidityUSDC;
        uint256 initialNoTokens = initialLiquidityUSDC;

        yesToken.mint(address(this), initialYesTokens);
        noToken.mint(address(this), initialNoTokens);

        yesPool = initialYesTokens;
        noPool = initialNoTokens;
    }

    function placeBet(uint256 usdcAmount, bool betOnYes) public {
        require(!resolved, "Market already resolved");
        require(USDC.transferFrom(msg.sender, address(this), usdcAmount), "USDC transfer failed");

        uint256 tokensMinted = usdcAmount;
        uint256 noTokensToBurn;
        uint256 yesTokensToBurn;

        if (betOnYes) {
            yesToken.mint(msg.sender, tokensMinted);

            uint256 newYesPool = yesPool + tokensMinted;
            uint256 newNoPool = CFMM_K / newYesPool;
            noTokensToBurn = noPool - newNoPool;

            require(noTokensToBurn <= noPool, "Insufficient no tokens in pool to burn");
            noToken.burn(address(this), noTokensToBurn);
            noPool = newNoPool;
            yesPool = newYesPool;

        } else { // betOnNo
            noToken.mint(msg.sender, tokensMinted);

            uint256 newNoPool = noPool + tokensMinted;
            uint256 newYesPool = CFMM_K / newNoPool;
            yesTokensToBurn = yesPool - newYesPool;

            require(yesTokensToBurn <= yesPool, "Insufficient yes tokens in pool to burn");
            yesToken.burn(address(this), yesTokensToBurn);
            yesPool = newYesPool;
            noPool = newNoPool;
        }
        emit BetPlaced(msg.sender, betOnYes ? tokensMinted : 0, betOnYes ? 0 : tokensMinted, marketCategory);
    }

    function getProbability() public view returns (uint256 yesProbability, uint256 noProbability) {
        if (yesPool == 0 && noPool == 0) {
            return (5000, 5000); // 0.5 probability, scaled by 10000 for precision
        }
        uint256 totalPool = yesPool + noPool;
        yesProbability = (yesPool * 10000) / totalPool;
        noProbability = (noPool * 10000) / totalPool;
    }

    function resolve(uint256 outcome) public onlyOwner {
        require(!resolved, "Market already resolved");
        require(outcome == 0 || outcome == 1, "Invalid outcome (0 for No, 1 for Yes)");
        resolved = true;
        winningOutcome = outcome;
        emit MarketResolved(outcome);
    }

    function claimWinnings() public {
        require(resolved, "Market not yet resolved");
        if (winningOutcome == 1) { // Yes wins
            uint256 yesTokens = yesToken.balanceOf(msg.sender);
            require(yesTokens > 0, "No winning tokens to claim");
            yesToken.burn(msg.sender, yesTokens);
            USDC.transfer(msg.sender, yesTokens); // 1 Yes token = 1 USDC
        } else { // No wins
            uint256 noTokens = noToken.balanceOf(msg.sender);
            require(noTokens > 0, "No winning tokens to claim");
            noToken.burn(msg.sender, noTokens);
            USDC.transfer(msg.sender, noTokens); // 1 No token = 1 USDC
        }
    }
}
