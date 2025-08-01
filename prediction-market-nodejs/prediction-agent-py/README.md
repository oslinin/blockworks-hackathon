# YesNo Agent

This directory contains a YesNo agent built with the Google Agent Development Kit (ADK).

## Setup

First, set up the environment from the `prediction-market-nodejs` directory:
```bash
cd .. 
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
mv .env.example .env
```

## Running the Agent

You can run the agent in two ways:

### 1. Run once
This will run the agent once and print a new bet to the console.
```bash
python3 main.py
```

### 2. Run as a service
```bash
adk run prediction_agent
```
Then, type `go` when prompted.

You will need to have a `GEMINI_API_KEY` environment variable set in your `.env` file. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
