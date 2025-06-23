// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockOracle {
    bool public resolved;
    bool public outcome;

    function setResolved(bool _resolved, bool _outcome) external {
        resolved = _resolved;
        outcome = _outcome;
    }
}
