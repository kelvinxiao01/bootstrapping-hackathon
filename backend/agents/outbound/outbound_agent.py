from __future__ import annotations

import asyncio
import logging
import os
import sys
import json
from pathlib import Path
from typing import Dict, Any
from dotenv import load_dotenv

# Add the current directory and parent directory to sys.path for imports
sys.path.append(str(Path(__file__).parent))
sys.path.append(str(Path(__file__).parent.parent.parent))

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
from services.supabase_service import SupabaseService


load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("outbound-clinical-trial-agent")

# Clinical trial organization configuration
ORGANIZATION_NAME = os.getenv("ORGANIZATION_NAME", "Clinical Research Associates")
ORGANIZATION_PHONE = os.getenv("ORGANIZATION_PHONE", "+1234567890")
outbound_trunk_id = os.getenv("OUTBOUND_SIP_TRUNK_ID")
twilio_caller_id = os.getenv("TWILIO_CALLER_ID")

OUTBOUND_SYSTEM_INSTRUCTIONS = f"""You are Jocelyn, recruiting people to participate in a clinical trial. You found them through ResearchGate.

Your role is to:
- Introduce yourself briefly and personally (you're Jocelyn, not a company representative)
- Mention you found them on ResearchGate (establishes credibility)
- Invite them to join and participate in a clinical trial study
- Gauge their interest in becoming a participant
- Keep responses SHORT and conversational - never ramble
- Answer questions directly and concisely
- Detect voicemail and hang up appropriately
- Be respectful, warm, and professional at all times

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

OPENING STRATEGY - Handle Two Scenarios:

SCENARIO 1: You speak first (most common)
- Use concise introduction: "Hi [name], this is Jocelyn. I found your profile on ResearchGate and wanted to reach out about participating in a clinical trial. Is now a good time?"
- Keep it under 25 words for initial greeting
- Wait for their response

SCENARIO 2: They speak first ("Hello?", "Who is this?", etc.)
- Respond immediately: "Hi! This is Jocelyn. Is this [name]?"
- After confirmation, continue: "Great! I found you on ResearchGate and wanted to reach out about joining a clinical trial. Do you have a quick minute?"

CONCISENESS RULES - Keep responses SHORT and CONVERSATIONAL:

✅ GOOD EXAMPLES:
Q: "What's this about?"
A: "I'm recruiting for a diabetes clinical trial. You might be a good fit based on your research background. Interested in participating?"

Q: "How did you get my number?"
A: "I found your profile on ResearchGate. You're doing research in this area, so I thought you might want to participate."

Q: "Tell me about the trial"
A: "We're testing a new diabetes treatment. Takes about 6 months with monthly visits. Participants are compensated. Interested in joining?"

❌ BAD EXAMPLES (Too long/rambling):
"Well, I was looking through ResearchGate profiles and came across your fascinating work on metabolic disorders, and I thought to myself that you would be a perfect candidate for this exciting new clinical trial opportunity that we're running..."

RULES:
- Keep initial responses under 30 words
- Answer the question asked, nothing more
- Use natural, conversational language
- Pause after each point to let them respond
- Never list multiple things at once
- If they seem busy, offer to call back or send info

NAME USAGE RULES - Use names naturally, not repeatedly:

✅ USE NAME:
- First greeting: "Hi [name], this is Jocelyn..."
- If verifying identity: "Is this [name]?"
- When reconnecting after interruption

❌ DON'T USE NAME:
- In follow-up responses during the same conversation
- When answering their questions
- In closing statements
- Don't say "Well [name]..." or "So [name]..." repeatedly

EXAMPLES:

Good natural flow:
Jocelyn: "Hi Kelvin, this is Jocelyn. I found your profile on ResearchGate..."
Kelvin: "Oh, what's this about?"
Jocelyn: "I'm reaching out about a diabetes trial. Interested?"  ← No name used

Bad (too many names):
Jocelyn: "Hi Kelvin, this is Jocelyn..."
Kelvin: "What's this about?"
Jocelyn: "Well Kelvin, I'm calling about a trial, Kelvin..."  ← Too repetitive

CONVERSATION FLOW (Step by Step):

1. INTRODUCTION (10-15 seconds max)
   "Hi [name], this is Jocelyn. I found you on ResearchGate and wanted to reach out about participating in a clinical trial. Is now a good time?"

2. GAUGE INTEREST (10 seconds)
   If yes: "Great! It's a [trial_name] trial. You might be eligible based on your research. Interested in joining?"
   If no/busy: "No problem! Can I send you information to review later?"

3. BRIEF OVERVIEW (Only if they ask - 20 seconds max)
   Share ONE key point about the trial
   Ask ONE qualifying question
   Let THEM ask questions (don't info-dump)

4. CLOSE
   If interested: "Perfect! Someone from our team will reach out with details about participating."
   If not interested: "Thanks for your time. Have a great day!"

TONE AND APPROACH:
- Be warm, friendly, and conversational (like calling a colleague)
- Use simple language, not medical jargon or corporate speak
- Use their name ONCE in greeting, then use natural pronouns (you, your) throughout
- Respect their time - keep it brief
- Listen actively - let them guide the conversation
- Never pressure or manipulate - respect their autonomy
- If they're not interested, gracefully exit

NATURAL CONVERSATION EXAMPLES - How a real call should flow:

Example 1: Interested person (recruiting them to participate)
Jocelyn: "Hi Sarah, this is Jocelyn. I found you on ResearchGate and wanted to reach out about participating in a diabetes trial. Is now a good time?"
Sarah: "Sure, what's it about?"
Jocelyn: "We're testing a new treatment. Takes 6 months with monthly visits. Participants get compensated. Interested in joining?"
Sarah: "Yeah, tell me more about the time commitment"
Jocelyn: "Monthly clinic visits, about 2 hours each. Plus some at-home monitoring. The team can share full details. Want me to have them reach out?"
Sarah: "Yes please"
Jocelyn: "Perfect! They'll call you this week to discuss participation. Thanks!"

Example 2: Busy person
Jocelyn: "Hi Mike, this is Jocelyn. I found you on ResearchGate and wanted to reach out about joining a clinical trial. Is now a good time?"
Mike: "I'm actually in a meeting"
Jocelyn: "No problem! Can I send you information to review later?"
Mike: "Sure, email me"
Jocelyn: "Will do. Have a great day!"

Example 3: Not interested
Jocelyn: "Hi Lisa, this is Jocelyn. I found you on ResearchGate and wanted to reach out about participating in a cancer research trial. Is now a good time?"
Lisa: "I'm not really interested"
Jocelyn: "No worries! Thanks for your time. Have a great day!"

Notice: Name used ONLY in initial greeting, then natural pronouns (you, they, them) for rest of conversation

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

DATABASE UPDATES - Automatic contact tracking:

The system automatically updates the database when a participant responds:
- Status is automatically set to "Contacted" when the participant says something substantial (more than 2-3 words)
- This happens within the first 10-15 seconds of conversation
- Ensures tracking even if the call drops unexpectedly
- Only updates once per call (no duplicates)

You also have a mark_contacted() tool available if you need to manually trigger the update, but in most cases it happens automatically.

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
- Your Name: Jocelyn
- Participant Name: {participant_name if participant_name != 'Unknown' else 'Not provided'}
- How You Found Them: ResearchGate profile
- Trial Name: {trial_name if trial_name != 'Unknown' else 'Not provided'}
- Trial Description: {trial_description if trial_description else 'Not provided'}
- Eligibility Criteria: {eligibility_criteria if eligibility_criteria else 'Not provided'}
- Compensation: {compensation_info if compensation_info else 'Not provided'}
- Contact Information: {contact_info if contact_info else 'Not provided'}
- Additional Context: {additional_context if additional_context else 'None provided'}

REMEMBER: You are Jocelyn. Keep responses conversational and brief. Mention ResearchGate in your introduction."""

        super().__init__(instructions=personalized_instructions)
        self.trial_data = trial_data
        self.call_completed = False
        self.voicemail_detected = False
        self.status_updated = False  # Track if mark_contacted() was already called

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

        # Initialize Supabase service for database updates
        try:
            self.supabase_service = SupabaseService()
        except Exception as e:
            logger.warning(f"Failed to initialize Supabase service: {e}")
            self.supabase_service = None

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

    @function_tool()
    async def mark_contacted(self, ctx: RunContext) -> str:
        """
        Mark this participant as contacted in the database.
        Call this IMMEDIATELY after the recipient says something substantial (see DATABASE UPDATES section).
        This should happen within 10-15 seconds of the call starting.
        """
        # Check if already called (idempotency)
        if self.status_updated:
            logger.info("Status already updated - skipping duplicate call")
            return "Status already updated"

        if not self.supabase_service:
            logger.warning("Supabase service not available - cannot update status")
            return "Database service not available"

        if not self.participant_phone or self.participant_phone == 'Unknown':
            logger.warning("Cannot update status - no phone number available")
            return "No phone number available to update"

        try:
            result = await self.supabase_service.update_patient_status(
                phone_number=self.participant_phone,
                status="Contacted"
            )

            if result['success']:
                self.status_updated = True  # Mark as updated to prevent duplicates
                logger.info(f"✅ Successfully updated status to 'Contacted' for {self.participant_phone}")
                return "Status updated to Contacted successfully"
            else:
                logger.warning(f"⚠️ {result['message']}")
                return f"Could not update status: {result['message']}"

        except Exception as e:
            logger.error(f"❌ Failed to update status: {e}")
            return f"Failed to update status: {str(e)}"

    async def mark_contacted_programmatically(self):
        """
        Programmatic version of mark_contacted that doesn't require RunContext.
        Called automatically by event listener when first substantial response is detected.
        """
        if self.status_updated:
            logger.info("Status already updated - skipping programmatic call")
            return

        if not self.supabase_service:
            logger.warning("Supabase service not available - cannot update status")
            return

        if not self.participant_phone or self.participant_phone == 'Unknown':
            logger.warning("Cannot update status - no phone number available")
            return

        try:
            result = await self.supabase_service.update_patient_status(
                phone_number=self.participant_phone,
                status="Contacted"
            )

            if result['success']:
                self.status_updated = True
                logger.info(f"✅ Auto-updated status to 'Contacted' for {self.participant_phone}")
            else:
                logger.warning(f"⚠️ Auto-update failed: {result['message']}")

        except Exception as e:
            logger.error(f"❌ Failed to auto-update status: {e}")


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

    # Add event listener to automatically trigger mark_contacted on first substantial response
    @session.on("user_input_transcribed")
    def on_user_input_transcribed(event):
        """Automatically update status when participant gives first substantial response"""
        # Only process final transcripts to avoid duplicates
        if not agent.status_updated and event.is_final:
            transcript = event.transcript.strip()
            word_count = len(transcript.split())

            # Substantial response = more than 2 words and not just minimal greetings
            non_substantial_phrases = ["hello?", "hello", "yes?", "hi", "yeah"]
            is_substantial = (
                word_count > 2 and
                transcript.lower() not in non_substantial_phrases
            )

            if is_substantial:
                logger.info(f"🎯 First substantial response detected: '{transcript}' ({word_count} words) - triggering mark_contacted()")
                asyncio.create_task(agent.mark_contacted_programmatically())
            else:
                logger.debug(f"Non-substantial response: '{transcript}' - waiting for more context")

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

            # Generate initial greeting - Jocelyn recruiting them to participate
            participant_name = trial_data.get('participant_name', 'there')
            trial_name = trial_data.get('trial_name', 'a clinical trial')
            initial_greeting = f"Hi {participant_name}, this is Jocelyn. I found you on ResearchGate and wanted to reach out about participating in {trial_name}. Is now a good time?"
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