include .env
export

# THIS IS AN ANVIL GLOBALLY KNOWN PRIVATE KEY!!
setup-anvil:
	forge script script/SetupAnvil.s.sol --rpc-url http://127.0.0.1:8545 --private-key ${ANVIL_KEY} --via-ir --broadcast -vvv

setup-anvil-fixed-model:
	forge script script/SetupAnvilFixedModel.s.sol --rpc-url http://127.0.0.1:8545 --private-key ${ANVIL_KEY} --via-ir --broadcast -vvv --chain-id 31337
	./script/copy-fixed-model-artifacts.sh

anvil: 
	anvil --dump-state marketplace-anvil.json

mint-usdc:
	forge script script/MintUSDC.s.sol --rpc-url http://127.0.0.1:8545 --private-key ${ANVIL_KEY} --via-ir --broadcast -vvv

deploy-prediction-market:
	forge script script/DeployPredictionMarketFactory.s.sol --rpc-url http://127.0.0.1:8545 --private-key ${ANVIL_KEY} --via-ir --broadcast -vvv
	./script/copy-prediction-market-artifacts.sh

copy-artifacts:
	./script/copy-prediction-market-artifacts.sh

all: setup-anvil-fixed-model mint-usdc 

all-sepolia: deploy-prediction-market
