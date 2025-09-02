import asyncio
import uuid

from dotenv import load_dotenv
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from prediction_agent.agent import root_agent
import datetime

load_dotenv()  # env vars in root level now


async def main():
    # db, memory, vertex? memory
    # Create a new session service to store state
    session_service_stateful = InMemorySessionService()

    # disctionary
    initial_state = {
        "user_name": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "category": "election",
        "today": datetime.date.today().strftime("%Y-%m-%d"),
        "categories": """
            ELECTION
            SPORTS
            CRYPTO
            TV
        """
    }

    # Create a NEW session
    APP_NAME = "Make Bet"
    USER_ID = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    SESSION_ID = str(uuid.uuid4())  # unique id
    stateful_session = await session_service_stateful.create_session(
        app_name=APP_NAME,
        user_id=USER_ID,
        session_id=SESSION_ID,
        state=initial_state,
    )
    print("CREATED NEW SESSION:")
    print(f"\tSession ID: {SESSION_ID}")

    # agent, session
    runner = Runner(
        agent=root_agent,
        app_name=APP_NAME,
        session_service=session_service_stateful,
    )

    new_message = types.Content(
        role="user",
        parts=[types.Part(text="Generate Bet")]
    )

    for event in runner.run(
        user_id=USER_ID,
        session_id=SESSION_ID,
        new_message=new_message,
    ):
        if event.is_final_response():
            if event.content and event.content.parts:
                print(f"Final Response: {event.content.parts[0].text}")

    print("==== Session Event Exploration ====")
    session = await session_service_stateful.get_session(
        app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
    )

    # Log final Session state
    print("=== Final Session State ===")
    for key, value in session.state.items():
        print(f"{key}: {value}")


if __name__ == "__main__":
    asyncio.run(main())
