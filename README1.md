2024-09-24

- [OS](#os)
  - [git](#git)
  - [npm node package manager](#npm-node-package-manager)
    - [nvm](#nvm)
    - [python](#python)
- [Vscode/markdown](#vscodemarkdown)
  - [extensions](#extensions)
    - [shell](#shell)
    - [git](#git-1)
    - [send to terminal](#send-to-terminal)
    - [VSCode color](#vscode-color)
    - [VScode git](#vscode-git)
    - [RMarkdown all in one](#rmarkdown-all-in-one)
- [Brownie](#brownie)
  - [links](#links)
  - [brownie-05-Simple-Storage](#brownie-05-simple-storage)
    - [contract](#contract)
    - [test](#test)
  - [brownie-06-fundme](#brownie-06-fundme)
  - [brownie-07-smartcontract-lottery](#brownie-07-smartcontract-lottery)
  - [brownie-08-brownie-mix](#brownie-08-brownie-mix)
  - [brownie-09-erc20](#brownie-09-erc20)
- [JS](#js)
  - [js-05-ethers-simple-storage](#js-05-ethers-simple-storage)
    - [yarn](#yarn)
    - [Ethers](#ethers)
    - [Hardhat](#hardhat)
    - [JS](#js-1)
  - [js-06-hardhat-simple-storage](#js-06-hardhat-simple-storage)
    - [verify](#verify)
  - [js-07-hardhat-fund-me (with price converter)](#js-07-hardhat-fund-me-with-price-converter)
  - [js-10-nextjs-smartcontract-lottery-fcc](#js-10-nextjs-smartcontract-lottery-fcc)
  - [js-11-hardhat-start-kit](#js-11-hardhat-start-kit)
  - [js-12-erc20](#js-12-erc20)
  - [js-13-defi](#js-13-defi)
  - [js-14-hardhat-nft-fcc](#js-14-hardhat-nft-fcc)
  - [js-15-nft-marketplace](#js-15-nft-marketplace)
    - [backend](#backend)
    - [thegraph](#thegraph)
    - [theraph ui](#theraph-ui)
- [Foundry](#foundry)
  - [foundry-06-simple-storage](#foundry-06-simple-storage)
  - [Foundry-07-fundme](#foundry-07-fundme)
    - [Tools (forge/anvil/chisel)](#tools-forgeanvilchisel)
      - [forge](#forge)
      - [git submodule update](#git-submodule-update)
      - [gas](#gas)
      - [chiesel (solidity in terminal)](#chiesel-solidity-in-terminal)
      - [other](#other)
    - [make](#make)
    - [gas](#gas-1)
      - [Gas optimization/storage](#gas-optimizationstorage)
    - [address](#address)
    - [cheats](#cheats)
    - [tests](#tests)
    - [etc](#etc)
  - [Foundry-08-html-fund-me](#foundry-08-html-fund-me)
  - [Foundry-09-raffle](#foundry-09-raffle)
    - [VRF](#vrf)
    - [Keeper](#keeper)
    - [tests](#tests-1)
    - [subscription](#subscription)
  - [Foundry-10-erc20](#foundry-10-erc20)
- [oleg basic (rewrite zuniswap)](#oleg-basic-rewrite-zuniswap)
  - [oleg-basic zuniswap1 hardhat](#oleg-basic-zuniswap1-hardhat)
  - [zuniswap1 foundry](#zuniswap1-foundry)
    - [zuniswap contract](#zuniswap-contract)
    - [week 3](#week-3)
  - [Zuniswap2](#zuniswap2)
    - [week 1](#week-1)
    - [Week 2](#week-2)
    - [Week 3](#week-3-1)
    - [Week 4](#week-4)
  - [V3](#v3)
    - [Calculating Liquidity](#calculating-liquidity)
    - [Pool contract](#pool-contract)
- [Medium Uniswap](#medium-uniswap)
- [Speedrun](#speedrun)

# OS

## git

```bash
git reset  #undo
echo "venv" > .gitignore
```

## npm node package manager

```bash
nvm install-latest-npm
nvm install 22
nvm use 22
npm -v
npm install npm -g

```

### nvm

multiple versions of npm

### python

source ~/Documents/venv/bin/activate
pip install black
pip install autoflake
autoflake --in-place --remove-unused-variables --remove-all-unused-imports -r .
black .

pip install black installs the Black code formatter.
pip install autoflake installs autoflake for removing unused imports and variables.
autoflake --in-place --remove-unused-variables --remove-all-unused-imports -r . recursively cleans Python files in the current directory.
black . formats all Python files in the current directory using Black.

# Vscode/markdown

https://www.markdownguide.org/basic-syntax/

Terminal Ctrl+`
send line to terminal ctrl+' thanks to https://marketplace.visualstudio.com/items?itemName=nvbn.sendtorepl

sRender:
Open your Markdown file in VS Code.
Use the shortcut Ctrl+Shift+V to open the Markdown preview side-by-side with your editor.
Alternatively, you can use Ctrl+K V to open the preview in a new tab.

TOC: extension Markdown All In One; ctrl+shift+P; type create TOC

Ctrl+P: file viewer; Ctrl+Shift+P: com
code <file> //edit file

copilot alternative: tabnine

- ollama
  - ollama run llama3.2:1b
  - Cody VScode extension

## extensions

- solidity visual auditor
-

### shell

```
mkdir xx && cd $_
```

### git

git init -b main
git fetch
git pull
git status
git add .
git log
git status
git reset
git commit -m "dfkdj"
//github
//make repository
git config user.name ""
git remote add origin <url>
git remote -v
git push
git push -u origin main
git pull origin main
git clone

### send to terminal

https://stackoverflow.com/questions/38952053/how-can-i-run-text-selected-in-the-active-editor-in-vs-codes-integrated-termina
Press Ctrl+K, Ctrl+S; Search for workbench.action.terminal.runSelectedText
ctrl-alt-space

### VSCode color

Select the File > Preferences (Code > Preferences or Code > Settings on macOS) > Theme > Color
Theme menu item, or use the Preferences: Color Theme command (Ctrl+K Ctrl+T) to display the Color Theme picker.
https://code.visualstudio.com/docs/getstarted/themes
use high contrast

### VScode git

https://code.visualstudio.com/docs/sourcecontrol/overview

### RMarkdown all in one

https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one

- math
- Markdown All in One: Create Table of Contents
- Markdown All in One: Update Table of Contents
- Markdown All in One: Add/Update section numbers
- Markdown All in One: Remove section numbers
- Markdown All in One: Toggle code span
- Markdown All in One: Toggle code block
- Markdown All in One: Print current document to HTML
- Markdown All in One: Print documents to HTML
- Markdown All in One: Toggle math environment
- Markdown All in One: Toggle list

Key Command

- Ctrl/Cmd + B Toggle bold
- Ctrl/Cmd + I Toggle italic
- Alt+S (on Windows) Toggle strikethrough1
- Ctrl + Shift + ] Toggle heading (uplevel)
- Ctrl + Shift + [ Toggle heading (downlevel)
- Ctrl/Cmd + M Toggle math environment
- Alt + C Check/Uncheck task list item
- Ctrl/Cmd + Shift + V Toggle preview
- Ctrl/Cmd + K V Toggle preview to side

Table Ctrl + Shift + I not working!f

|Left|right|
|1|2|
|3|4|

# Brownie

https://github.com/smartcontractkit/full-blockchain-solidity-course-py

## links

https://iamdefinitelyahuman.medium.com/getting-started-with-brownie-part-1-9b2181f4cb99

https://eth-brownie.readthedocs.io/en/stable/

https://github.com/smartcontractkit/full-blockchain-solidity-course-py

```bash
python3 -m venv ~/Documents/venv
source ~/Documents/venv/bin/activate

pip install black
pip install py-solc-x
```

## brownie-05-Simple-Storage

Contract: SimpleStoreage.sol
struct(favoriteNumber, name);
mapping nameToFavoriteNumber
retreive
addperson

```bash
git clone https://github.com/PatrickAlphaC/brownie_simple_storage.git brownie-05-Simple-Storage && cd brownie-05-Simple-Storage && rm -rf .git

pipx install eth-brownie
pipx inject eth-brownie setuptools
npm install -g ganache-cli
brownie #commands
brownie run #run script
brownie accounts list
brownie accounts new 0
brownie test
brownie test -k test_updating_storage
brownie test -pdb #python debugger
brownie test -s #verbose
brownie compile
brownie console
brownie run scripts/deploy.py
brownie run scripts/deploy.py --network sepolia

#network
source .env
echo $WEB3_INFURA_PROJECT_ID

```

### contract

### test

```python
test_deploy:
    simple_storage = SimpleStorage.deploy({"from": account})
    starting_value = simple_storage.retrieve()
def test_updating_storage():
    # Arrange
    account = accounts[0]
    simple_storage = SimpleStorage.deploy({"from": account})
    # Act
    expected = 15
    txn = simple_storage.store(expected, {"from": account})
    txn.wait(1)
    # Assert
    assert expected == simple_storage.retrieve()
```

## brownie-06-fundme

open ganache UI

```bash
git clone https://github.com/PatrickAlphaC/brownie_fund_me brownie-06-fundme && cd brownie-06-fundme && rm -rf .git

mkdir brownie_fundme
cd
code .
brownie init
#create FundMe.sol #copy from prior
brownie run scripts/deploy.py
brownie networks list

brownie run scripts/dep loy.py --network ganache-local
brownie run scripts/fund_and_withdraw.py --network ganache-local
brownie test --network ganache-local #fails

```

## brownie-07-smartcontract-lottery

git clone https://github.com/PatrickAlphaC/smartcontract-lottery.git brownie-07-smartcontract-lottery

cd brownie-07-smartcontract-lottery

brownie run scripts/deploy_lottery --network ganache-local
brownie test

## brownie-08-brownie-mix

https://github.com/brownie-mix

## brownie-09-erc20

```bash
git clone https://github.com/PatrickAlphaC/erc20-brownie.git brownie-09-erc20 && cd brownie-09-erc20 && rm -rf .git

npm install -g ganache-cli
pip install --user pipx
pipx ensurepath
# restart your terminal
pipx install eth-brownie

sudo apt install python3-venv
python3 -m venv venv
source venv/bin/activate
pip install eth-brownie
brownie --version

brownie run scripts/1_deploy_token.sol
brownie run scripts/2_deploy_easy_token.sol

```

# JS

https://github.com/smartcontractkit/full-blockchain-solidity-course-js

VRFv2SubscriptionManager is VRFConsumerBaseV2

```
prettier yarn package
yarn add --dev prettier prettier-plugin-solidity
yarn cache clean
```

## js-05-ethers-simple-storage

Usually languages are synchronous
javascript is asynchronous
const means can't be changed
await waits for promise to be resolved

```javascript
const sendValue = ethers.utils.parseEther("1");
```

### yarn

sudo apt update
sudo apt install curl git
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

npm = yarn
npx = yautils.parseEther("1000000").toString(),rn

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 16
nvm use 16
nvm alias default 18
nvm uninstall 14
node -v

sudo apt remove nodejs
sudo apt update && sudo apt install nodejs

nvm install 22
nvm use 22
nvm alias default 22
npm install npm --global # Upgrade npm to the latest version

mkdir hardhat-tutorial
cd hardhat-tutorial

get yarn (npm install -g yarn)
corepack --version
corepack enable
yarn --version

npm install --save-dev hardhat
yarn add hardhat

yarn hardhat init

npm i -g yarn (outdated)

compiler solc-js
yarn solcjs --help
yarn solcjs --version
yarn add solc
package.json
yarn.lock

npm install --save-dev @nomicfoundation/hardhat-toolbox
yarn add --dev @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-ignition @nomicfoundation/hardhat-ignition-ethers @nomicfoundation/hardhat-network-helpers @nomicfoundation/hardhat-chai-matchers @nomicfoundation/hardhat-ethers @nomicfoundation/hardhat-verify chai@4 ethers hardhat-gas-reporter solidity-coverage @typechain/hardhat typechain @typechain/ethers-v6

node_modules/

//yarn solcjs --bin --abi --include-path node_modules --base-path . -o SimpleStorage.sol
//in scripts of package.json

### Ethers

https://docs.ethers.org/v6/
javascript tooling kit to interact with blockchain. Also Web3js
yarn install ethers

```javascript
//callstatic callStatic is used in JavaScript (e.g., in ethers.js) to simulate a transaction and see the result without actually sending a transaction to the blockchain. In Solidity, function calls are handled natively, and if you want to call a function that doesn’t change state, you just call it directly.
 describe("createExchange", () => {
    it("deploys an exchange", async () => {
      const exchangeAddress = await factory.callStatic.createExchange(
        token.address
      );


```

### Hardhat

```
yarn global add hardhat-shorthand
yarn hardhat -> hh
yarn hardhat run scripts/deploy.js –network hardhat
hh run scripts/deploy.js –network hardhat

```

### JS

e.message.toLowerCase().includes("already verified")

## js-06-hardhat-simple-storage

http://hardhat.org/tutorial

dev dependencies only to develop
yarn add --dev hardhat
yarn hardhat

yarn hardhat acccounts
yarn hardhat compile
cache\
 artifacts\
yarn hardhat node
yarn hardhat
yarn hardhat test
yarn hardhat test --grep "amount funded"

### verify

yarn add --dev @nomiclabs/hardhat-etherscan
then to hardhat.config.js add
// require("@nomiclabs/hardhat-etherscan")
require("@nomicfoundation/hardhat-verify")

const { run } = require("hardhat")

```javascript
// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(e);
    }
  }
};
```

if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY)
await verify(simpleStorage.target, [])

## js-07-hardhat-fund-me (with price converter)

git clone https://github.com/PatrickAlphaC/hardhat-fund-me-fcc

fcc-7-hardhat-fund-me

yarn solhint contracts/\*.sol

yarn add @chainlink/contracts

helper-hardhat-config.js //network dependency

yarn hardhat coverage

await deployments.fixture(["all"]) //hardhat-deploy
fundme = await ethers.getContract("Fundme") //recently deployed

## js-10-nextjs-smartcontract-lottery-fcc

postcss language support vscode extension
Tailwind CSS IntelliSense

React/NextJS

git clone add https://github.com/PatrickAlphaC/nextjs-smartcontract-lottery-fcc.git nextjs-smartcontract-lottery-fcc

copy yarn.lock, package.json as Patrick

http://netxjs.org/

Components: export default function

styles

yarn dev opens http://localhost:3000/

yarn add moralis react-moralis

hooks for re-render based on state. Enableweb3 = usemoralis()

```javascript
const { enableWeb3 } = useMoralis();
```

yarn add web3uikit is easier

## js-11-hardhat-start-kit

https://github.com/smartcontractkit/hardhat-starter-kit/

```

git clone https://github.com/smartcontractkit/hardhat-starter-kit/ js-11-hardhat-starter-kit && cd js-11-hardhat-starter-kit && rm -rf .git && yarn
yarn
yarn global hardhat-shorthand

hh run scripts/readPrice.js
yarn test


```

## js-12-erc20

## js-13-defi

git clone https://github.com/PatrickAlphaC/hardhat-defi-fcc js-13-defi

mainnet forking

```javascript
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || process.env.ALCHEMY_MAINNET_RPC_URL || ""
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            forking: {
                url: MAINNET_RPC_URL,
            },
        },
```

health factor <1 liquidate. bots are incentivized to liquidate you.

## js-14-hardhat-nft-fcc

openzeppelin erc-721

NFT has tokeID & tokenURI (url with vsual)

1. name
1. description
1. image
1. attributes

contracts/sublesson/encoding

call was used to send money, but without data in (), only {value: address(this).balance}("")
staticcall: view/pure. don't change blockchain

- contract deployment
- function call
- The "function selector" is the first 4 bytes of the function signature.
- The "function signature" is a string that defines the function name & parameters.

read deconstructing solidiny from openzeppelin

## js-15-nft-marketplace

https://github.com/smartcontractkit/full-blockchain-solidity-course-js?tab=readme-ov-file#lesson-15-nextjs-nft-marketplace-if-you-finish-this-lesson-you-are-a-full-stack-monster

git clone https://github.com/PatrickAlphaC/hardhat-nft-marketplace-fcc.git js-15-hardhat-nft-marketplace-a-backend

git clone https://github.com/PatrickAlphaC/nextjs-nft-marketplace-moralis-fcc.git js-15-hardhat-nft-marketplace-b-moralis

git clone https://github.com/PatrickAlphaC/graph-nft-marketplace-fcc.git
js-15-hardhat-nft-marketplace-c-thegraph

git clone https://github.com/PatrickAlphaC/nextjs-nft-marketplace-thegraph-fcc.git js-15-hardhat-nft-marketplace-d-thegraph-frontend

### backend

```cmd
yarn init
yarn add --dev hardhat
yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai ethereum-waffle hardhat hardhat-contract-sizer hardhat-deploy hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage dotenv
yarn create next-app

nvm use 18
yarn
deploy to sepolia
  nftmarketplacce
customchains

mint_and_list

```

add .prettierignore, .prettierrc, .solhint.json, .solhintignore, hardhat.config.js, .env, utils/

https://github.com/smartcontractkit/hardhat-starter-kit/issues/140 custom chains error

NftMarketplace
0x35037C1ff4f5e1CCc2B5d5acbC245b4f3C8a66a3
https://sepolia.etherscan.io/address/0x35037C1ff4f5e1CCc2B5d5acbC245b4f3C8a66a3

### thegraph

https://marketplace.visualstudio.com/items?itemName=sswatson.terminal-send

https://thegraph.com/
orsenkucher.vscode-graphql

```bashrc
yarn global add @graphprotocol/graph-cli
export PATH="$PATH:$(yarn global bin)"
source ~/.bashrc  # or source ~/.zshrc
graph --version

graph init --studio nft-marketplace --from-contract=0x35037C1ff4f5e1CCc2B5d5acbC245b4f3C8a66a3 --network sepolia
#first block: 6693674
cd nft-marketplace
graph codegen
graph build
graph deploy --studio nft-marketplace


Build completed: Qme2LcwS4dw6u7L8qCT54U4sVLVFtc8iqJF1u74QkBTFfE

Deployed to https://thegraph.com/studio/subgraph/nft-marketplace

Subgraph endpoints:
Queries (HTTP):     https://api.studio.thegraph.com/query/89066/nft-marketplace/v0.0.4
  also in playground of thegraph.com/studio/subgraph/nft-marketplace

```

schema.graphql defines entities in contract (tables) +
activeitem

graph codegen puts from schema to generated/ so run codegen after updating schema.graphql

src/mapping.ts how to store events. imports from generated/

### theraph ui

yarn add @appollo/client graphql //queries to graphql

```bashrc
npx browserslist@latest --update-db
yarn dev
```

# Foundry

https://github.com/Cyfrin/foundry-full-course-cu?tab=readme-ov-file

https://www.infura.io/faucet/sepolia great for ETH
https://faucets.chain.link/ good for LINK

extensions
solidity hardhat
better toml

settings json:
"[solidity]": {
"editor.defaultFormatter": "NomicFoundation.hardhat-solidity"
},

"[javascript]": {
"editor.defaultFormatter": "esbenp.prettier-vscode"
},

//through settings non-json
"editor.formatOnSave": true

## foundry-06-simple-storage

```


forge create SimpleStorage --private-key <PRIVATE_KEY> --rpc-url <ALCHEMY_URL>
```

## Foundry-07-fundme

```
git clone https://github.com/Cyfrin/foundry-fund-me-cu.git foundry-07-fundme && cd foundry-07-fundme && rm -rf .git

make


forge script script/DeployFundMe.s.sol
forge test
```

### Tools (forge/anvil/chisel)

1. forge: like hardhat
2. anvil: like hardhat node, or ganache
3. chisel: like hardhat console; solidity in terminal

#### forge

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
foundryup
forge --version
forge init
make all

--no-commit: install without trying to initialize a new Git repository

forge init --no-commit
#without attempting to initialize or commit a new Git repository

forge install
forge install --no-git --no-commit
forge install Cyfrin/foundry-devops --no-commit
forge install foundary/devlops
forge install transmissions11/solmate
forge remppings
forge install foundry-rs/forge-std --no-commit
forge install cyfrin/foundry-devops@0.2.2 --no-commit && forge install foundry-rs/forge-std@v1.8.2 --no-commit

forge coverage
forge coverage --fork-url $SEPOLIA_RPC_URL
forge test
forge test --match-test --v
forge test --match-test --vv
forge test --match-test --vvv
forge test --match-test --vvvv
forge test --fork-url $SEPOLIA_RPC_URL
forge test --debug "func()" #bytecode walker

forge install transmissions11/soulmate
remappings = ['@chainlink/contracts/=lib/chainlink-brownie-contracts/contracts/', '@solmate=lib/solmate/src/']

```

#### git submodule update

```bash
yarn install
git submodule update --init --recursive
#init means include older ucommited changes to submodules.  initialize if submodule has been initialized, fetch changes, reinitialize deleted submodules
git submodule update --init --recursive
git submodule update --init --recursive --no-fetch #don't do both
#--no-fetch: don't get latest updates, but do check for uncommited changes.
# init means download all changes
# no fetch means check for changes only to upload
git submodule update --init --recursive --depth 1
# check .gitmodules in root of git

```

#### gas

forge snapshot --match-test dfdfs

#### chiesel (solidity in terminal)

!help
unit256 catANdThree = cat + 3;
catAndThree gives 4
ctrlC2x to dexit
https://book.getfoundry.sh/reference/chisel/?highlight=chisel#chisel

Expressions
address(0).balance
abi.encode(256, bytes32(0), "Chisel!")
myViewFunc(128)

Statements
uint256 a = 0xa57b

#### other

cast --to-base 0x01 dec
cast sig "createSubscription()" //should match metamask ensuring UI isn't malicious
http://openchain.xyz/signatures
cast --from-wei 998976618347425280

### make

Makefile
-include .env
build:; forge build
make build

```bash
NETWORK_ARGS := --rpc-url http://localhost:8545 --private-key $(DEFAULT_ANVIL_KEY) --broadcast

ifeq ($(findstring --network sepolia,$(ARGS)),--network sepolia)
	NETWORK_ARGS := --rpc-url $(SEPOLIA_RPC_URL) --account $(ACCOUNT) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) -vvvv
endif

deploy-sepolia:
	@forge script script/DeployFundMe.s.sol:DeployFundMe $(NETWORK_ARGS)
```

make deploy-spolia

### gas

Anvil gas defaults to 0

to simulate gas use vm.txGasPrice(GAS_PRICE)

```solidity
// vm.txGasPrice(GAS_PRICE);
// uint256 gasStart = gasleft();
// // Act
vm.startPrank(fundMe.getOwner());
fundMe.withdraw();
vm.stopPrank();
// uint256 gasEnd = gasleft();
// uint256 gasUsed = (gasStart - gasEnd) \* tx.gasprice;
console.log(gasused)

vm.prank(PLAYER);
raffle.enterRaffle{value: raffleEntranceFee}();
vm.warp(block.timestamp + automationUpdateInterval + 1);
vm.roll(block.number + 1);
```

or

gas reports: https://book.getfoundry.sh/forge/gas-reports
forge snapshot
produces .gas-snapshot

private more gas efficient. View getter functions.

#### Gas optimization/storage

storage: giant list of 32 byte long slots.
blank for mappings, length for array
constants/immutable don't take slot
immutable i\_; storage s\_
local in memory.
strings are dynamically sized array. solidity needs to know whether to allocate space.

funWithStorage: script/DeployStorageFun.s.sol

forge inspect FundMe storageLayout

or

forge script script/DeployFundMe.s.sol --rpc-url http:/127.0.0.1:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
(contract address: 0x5FbDB2315678afecb367f032d93F642f64180aa3)
cast storage 0x5FbDB2315678afecb367f032d93F642f64180aa3 2
(gives the owner public key 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266)
cast -h
https://book.getfoundry.sh/reference/cast/cast
cast --to-int256 "0x0000000000000000000000000000000000000000000000000000000066b7995a"

opcodes http://evm.codes/ storage expensive

### address

uint160

### cheats

https://book.getfoundry.sh/forge/cheatcodes
forge test

1. vm.prank: create address
2. vm.deal(PLAYER, STARTING_USER_BALANCE): fund address vm.deal(USER, STARTING_USER_BALANCE);
3. vm.hoax: pank and fund
4. address public PLAYER = makeAddr("player");
5. vm.startPrank(msg.sender);
6. vm.expectRevert(Raffle.Raffle\_\_SendMoreToEnterRaffle.selector); //function selector
   1. .to.be.revertedWith
7. vm.stopPrank();
8. vm.prank(PLAYER);
9. vm.expectEmit(true, false, false, false, address(raffle));
10. vm.warp(block.timestamp + automationUpdateInterval + 1);
11. vm.roll(block.number + 1);
12. vm.startBroadcast(account);
13. vm.stopBroadcast();

14.

### tests

setUp

1. unit
2. intergation tests: interactions

arrange/act/assert

Interactions
FundFundMe is Script
foundry-devops to get last address.
forge install Cyfrin/foundry-devops --no-commit
git rm -rf lib/forge-std
rm -rf lib/forge-
forge install foundry-rs/forge-std@v1.8.2 --no-commit
import {DevOpsTools} from "foundry-devops/src/DevOpsTools.sol";
ffi = true //in toml. lets foundry run commands

forge script script/Interactions.s.sol:FundFundMe --rpc-url http://127.0.0.1:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

make

```bash
vm.expectRevert(
            abi.encodeWithSelector(Raffle.Raffle__UpkeepNotNeeded.selector, currentBalance, numPlayers, rState)
        );
```

```javascript
it("reverts if checkup is false", async () => {
   await expect(raffle.performUpkeep("0x")).to.be.revertedWith(
       "Raffle__UpkeepNotNeeded"
   )
})

await expect(
     nftMarketplace.listItem(basicNft.address, TOKEN_ID, ZERO_PRICE)
 ).revertedWithCustomError(nftMarketplace, "NftMarketplace__PriceMustBeAboveZero")
        })
```

```javascript
await exchange
  .connect(user)
  .ethToTokenTransfer(toWei(1.97), user.address, { value: toWei(1) });

vm.prank(msg.sender);
ourToken.transfer(bob, BOB_STARTING_AMOUNT);
```

### etc

```bash
forge test --match-test testPriceFeedSetCorrectly
forge test --match-test testPriceFeedSetCorrectly -vvv
forge test --match-test testPriceFeedSetCorrectly -vvv --fork-url $SEPOLIA_RPC_URL
forge test --match-path pathToFIle
hh test test/exchange.test.js

forge coverage --fork-url $SEPOLIA_RPC_URL
https://book.getfoundry.sh/forge/cheatcodes
vm.expectRevert(); //next line revert
fundMe.fund();
private more gas efficient. use getters.
prank code sets message.sender only in test
startprank/stopprank includes start/stop broadcast
standard cheat: book.getfoundry.sh/reference/forge-std/hoax
hoax(address(i), STARTING_USER_BALANCE); //FundMeTest.t.sol
startPrank/stopPrank like broadcast

```

readme
quick start
use templtes

## Foundry-08-html-fund-me

git clone https://github.com/Cyfrin/html-fund-me-cu foundry-08-fundme-html
cd foundry-08-fundme-html; rm -rf .git

install live server

right click > inpect(Q) > console
window
window.ethereum

## Foundry-09-raffle

git clone https://github.com/Cyfrin/foundry-smart-contract-lottery-cu foundry-09-smartcontract-lottery
cd

### VRF

https://docs.chain.link/vrf/v2/subscription/examples/get-a-random-number

1. Create a subscription in subscription manager
2. Fund with LINK
3. Consumer address?
4. Deploy VRF2 compotible contract (has ConsumerBase, subscriptionID, keyhash, gaslane, callbackgaslimit for callback function, blockconfirmation speed v. secure, words)
5. add consumer address

https://docs.chain.link/vrf/v2-5/subscription/get-a-random-number

override: virtual in inheritence. VRFConsumerBaseV2
function fulfillRandomWords(uint256,uint256[] calldata randomWords
) internal override
VRFConsumerBaseV2 takes coordinator

### Keeper

https://automation.chain.link/
https://chrontab.guru human readable output from chron tabs

### tests

CEI: Checks, Effects, Interactions
//checks: requires. more gas efficient to revert early
//effect our own contract
//interactions: external with other contracts. (avoid reentrancy attacks)
put events before interactions.

arrange/act/assert

local
forked testnet
testnet

vm.startBroadcast(); //actually deploy

### subscription

forge script script/Interactions.s.sol:FundSubscription --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast

forge install foundary/devlops
DevOpstTools.get_most_recent_deployment

https://vrf.chain.link/sepolia/12063 VRF Coordinator V2

https://sepolia.etherscan.io/address/0x8103b0a8a00be2ddc778e6e7eaa21791cd364625 VRF

https://sepolia.etherscan.io/address/0x35c6BAc0B834756670C5bcAAF36a1f2958c87efB Raffle

https://automation.chain.link/sepolia/46503602413155825590236000896645636080533299372637975538543387700694086199540 keeper

## Foundry-10-erc20

```

git clone https://github.com/Cyfrin/foundry-erc20-cu.git foundry-10-erc20 && cd foundry-10-erc20 && rm -rf .git

```

# oleg basic (rewrite zuniswap)

## oleg-basic zuniswap1 hardhat

```js
toWei(100) = 100e18 = ethers.utils.parseEther(100.toString())
fromWei(100e18) = 100 = ethers.utils.formatEther(100e18)
```

## zuniswap1 foundry

because errors in hardhat are useless

```bash
# make sure foundry-10-erc20 runs
# make all pulls in higher level submodules in /node_modules
# update:; forge update --root $(shell pwd) doesn't help
# try
git submodule update --init --recursive
# works
mkdir oleg-basic-foundry && cd oleg-basic-foundry
foundryup
forge init
forge build
forge test
forge install transmissions11/solmate
forge remappings #infer dependencies!
forge remove solmate
<!-- Forge also supports Hardhat-style projects where dependencies are npm packages (stored in node_modules) and contracts are stored in contracts as opposed to src. To enable Hardhat compatibility mode pass the --hh flag.-->
#steal contracts, tests
cp ../oleg-basics/contracts/* src
cp ../foundry-10-erc20/test/* test
#deploy script
cp ../foundry-10-erc20/script/DeployOurToken.s.sol ./script/
        # vm.startBroadcast();
        # OurToken ourToken = new OurToken(INITIAL_SUPPLY);
        # vm.stopBroadcast();
cp ../foundry-10-erc20/Makefile ./
make all #test the oleg-basics Token
# it works.  so token ok. now test exchange
cp ../zuniswap/zuniswap/test/Exchange.test.js ./test/
#doesn't work because my Exchange.sol doesn't do everything
#but looking at zuniswap's exchange test i see the problem

# now try to add forge
https://book.getfoundry.sh/projects/working-on-an-existing-project
forge install --no-git --no-commit
forge build


```

You can also set remappings in foundry.toml.

remappings = [
"@solmate-utils/=lib/solmate/src/utils/",
]

Now we can import any of the contracts in src/utils of the solmate repository like so:

import {LibString} from "@solmate-utils/LibString.sol";

```bash
cp ../foundry-10-erc20/foundry.toml ./
forge install <github project>
forge install transmissions11/soulmate
forge soldeer install @openzeppelin-contracts~5.0.2

#looks ok, write a sol test
cp ../foundry-10-erc20/test/OurTokenTest.t.sol ./test/
cp ../foundry-10-erc20/script/DeployOurToken.s.sol ./deploy/
forge test --hh
forge remppings
forge install foundry-rs/forge-std --no-commit
forge install cyfrin/foundry-devops@0.2.2 --no-commit && forge install foundry-rs/forge-std@v1.8.2 --no-commit
```

### zuniswap contract

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

### week 3

- Factory
  - createExchange, getExchange
  - token to token swaps

## Zuniswap2

### week 1

- Core
  - UniswapV2ERC20
  - UniswapV2Factory
  - UniswapV2Pair
- Periphery
  - UniswapV2Router
  - UniswapV2Library
- Pooling L

$Liquidity_{minted}=\sqrt{Amount_{0} * Amount_{1}}$\
$Liquidity_{minted}=TotalSupply_{LP} * Amount_{deposited}/Reserve$\
e.g. 200 token 100 eth, deposit 100 eth \
100 \* 100/100 = 100 LP minted

Remove liquidity \
$Amount_{deposited} = Reserve * Balance_{LP}/TotalSupply_{LP}$

Tests

### Week 2

- Token swapping
- provides actual e
- transfer, transferFrom
- reentrancy attacks
- price oracle: y/x. TWAP. Store accumulated prices
- storage optimization
- overflow
- safe transfer

### Week 3

- Factory Contract
- Contract deploy via CREATE2 opcode (gnerate new address deterministically!)
  - bytecode + salt
- Router Contract (UI)
- Library Contract

### Week 4

## V3

```bash
cd uniswapv3-code
forge test

```

```bash

mkdir uniswapv3-code
cd uniswapv3-code
forge init --vscode
#initialize regardless
forge init --vscode --force
rm src/Counter.sol test/Counter.t.sol
forge install foundry-rs/forge-std --no-commit

npx create-react-app ui

forge test
# using A for B is a feature of Solidity that lets you extend type B with functions from library contract A
#solidity documentation https://docs.soliditylang.org/en/latest/

#We’ll use the ERC20 contract from Solmate, a collection of gas-optimized contracts, and make an ERC20 contract that inherits from the Solmate contract and exposes minting (it’s public by default).
forge install rari-capital/solmate

# Create src/UniswapV3Pool.sol:
# pragma solidity ^0.8.14;
# contract UniswapV3Pool {}

```

```bash


#if not working check git status
#if untrackec content, do
git submodule update --init --recursive
git submodule update --remote
git submodule update --remote --merge
git submodule foreach git pull origin main
git status
git add .; git status
git branch -r
git conf ig -f .gitmodules submodule.foundry-10-erc20/lib/openzeppelin-contracts.branch master
git checkout master #WORKED

forge init --vscode --no-commit  #worked
#This command will create the necessary Foundry project files without trying to initialize a new Git repository.

```

1. UniswapV3Pool the core pool contract that implements liquidity management and swapping
2. UniswapV3Factory the registry contract that deploys new pools and keeps a record of all deployed pools.
3. UniswapV3Manager–a periphery contract that makes it easier to interact with the pool contract. This is a very simplified implementation of SwapRouter
4. UniswapV3Quoter is a cool contract that allows calculating swap prices on-chain. This is a minimal copy of both Quoter and QuoterV2. Again, only “exact input” swaps are supported.
5. UniswapV3NFTManager allows turning liquidity positions into NFTs. This is a simplified implementation of NonfungiblePositionManager
6. Front-end Application

### Calculating Liquidity

### Pool contract

```bash
touch src/UniswapV3Pool.sol
mkdir src/lib
touch src/lib/Tick.sol
touch src/lib/Position.sol
cast --from-wei 998976618347425280
import "../src/test.sol";
import "./lib/Tick.sol";
forge install foundry-rs/forge-std --no-commit
forge remappings
cat foundry.toml
touch ./test/UniswapV3Pool.t.sol

```

# Medium Uniswap

- Index.js

  - init

    - defi_array_of_objects = await get_all_defi_liquidty_pools(1);
    - path_and_loan_pools = [];
    - possible_profitable_paths = produce_simple_exchange_paths(defi_array_of_objects);

      - [pairUUID, poolAddresses, poolInfo] = get_multiple_objects_for_mapping(exchangeObject);

      ```
        for (const pair of exchangeObject) //pair = {token1=USD,token2=XRP, id=4343]
        pairUUID[XRP] = USD; pairUUID[USD] = XRP
        poolAddresses[USD-XRP] = poolAddresses[XRP-USD] = 4343
        poolInfo[4343] = pair;
      ```

      - {graph, poolAddress} = build_adjacency_list(poolAddress, pairSymbols);

      ```
        const vertArr = [];
      ```

      - tree = get_tree(graph);
      - cycles = get_all_cycles(graph, tree);
      - for (const cycle of cycles)
        - const keys = build_base_to_quote_keys(cycle, poolAddress);
        - path_keys_and_ids.push({ keys: keys, token_ids: cycle });
      - for (const path of path_keys_and_ids)
        - const path_with_liqudity_pool_info = formatted_path_information(path, poolInfo);
        - simple_paths.push(...path_with_liqudity_pool_info);

    - proftiable_opportunities_intial_check = check_all_structured_paths(possible_profitable_paths);
    - loan_pools = await determine_loan_pools_of_path(token_ids,pool_addresses);
      - path_and_loan_pools.push({ path: path, loan_pools: loan_pools });

# Speedrun

```bash
# https://speedrunethereum.com/challenge/simple-nft-example
npx create-eth@0.1.0 -e challenge-0-simple-nft
challenge-0-simple-nft
cd speedrun/challenge-0-simple-nft
yarn chain
#second terminal
yarn deploy
#in a third terminal window, start your 📱 frontend:
yarn start
#disconnect metamask, use burner wallet

#mint in gui

#deploy
yarn generate
#Encrypted Private Key saved to packages/hardhat/.env file
#01563297374349fc3b71796ad69909d0b026e910
yarn account:import
yarn account
yarn deploy --network sepolia
# reusing "YourCollectible" at 0x913a11F3Fd96402ffd26950c0674928a45C307E9
# 📝 Updated TypeScript contract definition file on ../nextjs/contracts/deployedContracts.ts
#  https://sepolia.etherscan.io/address/0x913a11F3Fd96402ffd26950c0674928a45C307E9

#ship frontend
yarn vercel:login
yarn vercel
#speedrun/challenge-0=simple-nfts/packages/hardhat/.env
# ALCHEMY_API_KEY=ZnCEzSyp9ichJgoz7NJH0ZKkr9mspFQM
# ETHERSCAN_MAINNET_API_KEY=M6A22IGYF2JXDPVUKJN44S2RZA7IEAFP7N
yarn verify --network sepolia


```
