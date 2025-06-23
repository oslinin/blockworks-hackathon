// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Oracle interface used to resolve the YES/NO market outcome
interface IOracle {
    function resolved() external view returns (bool);

    function outcome() external view returns (bool);
}

contract CPMMWithERC20Shares is Ownable {
    IERC20 public usdc; // Stablecoin used for pricing
    IERC20 public yesToken; // YES outcome token
    IERC20 public noToken; // NO outcome token
    IOracle public oracle; // Oracle to determine final outcome

    // YES pool reserves
    uint256 public yesTokenReserve; // Amount of YES tokens available for sale
    uint256 public yesUsdcReserve; // Amount of USDC backing YES tokens

    // NO pool reserves
    uint256 public noTokenReserve; // Amount of NO tokens available for sale
    uint256 public noUsdcReserve; // Amount of USDC backing NO tokens

    // Constructor initializes the token and oracle addresses and sets initial token and USDC reserves
    constructor(
        address _usdc,
        address _oracle,
        address _yesToken,
        address _noToken
    ) Ownable(msg.sender) {
        usdc = IERC20(_usdc);
        oracle = IOracle(_oracle);
        yesToken = IERC20(_yesToken);
        noToken = IERC20(_noToken);

        yesTokenReserve = 500 ether;
        noTokenReserve = 500 ether;
        yesUsdcReserve = 500 ether;
        noUsdcReserve = 500 ether;
    }

    // CPMM pricing function to compute amountIn (USDC) required to buy amountOut (YES/NO tokens)
    function getAmountIn(
        uint256 amountOut,
        uint256 reserveUsdc,
        uint256 reserveToken
    ) public pure returns (uint256) {
        require(amountOut < reserveToken, "Insufficient liquidity");
        uint256 numerator = reserveUsdc * amountOut * 1000;
        // uint256 denominator = (reserveToken - amountOut) * 997;
        uint256 denominator = (reserveToken - amountOut) * 1000;
        return numerator / denominator + 1;
    }

    // CPMM pricing function to compute amountOut (YES/NO tokens) for a given amountIn (USDC)
    function getAmountOut(
        uint256 amountIn,
        uint256 reserveUsdc,
        uint256 reserveToken
    ) public pure returns (uint256) {
        // uint256 amountInWithFee = amountIn * 997;
        uint256 amountInWithFee = amountIn * 1000;
        uint256 numerator = reserveToken * amountInWithFee;
        uint256 denominator = reserveUsdc * 1000 + amountInWithFee;
        return numerator / denominator;
    }

    // Buy YES tokens by supplying the required USDC amount
    function buyYes(uint256 amountOut) external {
        uint256 amountIn = getAmountIn(
            amountOut,
            yesUsdcReserve,
            yesTokenReserve
        );
        require(
            usdc.transferFrom(msg.sender, address(this), amountIn),
            "Transfer failed"
        );
        yesToken.transfer(msg.sender, amountOut);
        yesTokenReserve -= amountOut;
        yesUsdcReserve += amountIn;
    }

    // Buy NO tokens by supplying the required USDC amount
    function buyNo(uint256 amountOut) external {
        uint256 amountIn = getAmountIn(
            amountOut,
            noUsdcReserve,
            noTokenReserve
        );
        require(
            usdc.transferFrom(msg.sender, address(this), amountIn),
            "Transfer failed"
        );
        noToken.transfer(msg.sender, amountOut);
        noTokenReserve -= amountOut;
        noUsdcReserve += amountIn;
    }

    // View current USDC reserve backing YES pool
    function yesReserveValue() public view returns (uint256) {
        return yesUsdcReserve;
    }

    // View current USDC reserve backing NO pool
    function noReserveValue() public view returns (uint256) {
        return noUsdcReserve;
    }

    // View current YES token reserve
    function yesReserve() public view returns (uint256) {
        return yesTokenReserve;
    }

    // View current NO token reserve
    function noReserve() public view returns (uint256) {
        return noTokenReserve;
    }

    // After oracle resolution, allow token holders to redeem for USDC payout
    function redeem() external {
        require(oracle.resolved(), "Not resolved yet");
        bool win = oracle.outcome();
        IERC20 token = win ? yesToken : noToken;
        uint256 bal = token.balanceOf(msg.sender);
        require(bal > 0, "No tokens to redeem");
        require(usdc.transfer(msg.sender, bal), "USDC transfer failed");
    }
}
