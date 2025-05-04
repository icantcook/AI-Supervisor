from livekit.agents import function_tool, RunContext
from contexts.data_context import DataContext


@function_tool()
async def escalate(
    context: RunContext,
    question: str,
    ) -> dict:
    """Escalate the call when agent is unable to answer.
    
    Args:
       question : The question raised by the user.
    """

    print("Escalating call...")
    ctx= DataContext()
    ctx.create_help_request(question)

    # TODO: Add a timeout function to get user contact details if there's no update in a stipulated amt of time

    return {"escalation": "I've escalated the call. A representative will be with you shortly."}