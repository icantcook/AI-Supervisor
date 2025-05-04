from dotenv import load_dotenv

from livekit import agents
from livekit.agents import AgentSession, Agent,function_tool, RoomInputOptions, RunContext
from livekit.plugins import (
    openai,
    cartesia,
    deepgram,
    noise_cancellation,
    silero,
)
from livekit.plugins.turn_detector.multilingual import MultilingualModel
from contexts.data_context import DataContext, get_instruction_set
from tools.utils.tool_loader import load_tools_from_directory
load_dotenv()



class Assistant(Agent):
    def __init__(self) -> None:

        tools = load_tools_from_directory()
        
      
        data_context = DataContext()
            
        # Get aggregated context
        context_str = data_context.get_knowledge_base_context(['business_details'])
        data_context.close()  

        instructions=get_instruction_set() + " The next instruction set would contain historic user queries and the appropriate responses; you are to reuse them in your responses. " + context_str
        print(instructions)
        super().__init__(
            instructions= instructions,
             tools=tools,
            )


async def entrypoint(ctx: agents.JobContext):
    await ctx.connect()

    session = AgentSession(
        stt=deepgram.STT(model="nova-3", language="multi"),
        llm=openai.LLM(model="gpt-3.5-turbo"),
        tts=cartesia.TTS(),
        vad=silero.VAD.load(),
        turn_detection=MultilingualModel(),
    )


    await session.start(
        room=ctx.room,
        agent=Assistant(),
        room_input_options=RoomInputOptions(
            # LiveKit Cloud enhanced noise cancellation
            # - If self-hosting, omit this parameter
            # - For telephony applications, use `BVCTelephony` for best results
            noise_cancellation=noise_cancellation.BVC(), 
        ),
    )

    await session.generate_reply(
        instructions="Greet the user and offer your assistance."
    )


if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))