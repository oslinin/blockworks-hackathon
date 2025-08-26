# book

https://jeiwan.net/posts/programming-defi-uniswap-1/

## uniswap V1

```
mkdir zuniswap && cd $_
yarn add -D hardhat
yarn hardhat
yarn add --dev hardhat-deploy
// copy hardhat.config.js
yarn add --dev dotenv

//getcontract
yarn add --dev hardhat @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers

//ethers should be <6, t hen toWei works
yarn list ethers

npm install -g yarn

yarn add --dev hardhat @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers

```

```
  Eth/ZU.  generate ZUV
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
```

# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
