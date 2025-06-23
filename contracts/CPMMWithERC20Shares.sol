// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./YesToken.sol";
import "./NoToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CPMMWithERC20Shares is Ownable {
    YesToken public yesToken;
    NoToken public noToken;
    IERC20 public usdc;

    uint256 public yesReserve;
    uint256 public noReserve;
    bool public marketResolved;
    bool public outcomeYes;

    constructor(
        address usdc_,
        YesToken yesToken_,
        NoToken noToken_
    ) Ownable(msg.sender) {
        usdc = IERC20(usdc_);
        yesToken = yesToken_;
        noToken = noToken_;
    }

    function buyYesForUSDC(uint256 usdcAmount) external {
        require(usdcAmount > 0, "Amount must be greater than 0");
        require(!marketResolved, "Market is resolved");

        require(
            usdc.transferFrom(msg.sender, address(this), usdcAmount),
            "USDC transfer failed"
        );

        yesToken.mint(msg.sender, usdcAmount);
        noToken.mint(msg.sender, usdcAmount);

        yesReserve += usdcAmount;
        noReserve += usdcAmount;
    }

    function getAmountIn(
        uint256 tokenOut,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256) {
        require(tokenOut > 0, "Output amount must be positive");
        require(reserveIn > 0 && reserveOut > 0, "Invalid reserves");
        return (reserveIn * tokenOut) / (reserveOut - tokenOut);
    }

    function resolveMarket(bool _outcomeYes) external onlyOwner {
        require(!marketResolved, "Already resolved");
        marketResolved = true;
        outcomeYes = _outcomeYes;
    }

    function redeem() external {
        require(marketResolved, "Market not resolved");

        if (outcomeYes) {
            uint256 amount = yesToken.balanceOf(msg.sender);
            require(amount > 0, "No YES tokens to redeem");
            yesToken.burnFrom(msg.sender, amount);
            require(usdc.transfer(msg.sender, amount), "USDC transfer failed");
        } else {
            uint256 amount = noToken.balanceOf(msg.sender);
            require(amount > 0, "No NO tokens to redeem");
            noToken.burnFrom(msg.sender, amount);
            require(usdc.transfer(msg.sender, amount), "USDC transfer failed");
        }
    }
}
