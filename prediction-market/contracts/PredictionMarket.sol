// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "prb-math/contracts/PRBMathUD60x18.sol";
import "./MintableERC20.sol";

contract PredictionMarket is Ownable {
    using PRBMathUD60x18 for uint256;

    enum Category { ELECTION, SPORTS, CRYPTO, TV }

    ERC20 public immutable usdcToken;
    MintableERC20 public immutable yesToken;
    MintableERC20 public immutable noToken;

    uint256 public constant K = 250000 * 1e18; // Constant product (500 * 500)

    Category public category;
    string public question;
    address public oracle;
    bool public resolved;
    bool public outcome;

    event Bet(address indexed user, uint256 amount, bool onYes);
    event Resolved(bool outcome);

    constructor(
        string memory _question,
        Category _category,
        address _oracle,
        address _usdcToken,
        address _yesToken,
        address _noToken
    ) Ownable(msg.sender) {
        question = _question;
        category = _category;
        oracle = _oracle;
        usdcToken = ERC20(_usdcToken);
        yesToken = MintableERC20(_yesToken);
        noToken = MintableERC20(_noToken);
    }

    function initialize() public {
        // Mint initial liquidity to this contract
        uint256 initialLiquidity = 500 * 10**18; // 500 of each token
        yesToken.mint(address(this), initialLiquidity);
        noToken.mint(address(this), initialLiquidity);
    }

    function getProbability() public view returns (uint256) {
        uint256 yesBalance = yesToken.balanceOf(address(this));
        uint256 noBalance = noToken.balanceOf(address(this));
        if (yesBalance == 0 || noBalance == 0) {
            return 50 * 1e18; // 50%
        }
        // Returns the price of the "yes" token, which reflects its probability.
        return (noBalance.mul(100 * 1e18)).div(yesBalance + noBalance);
    }

    function bet(uint256 amount, bool onYes) public {
        require(!resolved, "Market is already resolved");
        require(amount > 0, "Amount must be greater than 0");

        usdcToken.transferFrom(msg.sender, address(this), amount);
        uint256 scaledAmount = amount * 10**12;

        if (onYes) {
            // Mint new tokens
            yesToken.mint(msg.sender, scaledAmount);
            noToken.mint(address(this), scaledAmount); // Mint no tokens to the pool

            // Swap
            uint256 yesPoolBalance = yesToken.balanceOf(address(this));
            uint256 noPoolBalance = noToken.balanceOf(address(this));
            uint256 newYesPoolBalance = K.div(noPoolBalance);
            uint256 yesTokensToSend = yesPoolBalance - newYesPoolBalance;

            yesToken.transfer(msg.sender, yesTokensToSend);
        } else {
            // Mint new tokens
            noToken.mint(msg.sender, scaledAmount);
            yesToken.mint(address(this), scaledAmount); // Mint yes tokens to the pool

            // Swap
            uint256 yesPoolBalance = yesToken.balanceOf(address(this));
            uint256 noPoolBalance = noToken.balanceOf(address(this));
            uint256 newNoPoolBalance = K.div(yesPoolBalance);
            uint256 noTokensToSend = noPoolBalance - newNoPoolBalance;

            noToken.transfer(msg.sender, noTokensToSend);
        }

        emit Bet(msg.sender, amount, onYes);
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

        if (outcome) {
            uint256 yesBalance = yesToken.balanceOf(msg.sender);
            yesToken.transferFrom(msg.sender, address(this), yesBalance);
            usdcToken.transfer(msg.sender, yesBalance / (10**12));
        } else {
            uint256 noBalance = noToken.balanceOf(msg.sender);
            noToken.transferFrom(msg.sender, address(this), noBalance);
            usdcToken.transfer(msg.sender, noBalance / (10**12));
        }
    }
}

