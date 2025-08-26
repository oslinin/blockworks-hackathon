//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Exchange.sol";

contract Factory {
    mapping(address => address)
        public tokenToExchange;

    error Factory__exchangeAlreadyExists(address);

    function createExchange(
        address _tokenAddress
    ) public returns (address) {
        require(
            _tokenAddress != address(0),
            "invalid token address"
        );
        if (
            tokenToExchange[_tokenAddress] !=
            address(0)
        ) {
            revert Factory__exchangeAlreadyExists(
                _tokenAddress
            ); // Custom error with an argument
        }
        Exchange exchange = new Exchange(
            _tokenAddress
        );
        tokenToExchange[_tokenAddress] = address(
            exchange
        );

        return address(exchange);
    }

    function getExchange(
        address _tokenAddress
    ) public view returns (address) {
        return tokenToExchange[_tokenAddress];
    }
}
