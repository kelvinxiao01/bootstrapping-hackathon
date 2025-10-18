from __future__ import annotations

import asyncio
import logging
import os
import sys
import json
from pathlib import Path
from typing import Dict, Any
from dotenv import load_dotenv

# Add the current directory to sys.path for imports
sys.path.append(str(Path(__file__).parent))

from livekit import agents, api, rtc
from livekit.agents import (
    JobContext,
    WorkerOptions,
    AgentSession,
    Agent,
    RunContext,
    function_tool,
    get_job_context,
    cli,
    RoomInputOptions
)
from livekit.plugins import deepgram, openai, cartesia, silero, noise_cancellation


load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("outbound-clinical-trial-agent")

# Clinical trial organization configuration
ORGANIZATION_NAME = os.getenv("ORGANIZATION_NAME", "Clinical Research Associates")
ORGANIZATION_PHONE = os.getenv("ORGANIZATION_PHONE", "+1234567890")
outbound_trunk_id = os.getenv("OUTBOUND_SIP_TRUNK_ID")
twilio_caller_id = os.getenv("TWILIO_CALLER_ID")

OUTBOUND_SYSTEM_INSTRUCTIONS = f"""You are calling potential participants on behalf of {ORGANIZATION_NAME} to discuss a clinical trial opportunity.

Your role is to:
- Politely identify yourself and the purpose of your call
- Introduce the clinical trial in a clear, friendly manner
- Answer questions about the trial, eligibility, and participation
- Gauge interest and schedule follow-up if appropriate
- Detect voicemail and hang up appropriately
- Be respectful, empathetic, and professional at all times

VOICEMAIL DETECTION - Call detected_answering_machine() ONLY if you hear these SPECIFIC phrases:
- "Thanks for calling" followed by automated instructions
- "You have reached the voicemail of..."
- "I'm not available right now, please leave a message"
- "After the tone, please leave your message"
- "To leave a callback number, press..."
- Clear automated/robotic voice with pre-recorded greeting
- "This number has been changed or disconnected"

DO NOT hang up if:
- A real person answers and asks questions
- The conversation is interactive and responsive
- Person is asking for information or clarification
- Someone is having a genuine conversation with you

IMPORTANT CONVERSATION BEHAVIOR:
- When the call connects, greet them warmly: "Hello, this is calling from {ORGANIZATION_NAME}. May I speak with [participant name]?"
- Listen to their response to determine if it's a real person or voicemail
- If it's a real person, CONTINUE the conversation - do NOT hang up
- If you clearly hear a voicemail greeting, call detected_answering_machine()
- Be professional, empathetic, and respectful throughout
- Answer questions honestly and clearly
- If the person is not interested, thank them politely and end the call using end_call_successful()

CONVERSATION GUIDELINES:
- INTRODUCTION: Identify yourself, your organization, and the purpose of your call
- VERIFY IDENTITY: Confirm you're speaking with the correct person
- EXPLAIN TRIAL: Briefly describe the clinical trial in simple, accessible language
- GAUGE INTEREST: Ask if they'd like to hear more or have any questions
- ANSWER QUESTIONS: Provide clear, honest answers about eligibility, participation, compensation, etc.
- NEXT STEPS: If interested, offer to schedule a follow-up or screening call
- RESPECT DECISIONS: If not interested, thank them and end the call graciously

TONE AND APPROACH:
- Be warm, friendly, and professional
- Use conversational language, not medical jargon
- Show empathy and respect for their time
- Listen actively to their concerns and questions
- Never pressure or manipulate - respect their autonomy
- Maintain participant privacy and confidentiality

KNOWLEDGE BOUNDARIES:
- Provide accurate information based on the trial details you have
- If you don't know an answer, acknowledge it honestly: "That's a great question. I don't have that specific information, but I can have someone with more expertise follow up with you."
- Do NOT make up information or exaggerate benefits
- Be transparent about risks, time commitments, and study requirements

Keep conversations RESPECTFUL and informative. Be prepared to discuss:
- Trial purpose and goals
- Eligibility criteria
- What participation involves
- Time commitment
- Compensation (if applicable)
- Contact information for questions

Organization Info:
- Phone: {ORGANIZATION_PHONE}
- Hours: Mon-Fri 9AM-5PM
"""


class ClinicalTrialAgent(Agent):
    def __init__(self, trial_data: Dict[str, Any]):
        # Parse clinical trial participant information from metadata
        participant_name = trial_data.get('participant_name', 'Unknown')
        trial_name = trial_data.get('trial_name', 'Unknown')
        trial_description = trial_data.get('trial_description', '')
        eligibility_criteria = trial_data.get('eligibility_criteria', '')
        compensation_info = trial_data.get('compensation_info', '')
        contact_info = trial_data.get('contact_info', '')
        additional_context = trial_data.get('additional_context', '')

        # Create personalized instructions with trial data
        personalized_instructions = f"""{OUTBOUND_SYSTEM_INSTRUCTIONS}

TRIAL INFORMATION FOR THIS CALL:
- Participant Name: {participant_name if participant_name != 'Unknown' else 'Not provided'}
- Trial Name: {trial_name if trial_name != 'Unknown' else 'Not provided'}
- Trial Description: {trial_description if trial_description else 'Not provided'}
- Eligibility Criteria: {eligibility_criteria if eligibility_criteria else 'Not provided'}
- Compensation: {compensation_info if compensation_info else 'Not provided'}
- Contact Information: {contact_info if contact_info else 'Not provided'}
- Additional Context: {additional_context if additional_context else 'None provided'}

Use this information when speaking with the potential participant. Be prepared to answer their questions about the trial."""

        super().__init__(instructions=personalized_instructions)
        self.trial_data = trial_data
        self.call_completed = False
        self.voicemail_detected = False

        # Parse trial information from metadata
        self.participant_phone = trial_data.get('phone_number', 'Unknown')
        self.participant_name = participant_name
        self.trial_name = trial_name
        self.trial_description = trial_description
        self.eligibility_criteria = eligibility_criteria
        self.compensation_info = compensation_info
        self.contact_info = contact_info
        self.additional_context = additional_context

        # Keep reference to participant for call management
        self.participant: rtc.RemoteParticipant | None = None

        logger.info(f"ClinicalTrialAgent initialized for participant: {self.participant_name}")


    def set_participant(self, participant: rtc.RemoteParticipant):
        self.participant = participant

    async def hangup(self):
        """Helper function to hang up the call by deleting the room"""
        job_ctx = get_job_context()
        await job_ctx.api.room.delete_room(
            api.DeleteRoomRequest(
                room=job_ctx.room.name,
            )
        )

    @function_tool()
    async def detected_answering_machine(self, ctx: RunContext) -> str:
        """Call this tool only when you clearly hear a voicemail greeting with specific automated phrases like 'Thanks for calling', 'You have reached the voicemail', 'leave a message after the beep', or other pre-recorded messages. Do NOT use this if a real person is talking to you."""
        logger.info("Voicemail detected by agent - hanging up immediately")
        self.voicemail_detected = True
        self.call_completed = True

        # Hang up immediately without leaving any message
        response_text = "Voicemail detected - hung up immediately"
        await self.hangup()

        return response_text
    
    
    @function_tool()
    async def end_call_successful(self, ctx: RunContext) -> str:
        """Call this when the conversation is complete and customer is informed"""
        logger.info("Call completed successfully")
        self.call_completed = True

        # Wait for final message to play out, then hang up
        response_text = "Thank you! Have a great day!"
        await ctx.wait_for_playout()
        await self.hangup()

        return response_text


async def entrypoint(ctx: JobContext):
    logger.info(f"connecting to room {ctx.room.name}")
    await ctx.connect()

    # Extract clinical trial data from job metadata
    trial_data = {}
    phone_number = None

    try:
        if ctx.job.metadata:
            trial_data = json.loads(ctx.job.metadata)
            phone_number = trial_data.get("phone_number")
            logger.info(f"Extracted trial data from job metadata: {trial_data}")
        else:
            logger.error("No job metadata available")
            ctx.shutdown()
            return

    except Exception as e:
        logger.error(f"Error extracting trial data from job metadata: {e}")
        ctx.shutdown()
        return

    if not phone_number:
        logger.error("No phone number provided for outbound call")
        ctx.shutdown()
        return

    # Get trunk ID from metadata if available, fallback to environment variable
    trunk_id = trial_data.get("sip_trunk_id") or outbound_trunk_id
    if not trunk_id:
        logger.error("No SIP trunk ID configured in metadata or environment")
        ctx.shutdown()
        return

    # Get caller ID from metadata or environment variable
    caller_id = trial_data.get("caller_id") or twilio_caller_id
    if not caller_id:
        logger.error("No caller ID configured. Set TWILIO_CALLER_ID environment variable with your authorized Twilio phone number")
        ctx.shutdown()
        return

    logger.info(f"📱 Using caller ID: {caller_id}")

    # Create clinical trial agent
    agent = ClinicalTrialAgent(trial_data)
    logger.info("📞 Using clinical trial recruitment agent")

    participant_identity = phone_number
    
    # Create STT instance with optimized settings for faster transcription
    stt_instance = deepgram.STT(
        model="nova-3",
        language="en",
        # Enable interim results for faster feedback
        interim_results=True,
    )

    # Create agent session with voice pipeline components
    session = AgentSession(
        stt=stt_instance,
        llm=openai.LLM(
            model="gpt-5-nano",
        ),
        tts=cartesia.TTS(
            model="sonic-2",
            voice="93c78f8b-0e6c-4ca6-addd-10ad39d0aa6d",  # Customer service voice
        ),
        vad=silero.VAD.load(
            # Optimize VAD for telephone audio quality
            min_speech_duration=0.1,  # Faster detection of speech start
            min_silence_duration=1.5,  # Wait 1.5 seconds of silence before considering speech ended
        ),
        preemptive_generation=True,
        use_tts_aligned_transcript=True,
    )
    
    # Start the session first before dialing, to ensure that when the user picks up
    # the agent does not miss anything the user says
    session_started = asyncio.create_task(
        session.start(
            agent=agent,
            room=ctx.room,
            room_input_options=RoomInputOptions(
                # Enable background voice cancellation optimized for telephony
                noise_cancellation=noise_cancellation.BVCTelephony(),
                participant_identity=participant_identity,
                pre_connect_audio=True,
                close_on_disconnect=True,
            ),
        )
    )

    # `create_sip_participant` starts dialing the participant
    try:
        logger.info(f"🔥 OUTBOUND CALL DEBUG - Starting call process")
        logger.info(f"📞 Target: {phone_number}")
        logger.info(f"🏢 Trunk ID: {trunk_id}")
        logger.info(f"🏠 Room: {ctx.room.name}")
        logger.info(f"👤 Participant Identity: {participant_identity}")
        logger.info(f"🔗 LiveKit URL: {os.getenv('LIVEKIT_URL')}")
        
        # Log the complete SIP request details
        sip_request = api.CreateSIPParticipantRequest(
            room_name=ctx.room.name,
            sip_trunk_id=trunk_id,
            sip_call_to=phone_number,
            sip_number=caller_id,  # CRITICAL: Set the authorized caller ID
            participant_identity=participant_identity,
            participant_name="Clinical Trial Recruitment Agent",
            # Use wait_until_answered to ensure we get a real person
            wait_until_answered=True,
        )
        
        logger.info(f"🛠️ SIP Request Details:")
        logger.info(f"   room_name: {sip_request.room_name}")
        logger.info(f"   sip_trunk_id: {sip_request.sip_trunk_id}")
        logger.info(f"   sip_call_to: {sip_request.sip_call_to}")
        logger.info(f"   sip_number: {sip_request.sip_number}")
        logger.info(f"   participant_identity: {sip_request.participant_identity}")
        logger.info(f"   participant_name: {sip_request.participant_name}")
        logger.info(f"   wait_until_answered: {sip_request.wait_until_answered}")
        
        logger.info(f"🚀 Creating SIP participant - initiating call...")
        
        # Create SIP participant with improved voicemail detection settings
        sip_task = asyncio.create_task(
            ctx.api.sip.create_sip_participant(sip_request)
        )
        
        # Wait for SIP participant creation with a longer timeout since we're waiting for answer
        try:
            logger.info(f"⏱️ Waiting for SIP participant creation (60s timeout)...")
            sip_participant = await asyncio.wait_for(sip_task, timeout=60.0)
            logger.info(f"✅ SIP participant created successfully!")
            logger.info(f"🎉 Participant answered! Call connected.")
            logger.info(f"📊 SIP Participant Details:")
            logger.info(f"   Identity: {sip_participant.participant_identity if hasattr(sip_participant, 'participant_identity') else 'N/A'}")
            logger.info(f"   SIP Call ID: {sip_participant.sip_call_id if hasattr(sip_participant, 'sip_call_id') else 'N/A'}")
        except asyncio.TimeoutError:
            logger.error("❌ TIMEOUT: Call was not answered within 60 seconds")
            logger.error("   This could indicate:")
            logger.error("   1. SIP routing issue between LiveKit and Twilio")
            logger.error("   2. Twilio BYOC trunk misconfiguration")
            logger.error("   3. Target number unreachable/busy")
            sip_task.cancel()
            ctx.shutdown()
            return
        
        # Wait for the agent session start
        await session_started
        
        # Since wait_until_answered=True, the participant should be ready
        try:
            participant = await asyncio.wait_for(
                ctx.wait_for_participant(identity=participant_identity), 
                timeout=10.0  # Short timeout since call should already be answered
            )
            logger.info(f"Participant answered! Joined: {participant.identity}")

            agent.set_participant(participant)

            # Wait briefly to detect if this is voicemail vs real person
            logger.info("Waiting to detect if voicemail or real person...")
            await asyncio.sleep(2.0)  # Give time for voicemail greeting to start

            # Generate initial greeting
            participant_name = trial_data.get('participant_name', 'there')
            initial_greeting = f"Hello, this is calling from {ORGANIZATION_NAME}. May I speak with {participant_name}?"
            logger.info("🎙️ Starting conversation with initial greeting")
            await session.say(initial_greeting)

            # Add debugging to monitor conversation state
            logger.info("📞 Initial greeting completed - agent is now listening for response")
            logger.info("🎧 Waiting for caller to respond - VAD should detect speech now")

            # Keep the session alive and monitor for conversation activity
            while not agent.call_completed:
                await asyncio.sleep(1.0)
                # This will keep the agent session active

            logger.info("📞 Call completed - session ending")
            
        except asyncio.TimeoutError:
            logger.info("Participant did not answer within 60 seconds - ending call")
            ctx.shutdown()
            return

    except api.TwirpError as e:
        logger.error(f"🚨 TWIRP ERROR - SIP participant creation failed!")
        logger.error(f"   Error message: {e.message}")
        logger.error(f"   SIP status code: {e.metadata.get('sip_status_code', 'N/A')}")
        logger.error(f"   SIP status: {e.metadata.get('sip_status', 'N/A')}")
        logger.error(f"   Full metadata: {e.metadata}")
        logger.error("   📋 Troubleshooting steps:")
        logger.error("   1. Check LiveKit SIP trunk configuration")
        logger.error("   2. Verify Twilio BYOC trunk settings")
        logger.error("   3. Confirm SIP credentials are correct")
        logger.error("   4. Check LiveKit → Twilio routing")
        ctx.shutdown()
    except Exception as e:
        logger.error(f"💥 UNEXPECTED ERROR during outbound call!")
        logger.error(f"   Error type: {type(e).__name__}")
        logger.error(f"   Error details: {str(e)}")
        logger.error(f"   Phone: {phone_number}")
        logger.error(f"   Trunk: {trunk_id}")
        logger.error(f"   Room: {ctx.room.name}")
        import traceback
        logger.error(f"   Traceback: {traceback.format_exc()}")
        ctx.shutdown()



if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            agent_name="outbound-caller",
        )
    )