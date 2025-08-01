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

    uint256 public K;
    bool public initialized;

    Category public category;
    string public question;
    address public oracle;
    bool public resolved;
    bool public outcome;

    event Bet(address indexed user, uint256 amount, bool onYes);
    event Resolved(bool outcome);
    event Initialized(uint256 k);

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

    function initialize(uint256 initialLiquidity) public {
        require(!initialized, "Market has already been initialized");
        // Scale USDC amount (6 decimals) to internal token precision (18 decimals)
        uint256 scaledInitialLiquidity = initialLiquidity * 10**12;
        // Mint initial liquidity to this contract
        yesToken.mint(address(this), scaledInitialLiquidity);
        noToken.mint(address(this), scaledInitialLiquidity);
        K = scaledInitialLiquidity.mul(scaledInitialLiquidity);
        initialized = true;
        emit Initialized(K);
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
        require(initialized, "Market not initialized");
        require(amount > 0, "Amount must be greater than 0");

        usdcToken.transferFrom(msg.sender, address(this), amount);
        // Scale USDC amount (6 decimals) to internal token precision (18 decimals)
        uint256 scaledAmount = amount * 10**12;

        if (onYes) {
            uint256 yesPoolBalance = yesToken.balanceOf(address(this));
            uint256 noPoolBalance = noToken.balanceOf(address(this));
            
            // Calculate how many "yes" tokens to send
            uint256 newNoPoolBalance = noPoolBalance + scaledAmount;
            uint256 newYesPoolBalance = K.div(newNoPoolBalance);
            uint256 yesTokensToSend = yesPoolBalance - newYesPoolBalance;

            yesToken.transfer(msg.sender, yesTokensToSend);
            noToken.mint(address(this), scaledAmount);

        } else {
            uint256 yesPoolBalance = yesToken.balanceOf(address(this));
            uint256 noPoolBalance = noToken.balanceOf(address(this));

            // Calculate how many "no" tokens to send
            uint256 newYesPoolBalance = yesPoolBalance + scaledAmount;
            uint256 newNoPoolBalance = K.div(newYesPoolBalance);
            uint256 noTokensToSend = noPoolBalance - newNoPoolBalance;

            noToken.transfer(msg.sender, noTokensToSend);
            yesToken.mint(address(this), scaledAmount);
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
            // Scale internal token amount (18 decimals) down to USDC precision (6 decimals)
            usdcToken.transfer(msg.sender, yesBalance / (10**12));
        } else {
            uint256 noBalance = noToken.balanceOf(msg.sender);
            noToken.transferFrom(msg.sender, address(this), noBalance);
            // Scale internal token amount (18 decimals) down to USDC precision (6 decimals)
            usdcToken.transfer(msg.sender, noBalance / (10**12));
        }
    }
}