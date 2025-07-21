# git

git config --global user.email "oleg.slinin@gmail.com"
git config --global user.name "Oleg Slinin"
git init -b main
git remote remove origin
git remote add origin https://github.com/oslinin/blockworks-hackathon
git stash
git checkout cpmm-test-rewrite\
git stash pop

git fetch origin
git reset --hard origin/prediction-market-tests
git pull origin prediction-market-tests
git ls-tree -r --long HEAD | sort -rh -k 4 | head -n 20

git rm -f -r --cached .
git add .
git status
git commit -m "pure cli commit"
git remote -v
git push
git push --no-verify -u origin prediction-market-tests
git push -u origin prediction-market-tests

git push --set-upstream origin prediction-market-tests

## ignore

artifacts/
cache/
.cache/
deployments/
typechain-types/
ignition/
.npm/
.codeoss/
.bash_history
.local/

# gemini

npm install -g @google/gemini-cli
gemini --yolo
gemini --yolo --session=my-persistent-session
gemini chat --session=my-persistent-session
gemini chat --session=my-persistent-session --yolo
implements prompts.md
## shell.cloud.google.com

npx https://github.com/google-gemini/gemini-cli
gemini

# web3

https://github.com/smartcontractkit/full-blockchain-solidity-course-js

## wallet ethworks

https://medium.com/better-programming/everything-you-need-to-know-about-fullstack-web3-94c0f1b18019

# backend

```bash
cd prediction-market
yarn add hardhat
yarn hardhat init
yarn add prettier
yarn add --dev @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-ignition @nomicfoundation/hardhat-ignition-ethers @nomicfoundation/hardhat-network-helpers @nomicfoundation/hardhat-chai-matchers @nomicfoundation/hardhat-ethers @nomicfoundation/hardhat-verify chai@4 ethers hardhat-gas-reporter solidity-coverage @typechain/hardhat typechain @typechain/ethers-v6
npm install --save-dev "@nomicfoundation/hardhat-ignition-ethers@^0.15.0" "@types/mocha@>=9.1.0" "ts-node@>=8.0.0" "typescript@>=4.5.0"

yarn install
yarn hardhat node
yarn hardhat run scripts/deployFactory.js --network localhost
```

# frontend

```bash
cd frontend-proj
yarn create next-app .
yarn dev
```

# python
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

