// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./OutcomeToken.sol";

contract PredictionMarket {
    // ... (Events, Enums, State variables are the same) ...
    event Bet(
        address indexed user,
        Outcome indexed outcome,
        uint256 usdcAmount,
        uint256 payoutTokens
    );
    event Resolved(Outcome winningOutcome);
    event Redeemed(address indexed user, uint256 usdcPayout);
    event LiquidityAdded(uint256 usdcAmount);

    enum Outcome {
        Unresolved,
        Yes,
        No
    }

    IERC20 public immutable usdcToken;
    OutcomeToken public immutable yesToken;
    OutcomeToken public immutable noToken;

    uint256 public K; // Now mutable, set on initialization

    uint256 public poolYes;
    uint256 public poolNo;
    uint256 public totalCollateral;

    Outcome public winningOutcome;
    address public immutable oracle;

    uint256 private constant DECIMALS_CONVERSION_FACTOR = 10 ** 12;

    // CONSTRUCTOR (SIMPLIFIED)
    constructor(address _usdcAddress) {
        oracle = msg.sender;
        usdcToken = IERC20(_usdcAddress);

        yesToken = new OutcomeToken("Yes Token", "YES", address(this));
        noToken = new OutcomeToken("No Token", "NO", address(this));
    }

    // NEW INITIALIZATION FUNCTION
    function addInitialLiquidity(uint256 initialUSDC) external {
        require(K == 0, "Market already initialized");
        require(initialUSDC > 0, "Initial liquidity must be positive");

        // Pull initial liquidity from deployer
        usdcToken.transferFrom(msg.sender, address(this), initialUSDC);
        totalCollateral = initialUSDC;

        uint256 initialTokens = initialUSDC * DECIMALS_CONVERSION_FACTOR;

        // Initialize pools
        poolYes = initialTokens;
        poolNo = initialTokens;

        // Mint initial tokens to the contract's pools
        yesToken.mint(address(this), poolYes);
        noToken.mint(address(this), poolNo);

        // Set the constant product K
        K = poolYes * poolNo;

        emit LiquidityAdded(initialUSDC);
    }

    // ... (betYes, betNo, resolve, redeem, getYesPrice functions remain the same) ...
    // --- Betting Functions ---
    function betYes(uint256 usdcAmount) external {
        require(K > 0, "Market not initialized");
        require(usdcAmount > 0, "Amount must be positive");
        require(winningOutcome == Outcome.Unresolved, "Market is resolved");
        usdcToken.transferFrom(msg.sender, address(this), usdcAmount);
        totalCollateral += usdcAmount;
        uint256 tokenAmount = usdcAmount * DECIMALS_CONVERSION_FACTOR;
        yesToken.mint(msg.sender, tokenAmount);
        noToken.mint(address(this), tokenAmount);
        uint256 oldPoolYes = poolYes;
        poolNo += tokenAmount;
        poolYes = K / poolNo;
        uint256 yesTokensOut = oldPoolYes - poolYes;
        yesToken.transfer(msg.sender, yesTokensOut);
        emit Bet(
            msg.sender,
            Outcome.Yes,
            usdcAmount,
            tokenAmount + yesTokensOut
        );
    }

    /**
     * @notice Gets the current price of a "Yes" outcome share.
     * @return price The price, scaled by 1e18 for precision.
     */
    function getYesPrice() external view returns (uint256) {
        if (poolYes + poolNo == 0) {
            return 0; // Avoid division by zero before initialization
        }
        // Price is the ratio of the "other" pool to the total pools
        return (poolNo * 1e18) / (poolYes + poolNo);
    }

    // --- Redemption & Resolution ---
    function resolve(Outcome _winningOutcome) external {
        require(msg.sender == oracle, "Only oracle can resolve");
        require(
            winningOutcome == Outcome.Unresolved,
            "Market already resolved"
        );
        require(
            _winningOutcome != Outcome.Unresolved,
            "Cannot resolve to Unresolved"
        );
        winningOutcome = _winningOutcome;
        emit Resolved(_winningOutcome);
    }

    function redeem() external {
        require(winningOutcome != Outcome.Unresolved, "Market not resolved");

        OutcomeToken winningToken = (winningOutcome == Outcome.Yes)
            ? yesToken
            : noToken;
        uint256 userBalance = winningToken.balanceOf(msg.sender);

        if (userBalance > 0) {
            uint256 usdcPayout = userBalance / DECIMALS_CONVERSION_FACTOR;

            winningToken.burnFrom(msg.sender, userBalance);
            usdcToken.transfer(msg.sender, usdcPayout);

            emit Redeemed(msg.sender, usdcPayout);
        }
    }
}
