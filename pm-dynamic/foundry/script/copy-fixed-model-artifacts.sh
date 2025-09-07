#!/bin/bash

# Exit on error
set -e

# Define paths relative to the foundry root
BROADCAST_PATH="broadcast/SetupAnvilFixedModel.s.sol/31337/run-latest.json"
FACTORY_ABI_PATH="out/PredictionMarketFactoryFixedModel.sol/PredictionMarketFactoryFixedModel.json"
USDC_ABI_PATH="out/MockUSDC.sol/MockUSDC.json"
OUTPUT_DIR="../NftMarketplace/abis"
FACTORY_OUTPUT_FILE="$OUTPUT_DIR/PredictionMarketFactoryFixedModel.json"
USDC_OUTPUT_FILE="$OUTPUT_DIR/MockUSDC.json"
RINDEXER_CONFIG="../NftMarketplace/rindexer.yaml"

# Check if jq is installed
if ! command -v jq &> /dev/null
then
    echo "jq could not be found. Please install jq to run this script."
    exit
fi

# Create output directory if it doesn't exist
mkdir -p $OUTPUT_DIR

# Extract contract addresses from broadcast file
USDC_ADDRESS=$(jq -r '.transactions[0].contractAddress' $BROADCAST_PATH)
FACTORY_ADDRESS=$(jq -r '.transactions[1].contractAddress' $BROADCAST_PATH)

# Update the addresses in the constants file
sed -i "s/usdc: \"0x[0-9a-fA-F]\{40\}\"/usdc: \"$USDC_ADDRESS\"/g" ../src/constants.ts
sed -i "s/predictionMarketFactory: \"0x[0-9a-fA-F]\{40\}\"/predictionMarketFactory: \"$FACTORY_ADDRESS\"/g" ../src/constants.ts

# Update the address in the rindexer.yaml file
sed -i "s|address: '0x[0-9a-fA-F] {40}'|address: '$FACTORY_ADDRESS'|g" $RINDEXER_CONFIG

# Extract ABIs from artifact files and write to output files
jq '.abi' $FACTORY_ABI_PATH > $FACTORY_OUTPUT_FILE
jq '.abi' $USDC_ABI_PATH > $USDC_OUTPUT_FILE

echo "Successfully copied artifacts to $OUTPUT_DIR and updated addresses."

