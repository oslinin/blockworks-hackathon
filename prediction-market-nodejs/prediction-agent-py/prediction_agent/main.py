import subprocess
import sys
import os

def main():
    """
    Command-line wrapper to run the prediction_agent using the adk CLI.
    This script executes `adk run . --prompt "<prompt>"` from the agent's directory.
    """
    agent_dir = os.path.dirname(__file__)

    if len(sys.argv) < 2:
        print("Usage: python -m prediction_agent.main <prompt>")
        sys.exit(1)

    prompt = " ".join(sys.argv[1:])

    command = ["adk", "run", ".", "--prompt", prompt]

    try:
        # We run from the agent's directory
        process = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True,
            cwd=agent_dir
        )
        print(process.stdout)
        if process.stderr:
            print("--- Stderr ---")
            print(process.stderr)
    except FileNotFoundError:
        print("Error: 'adk' command not found.")
        print("Please ensure the Google Agent Development Kit is installed and in your PATH.")
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        print(f"Error running agent:")
        print(e.stdout)
        print(e.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
