#!/bin/bash

# --- Base directory ---
BASE_DIR="/home/oleg/Documents/blockworks-hackathon"

# --- Subdirectories ---
PREDICTION_MARKET="$BASE_DIR/prediction-market"
NODEJS_DIR="$BASE_DIR/prediction-market-nodejs"
AGENT_DIR="$BASE_DIR/prediction-agent-nodejs/prediction-agent-py"

# --- Commands ---
CMD_PROJECTS="hh node"
CMD_DOCS="yarn dev"
CMD_GEMINI="gemini -y"
CMD_AGENT="source venv/bin/activate && python main.py"

# --- Start in main blockworks-hackathon folder ---
#cd "$BASE_DIR"

# --- Mate-terminal with 4 tabs that persist even if closed with Ctrl-C ---
mate-terminal \
  --tab --title="Projects" --working-directory="$PREDICTION_MARKET" \
      -e "bash -c 'cd $PREDICTION_MARKET && trap : INT; $CMD_PROJECTS; exec bash'" \
  --tab --title="Docs" --working-directory="$NODEJS_DIR" \
      -e "bash -c 'cd $NODEJS_DIR && trap : INT; $CMD_DOCS; exec bash'" \
  --tab --title="Gemini" --working-directory="$BASE_DIR" \
      -e "bash -c 'cd $BASE_DIR && trap : INT; $CMD_GEMINI; exec bash'" \
  --tab --title="Agent" --working-directory="$AGENT_DIR" \
      -e "bash -c 'cd $AGENT_DIR && trap : INT; $CMD_AGENT; exec bash'" &

# --- Only open Kate if not already running ---
if ! pgrep -x "kate" > /dev/null; then
    kate "$BASE_DIR" &
fi

# --- Only open Firefox if not already running ---
if ! pgrep -x "firefox" > /dev/null; then
    firefox https://chatgpt.com &
fi

