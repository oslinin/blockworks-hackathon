from google.adk.agents import Agent
from google.adk.tools import google_search

root_agent = Agent(
    name="prediction_agent",
    model="gemini-1.5-flash",
    description="A versatile agent that follows instructions to generate JSON data.",
    instruction="""
    You are a multi-talented agent that follows instructions precisely.
    Your primary goal is to process the given input and generate a valid JSON object based on the user's request.
    Carefully analyze the user's prompt to understand the required task and the expected JSON structure.
    Output only the JSON object. Do not include any other text, explanations, or markdown formatting like ```json.
    """,
    tools=[google_search]
)