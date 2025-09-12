#!/bin/bash

# Exit on error
set -e

# Change to the script's directory's parent (foundry)
cd "$(dirname "$0")"/..

# Define paths relative to the foundry root
BROADCAST_PATH="broadcast/SetupAnvilFixedModel.s.sol/31337/run-latest.json"
FACTORY_ABI_PATH="out/PredictionMarketFactoryFixedModel.sol/PredictionMarketFactoryFixedModel.json"
MARKET_ABI_PATH="out/PredictionMarketFixedModel.sol/PredictionMarketFixedModel.json"
USDC_ABI_PATH="out/MockUSDC.sol/MockUSDC.json"

# Destinations
NEXTJS_CONSTANTS_FILE="../src/constants.ts"
RINDEXER_ABIS_DIR="../NftMarketplace/abis"
RINDEXER_CONFIG="../NftMarketplace/rindexer.yaml"

# Check if jq is installed
if ! command -v jq &> /dev/null
then
    echo "jq could not be found. Please install jq to run this script."
    exit
fi

# Create output directory if it doesn't exist
mkdir -p $RINDEXER_ABIS_DIR

# Extract contract addresses from broadcast file
USDC_ADDRESS=$(jq -r '.transactions[0].contractAddress' $BROADCAST_PATH)
FACTORY_ADDRESS=$(jq -r '.transactions[1].contractAddress' $BROADCAST_PATH)

# Update the addresses in the constants file
sed -i "s/usdc: \"0x[0-9a-fA-F]\{40\}\"/usdc: \"$USDC_ADDRESS\"/g" $NEXTJS_CONSTANTS_FILE
sed -i "s/predictionMarketFactory: \"0x[0-9a-fA-F]\{40\}\"/predictionMarketFactory: \"$FACTORY_ADDRESS\"/g" $NEXTJS_CONSTANTS_FILE

# Update the address in the rindexer.yaml file
# Using yq would be more robust, but for now, sed will do.
sed -i "s|address: '0x[0-9a-fA-F]\{40\}'|address: '$FACTORY_ADDRESS'|g" $RINDEXER_CONFIG

# Create output directory for nextjs abis if it doesn't exist
mkdir -p ../src/abis

# Extract ABIs from artifact files and write to output files
jq '.abi' $FACTORY_ABI_PATH > "$RINDEXER_ABIS_DIR/PredictionMarketFactoryFixedModel.json"
jq '.abi' $MARKET_ABI_PATH > "$RINDEXER_ABIS_DIR/PredictionMarketFixedModel.json"
jq '.abi' $USDC_ABI_PATH > "$RINDEXER_ABIS_DIR/MockUSDC.json"

# Also copy ABIs to the nextjs src directory
cp "$RINDEXER_ABIS_DIR/PredictionMarketFactoryFixedModel.json" ../src/abis/
cp "$RINDEXER_ABIS_DIR/PredictionMarketFixedModel.json" ../src/abis/
cp "$RINDEXER_ABIS_DIR/MockUSDC.json" ../src/abis/


echo "Successfully copied artifacts and updated addresses."
