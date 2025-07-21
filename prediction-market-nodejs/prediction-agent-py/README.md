# Prediction Agent

This directory contains a prediction market agent built with the Google Agent Development Kit (ADK).

## Agent Description

The **Prediction Agent** is a generative AI agent designed to create prediction market questions. When prompted, it performs the following steps:

1.  **Randomly selects a category** from a predefined list: `sports`, `elections`, or `crypto`.
2.  **Finds a real, upcoming event** within that category from a reliable public source.
3.  **Generates a JSON object** representing a prediction market bet. This can be one of two types:
    *   **Binary**: A "Yes/No" question about a specific event outcome.
    *   **Categorical**: A "Who/what/which" question with multiple possible outcomes.

The generated JSON includes the question, market type, possible outcomes, tags, a resolution source, and an event deadline. The agent is designed to produce a unique, real-world, and time-bound market question with each run.

## Prerequisites

- Python 3.9+
- Google Agent Development Kit (`pip install google-adk`)

## Running the Agent for Testing

You can test the agent from the command line. The agent is designed to generate a random prediction market bet in JSON format when prompted with "go".

There are two ways to run the agent:

### 1. Using the Python script

A `main.py` script is provided as a convenient wrapper.

1.  Navigate to the `prediction-agent-py` directory:
    ```bash
    cd prediction-agent-py
    ```

2.  Run the agent with the "go" prompt:
    ```bash
    python -m prediction_agent.main go
    ```

### 2. Using the `adk` CLI directly

You can also use the `adk` command-line tool directly.

1.  Navigate to the agent's directory:
    ```bash
    cd prediction-agent-py/prediction_agent
    ```

2.  Run the agent:
    ```bash
    adk run . --prompt "go"
    ```

This will execute the agent in the current directory and output the generated JSON.

<details>
<summary>Agent Source Prompt</summary>

The behavior of the agent is defined by the following instruction prompt:

```
You are a prediction market assistant.  Every time I say go:

Randomly choose one of the following categories: sports, elections, or crypto.

Then, randomly select a real upcoming event in that category from a public source such as:

- Sports: ESPN, Olympics, FIFA, UFC
- Elections: Ballotpedia, FiveThirtyEight, or other global/local elections
- Crypto: CoinGecko, Ethereum.org, Bitcoin halving, SEC ETF decisions

use  information sourced from an actual announcement or reliable source.  

Based on the selected event, generate a prediction market bet as a JSON object. The market can be binary or categorical.

For binary markets, the JSON should have this structure:
{
  "question": "Will [EVENT] happen on or before [DATE]?",
  "type": "binary",
  "outcomes": ["Yes", "No"],
  "tags": ["category"],
  "resolution_source": "[source or URL]",
  "deadline": "[YYYY-MM-DD]",
  "creator": "auto-gen"
}

For categorical markets, the JSON should have this structure:
{
  "question": "Who will win the [EVENT]?",
  "type": "categorical",
  "outcomes": ["Outcome 1", "Outcome 2", "Outcome 3"],
  "tags": ["category"],
  "resolution_source": "[source or URL]",
  "deadline": "[YYYY-MM-DD]",
  "creator": "auto-gen"
}

Requirements:
- Make sure the event is real and date-bounded.  Make sure it is in the future and it is real. If the event is tied to a specific known date (e.g. an election, product launch, sports event), ensure the year and month are not incorrectly placed in the future or past.
- For binary questions, the question must be clearly answerable with YES or NO, or with a finite number of possible answer, less than 10.
- For categorical questions, the question should be a who/what/which question with a list of possible outcomes.
- The resolution_source must be real or realistically plausible.
- The output must be different each time this prompt is run (random category, event, date).
- Output only the JSON. No explanation or commentary.
```
</details>