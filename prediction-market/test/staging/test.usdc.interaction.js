const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const { networkConfig, developmentChains } = require("../../helper-hardhat-config");

console.log(`Running on network: ${network.name}`);

!developmentChains.includes(network.name)
    ? describe("PredictionMarket Staging Tests", function () {
          let owner, alice, oracle;
          let usdc, yesToken, noToken;
          let market, factory;
          const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // Mainnet USDC
          const factoryAddress = "0x6115e406dBE91D89068B904C3076B649b17a453d"; // From localhost deployment

          beforeEach(async function () {
              [owner, alice, oracle] = await ethers.getSigners();

              // Fund owner with ETH for gas
              const ethWhaleAddress = "0x00000000219ab540356cBB839Cbe05303d7705Fa"; // ETH2 Staking Contract
              await network.provider.request({
                  method: "hardhat_impersonateAccount",
                  params: [ethWhaleAddress],
              });
              const ethWhale = await ethers.getSigner(ethWhaleAddress);
              await ethWhale.sendTransaction({
                  to: owner.address,
                  value: ethers.parseEther("10.0"),
              });
              await network.provider.request({
                method: "hardhat_stopImpersonatingAccount",
                params: [ethWhaleAddress],
              });

              // Get the deployed factory
              factory = await ethers.getContractAt("PredictionMarketFactory", factoryAddress);

              // The owner creates a market
              const marketAddress = await factory
                  .connect(owner)
                  .createMarket.staticCall(
                      "Will ETH reach $5000 by end of year?",
                      2, // CRYPTO
                      oracle.address,
                      usdcAddress,
                      "Yes Token",
                      "YES",
                      "No Token",
                      "NO"
                  );

              await factory.connect(owner).createMarket(
                  "Will ETH reach $5000 by end of year?",
                  2, // CRYPTO
                  oracle.address,
                  usdcAddress,
                  "Yes Token",
                  "YES",
                  "No Token",
                  "NO"
              );

              // Attach to the created contracts
              market = await ethers.getContractAt("PredictionMarket", marketAddress);
              const yesTokenAddress = await market.yesToken();
              const noTokenAddress = await market.noToken();
              yesToken = await ethers.getContractAt("MintableERC20", yesTokenAddress);
              noToken = await ethers.getContractAt("MintableERC20", noTokenAddress);
              usdc = await ethers.getContractAt("MintableERC20", usdcAddress);

              // Get some USDC for Alice
              const usdcHolderAddress = "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503"; // A known USDC whale
              await network.provider.request({
                  method: "hardhat_impersonateAccount",
                  params: [usdcHolderAddress],
              });
              const usdcHolder = await ethers.getSigner(usdcHolderAddress);
              await usdc.connect(usdcHolder).transfer(alice.address, ethers.parseUnits("10000", 6));
              await network.provider.request({
                  method: "hardhat_stopImpersonatingAccount",
                  params: [usdcHolderAddress],
              });

              // Approve the market to spend Alice's USDC
              await usdc.connect(alice).approve(await market.getAddress(), ethers.parseUnits("10000", 6));
          });

          it("should have correct initial state", async function () {
              const marketAddress = await market.getAddress();
              expect(await yesToken.balanceOf(marketAddress)).to.equal(ethers.parseUnits("500", 18));
              expect(await noToken.balanceOf(marketAddress)).to.equal(ethers.parseUnits("500", 18));
              const probability = await market.getProbability();
              expect(Number(ethers.formatUnits(probability, 18))).to.be.closeTo(50, 0.01);
          });

          it("should handle bets correctly according to the spec", async function () {
              const marketAddress = await market.getAddress();

              // Test 1: Alice bets 100 USDC on "yes"
              await market.connect(alice).bet(ethers.parseUnits("100", 6), true);

              let noBalance = await noToken.balanceOf(marketAddress);
              let yesBalance = await yesToken.balanceOf(marketAddress);
              let aliceYesBalance = await yesToken.balanceOf(alice.address);

              expect(noBalance).to.equal(ethers.parseUnits("600", 18));
              expect(yesBalance).to.be.closeTo(
                  ethers.parseUnits("416.666666666666666667", 18),
                  ethers.parseUnits("0.0001", 18)
              );
              expect(aliceYesBalance).to.be.closeTo(
                  ethers.parseUnits("183.333333333333333333", 18),
                  ethers.parseUnits("0.0001", 18)
              );
          });

          it("should calculate the correct probability after a bet", async function () {
              // Probability starts at 50%
              let probability = await market.getProbability();
              expect(Number(ethers.formatUnits(probability, 18))).to.be.closeTo(50, 0.01);

              // Alice places a bet on "yes" with 100 USDC
              await market.connect(alice).bet(ethers.parseUnits("100", 6), true);

              // After the bet, the pool has ~416.67 yes and 600 no
              // Probability of yes is 600 / (416.66667 + 600) = 0.5901...
              probability = await market.getProbability();
              expect(Number(ethers.formatUnits(probability, 18))).to.be.closeTo(59.01, 0.01);
          });

          it("should resolve the market", async function () {
              await market.connect(oracle).resolve(true);
              expect(await market.resolved()).to.be.true;
              expect(await market.outcome()).to.be.true;
          });
      })
    : describe.skip;
