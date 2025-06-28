// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// A mock ERC20 token to represent USDC, with 6 decimals.
contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {
        _mint(msg.sender, 1_000_000 * 10 ** 6); // Mint 1M USDC to deployer
    }

    // Overriding decimals to return 6
    function decimals() public pure override returns (uint8) {
        return 6;
    }

    // Public mint function for testing purposes
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
