#!/bin/bash

# ./pm-dynamic/foundry/script/copy-prediction-market-artifacts.sh

# Exit on error
set -e

# Change to the script's directory's parent (foundry)
cd "$(dirname "$0")"/..

# Define paths relative to the foundry root
BROADCAST_PATH="broadcast/SetupAnvilFixedModel.s.sol/31337/run-latest.json"
ABI_PATH="out/PredictionMarketFactoryFixedModel.sol/PredictionMarketFactoryFixedModel.json"
OUTPUT_DIR="../NftMarketplace/abis"
OUTPUT_FILE="$OUTPUT_DIR/PredictionMarketFactoryFixedModel.json"
RINDEXER_CONFIG="../NftMarketplace/rindexer.yaml"

# Check if jq is installed
if ! command -v jq &> /dev/null
then
    echo "jq could not be found. Please install jq to run this script."
    exit
fi

# Create output directory if it doesn't exist
mkdir -p $OUTPUT_DIR

# Extract contract address from broadcast file
# Note: This assumes the factory is the first contract created in the script.
CONTRACT_ADDRESS=$(jq -r '.transactions[0].contractAddress' $BROADCAST_PATH)

# Update the address in the constants file
sed -i "s/predictionMarketFactory: \"0x[0-9a-fA-F]\{40\}\"/predictionMarketFactory: \"$CONTRACT_ADDRESS\"/g" ../src/constants.ts

# Update the address in the rindexer.yaml file
sed -i "s|address: '0x[0-9a-fA-F]\{40\}'|address: '$CONTRACT_ADDRESS'|g" $RINDEXER_CONFIG

# Extract ABI from artifact file and write to output file
jq '.abi' $ABI_PATH > $OUTPUT_FILE

echo "Successfully copied ABI to $OUTPUT_FILE and updated addresses."

