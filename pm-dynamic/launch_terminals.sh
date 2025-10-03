#!/bin/bash
set -Eeuo pipefail

DIR="/home/oleg/Documents/blockworks-hackathon/pm-dynamic"

# Debian: ensure xfce4-terminal exists
if ! command -v xfce4-terminal >/dev/null 2>&1; then
  sudo apt-get update -y
  sudo apt-get install -y xfce4-terminal
fi

# Tool paths
FOUNDry="$HOME/.foundry/bin"
RINDEXER="$HOME/.rindexer/bin"

# PATH for tools inside each tab
ENV_EXPORT="export PATH=$FOUNDry:$RINDEXER:\$PATH"

# Wait for Anvil before dependent tabs
WAIT_FOR_RPC='until (exec 3<>/dev/tcp/127.0.0.1/8545) 2>/dev/null; do sleep 0.3; done'
BROWSER="firefox-esr"
FRONTEND_URL="http://localhost:3000"
RINDEXER_URL="http://localhost:3001/playground"
xfce4-terminal \
  --tab --title="anvil"    --working-directory="$DIR" \
    --command="bash -lc '$ENV_EXPORT; pnpm anvil; exec bash'" \
  --tab --title="deploy"   --working-directory="$DIR/foundry" \
    --command="bash -lc '$ENV_EXPORT; $WAIT_FOR_RPC; make setup; exec bash'" \
  --tab --title="frontend"   --working-directory="$DIR" \
    --command="bash -lc '$ENV_EXPORT; $WAIT_FOR_RPC; pnpm dev; exec bash'" \
  --tab --title="indexer"  --working-directory="$DIR/NftMarketplace" \
    --command="bash -lc '$ENV_EXPORT; $WAIT_FOR_RPC; rindexer start all; exec bash'" \
  --tab --title="firefox" --working-directory="$DIR" \
    --command="bash -lc '$ENV_EXPORT; $BROWSER ---private-window --no-remote -P default \"$FRONTEND_URL\" \"$RINDEXER_URL\" & exec bash'" \