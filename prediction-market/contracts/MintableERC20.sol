// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MintableERC20 is ERC20 {
    address public minter;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        minter = msg.sender;
    }

    function mint(address to, uint256 amount) public {
        require(msg.sender == minter, "Only minter can mint");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public {
        require(msg.sender == minter, "Only minter can burn");
        _burn(from, amount);
    }
}
