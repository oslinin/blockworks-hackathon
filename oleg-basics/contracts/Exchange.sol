/*  Eth/ZU.  generate ZUV
    tokenAddress //of ZU
    balance in ETH
    reserve in ZU
    liquidity in ZUV1,eth
    AddLiquidity(_tokenAmount)
        if getReserve() ==0
            transfer _tokenAmount from sender
            this will receive the msg.bal in eth
            liq = this.balance in ZUV1 (100 eth, to mint 100 ZUV)
        else
            ethReserve = this.balance - msg.value (100 eth)
            tokenRserve=getReserve() //200 ZU
            tokenAmt = mgs.value*tokenReserve/ethreserve
                e.g. 10 * 200/100 = 20 ZU per 10 eth
                we should deposit 20 ZU.  _tokenAmt must be >20.
            transfer tokenAmt from sender to to this, not _tokenAmt which is higher
            liq = ZUV1 supply * msg.value / ethReserve
                e.g. 100 * 10 / 100 = 10
        mint liq ZUV1s to sender

    getReserve() //ZU balance of this
    getAmount(inAmt, inTknRsrv, outTknRsrv) //of eth
        inputwFee = inAmt * 99;
        num = inputwFee * outTknRsrv
        den = inTknRsrv * 100 + inputwFee
            = 9.9 * 100  /(200+9.9) = 4.7
            = (200 + 9.9)(100-x) = 200 * 100
            = 100 - 20000/(200+9.9) = 4.7
            = (100*(200+9.9)-20000)/(200+9.9)
    removeLiquidity(_amt) //of ZUV
        remove ethAmt - balance ETH * %ZUV
        remove tokenAMt = reserve * %ZUV
        burn _amt ZUV
    ethToTokenSwap(_minTokens) //buy liq tokens
        5 eth to 10 ZZU
        getAmount(5, balance, reserve) = 9.8
    tokenToEthSwap(_tokensSold, _minEth) //s/*  AddLiquidity(_tokenAmount)
 */

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IExchange {
    function ethToTokenSwap(uint256 _minTokens) external payable;

    function ethToTokenTransfer(
        uint256 _minTokens,
        address _recipient
    ) external payable;
}

interface IFactory {
    function getExchange(address _tokenAddress) external returns (address);
}

contract Exchange is ERC20 {
    error Exchange__ERC20InsufficientBalance();
    error Exchange__ERC20InsufficientTokenAmount();

    address public tokenAddress;
    address public factoryAddress; // <--- new line

    //V1 always has eth on the other side
    constructor(address _token) ERC20("Zuniswap-V1", "ZUNI-V1") {
        require(_token != address(0), "invalid token address");
        tokenAddress = _token;
        factoryAddress = msg.sender; // <--- new line
    }

    function addLiquidity(
        uint256 _tokenAmount
    ) public payable returns (uint256) {
        IERC20 token = IERC20(tokenAddress); //receive ether
        uint256 liquidity;
        if (getReserve() == 0) {
            token.transferFrom(msg.sender, address(this), _tokenAmount);
            liquidity = address(this).balance;
        } else {
            uint256 ethReserve = address(this).balance - msg.value;
            uint256 tokenReserve = getReserve();
            uint256 tokenAmount = (msg.value * tokenReserve) / ethReserve; //how much to transfer to keep ratio
            // require(_tokenAmount >= tokenAmount, "insufficient token amount");
            if (_tokenAmount < tokenAmount)
                revert Exchange__ERC20InsufficientTokenAmount();

            token.transferFrom(msg.sender, address(this), tokenAmount);
            liquidity = (totalSupply() * msg.value) / ethReserve;
        }
        _mint(msg.sender, liquidity);
        return liquidity;
    }

    //Let’s also add a helper function that returns token balance of an exchange:
    function getReserve() public view returns (uint256) {
        return IERC20(tokenAddress).balanceOf(address(this));
    }

    /**
     * Fees
     * Adding fees to the contract is as easy as
     * adding a couple of multipliers to getAmount function:
     * You have a pool of 200 zuni, 100 Eth
     * getAmount(10, 10, 10)
     *
     * @param inputAmount desc
     * @param inputReserve desc
     * @param outputReserve desc
     */

    function getAmount(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) public pure returns (uint256) {
        require(inputReserve > 0 && outputReserve > 0, "invalid reserves");
        uint256 inputWithFee = inputAmount * 99;
        uint256 numerator = inputWithFee * outputReserve;
        uint256 denominator = (inputReserve * 100) + inputWithFee;
        return numerator / denominator;
    }

    function removeLiquidity(
        uint256 _amount
    ) public returns (uint256, uint256) {
        // require(_amount > 0, "invalid amount");
        if (_amount <= 0) revert Exchange__ERC20InsufficientBalance();

        uint256 ethAmount = (address(this).balance * _amount) / totalSupply();
        uint256 tokenAmount = (getReserve() * _amount) / totalSupply();
        // 32000000000000000000000.02
        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(ethAmount);
        IERC20(tokenAddress).transfer(msg.sender, tokenAmount);

        return (ethAmount, tokenAmount);
    }

    /**
     * buy tokens for eth
     * @param _minTokens to swap
     */
    function ethToTokenSwap(
        uint256 _minTokens
    ) public payable returns (uint256) {
        uint256 tokenReserve = getReserve();
        uint256 tokensBought = getAmount(
            msg.value,
            address(this).balance - msg.value,
            tokenReserve
        );

        require(tokensBought >= _minTokens, "insufficient output amount");

        IERC20(tokenAddress).transfer(msg.sender, tokensBought);
        return (tokensBought);
    }

    /** If you sell _tokenSold, how much eth would you get
     *
     */
    function getEthAmount(uint256 _tokenSold) public view returns (uint256) {
        require(_tokenSold > 0, "tokenSold is too small");

        uint256 tokenReserve = getReserve();

        return getAmount(_tokenSold, tokenReserve, address(this).balance);
    }

    /**
     * sell tokens for eth
     *
     */
    function tokenToEthSwap(uint256 _tokensSold, uint256 _minEth) public {
        uint256 ethBought = getEthAmount(_tokensSold);

        require(ethBought >= _minEth, "insufficient output amount");

        IERC20(tokenAddress).transferFrom(
            msg.sender,
            address(this),
            _tokensSold
        );
        payable(msg.sender).transfer(ethBought);
    }

    function tokenToTokenSwap(
        uint256 _tokensSold,
        uint256 _minTokensBought,
        address _tokenAddress
    ) public {
        address exchangeAddress = IFactory(factoryAddress).getExchange(
            _tokenAddress
        );
        require(
            exchangeAddress != address(this) && exchangeAddress != address(0),
            "invalid exchange address"
        );

        uint256 tokenReserve = getReserve();
        uint256 ethBought = getAmount(
            _tokensSold,
            tokenReserve,
            address(this).balance
        );

        IERC20(tokenAddress).transferFrom(
            msg.sender,
            address(this),
            _tokensSold
        );

        IExchange(exchangeAddress).ethToTokenTransfer{value: ethBought}(
            _minTokensBought,
            msg.sender
        );
    }
}
