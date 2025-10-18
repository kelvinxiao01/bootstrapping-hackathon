import os
import json
import logging
import uuid
from typing import Dict, Any
from livekit import api

logger = logging.getLogger(__name__)


class LiveKitService:
    """Service for interacting with LiveKit API to dispatch agent jobs."""

    def __init__(self):
        self.url = os.getenv("LIVEKIT_URL")
        self.api_key = os.getenv("LIVEKIT_API_KEY")
        self.api_secret = os.getenv("LIVEKIT_API_SECRET")

        if not all([self.url, self.api_key, self.api_secret]):
            raise ValueError(
                "Missing required LiveKit configuration. "
                "Ensure LIVEKIT_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET are set in environment."
            )

        # Create LiveKit API client
        self.livekit_api = api.LiveKitAPI(
            url=self.url,
            api_key=self.api_key,
            api_secret=self.api_secret,
        )

        logger.info(f"LiveKitService initialized with URL: {self.url}")

    async def create_room(self, room_name: str | None = None) -> str:
        """
        Create a LiveKit room for the outbound call.

        Args:
            room_name: Optional room name. If not provided, generates a unique name.

        Returns:
            The name of the created room.
        """
        if not room_name:
            room_name = f"outbound-call-{uuid.uuid4().hex[:12]}"

        try:
            # Create the room
            room = await self.livekit_api.room.create_room(
                api.CreateRoomRequest(name=room_name)
            )
            logger.info(f"Created LiveKit room: {room.name}")
            return room.name

        except Exception as e:
            logger.error(f"Failed to create LiveKit room: {e}")
            raise

    async def dispatch_agent(
        self,
        room_name: str,
        trial_data: Dict[str, Any],
    ) -> str:
        """
        Dispatch the clinical trial agent to a room with trial data.

        Args:
            room_name: Name of the LiveKit room
            trial_data: Dictionary containing trial participant information

        Returns:
            Job ID of the dispatched agent
        """
        try:
            # Convert trial data to JSON string for metadata
            metadata = json.dumps(trial_data)

            # Dispatch agent job
            job = await self.livekit_api.agent_dispatch.create_dispatch(
                api.CreateAgentDispatchRequest(
                    room=room_name,
                    agent_name="outbound-caller",  # Must match the agent name in outbound_agent.py and LiveKit dispatch rule
                    metadata=metadata,
                )
            )

            # Get job ID from response - try different possible field names
            job_id = None
            if hasattr(job, 'agent_dispatch_id'):
                job_id = job.agent_dispatch_id
            elif hasattr(job, 'id'):
                job_id = job.id
            else:
                # If no ID field found, just use the room name as identifier
                job_id = room_name

            logger.info(f"Dispatched agent to room {room_name} with job ID: {job_id}")
            logger.info(f"Trial data: {trial_data}")

            return job_id

        except Exception as e:
            logger.error(f"Failed to dispatch agent to room {room_name}: {e}")
            raise

    async def launch_outbound_call(
        self,
        participant_name: str,
        participant_context: str,
        phone_number: str,
        trial_name: str | None = None,
        trial_description: str | None = None,
        compensation_info: str | None = None,
        contact_info: str | None = None,
        sip_trunk_id: str | None = None,
        caller_id: str | None = None,
    ) -> tuple[str, str]:
        """
        Launch an outbound call to a clinical trial participant.

        Args:
            participant_name: Name of the participant
            participant_context: Context about the participant (eligibility criteria, etc.)
            phone_number: Phone number to call
            trial_name: Name of the clinical trial (optional)
            trial_description: Description of the trial (optional)
            compensation_info: Compensation details (optional)
            contact_info: Contact information (optional)
            sip_trunk_id: Override SIP trunk ID (optional)
            caller_id: Override caller ID (optional)

        Returns:
            Tuple of (room_name, job_id)
        """
        # Create room
        room_name = await self.create_room()

        # Prepare trial data for agent
        # Convert "Researcher with expertise in X" to "Patient interested in X trials"
        patient_context = participant_context.replace(
            "Researcher with expertise in", "Patient interested in"
        ).replace(
            "Found on ResearchGate", "Recruited via ResearchGate patient platform"
        )

        trial_data = {
            "participant_name": participant_name,
            "phone_number": phone_number,
            "trial_name": trial_name or "Clinical Trial",
            "trial_description": trial_description or "",
            "eligibility_criteria": patient_context,  # Patient condition, not research expertise
            "compensation_info": compensation_info or "",
            "contact_info": contact_info or "",
            "additional_context": patient_context,
        }

        # Add optional SIP configuration overrides
        if sip_trunk_id:
            trial_data["sip_trunk_id"] = sip_trunk_id
        if caller_id:
            trial_data["caller_id"] = caller_id

        # Dispatch agent
        job_id = await self.dispatch_agent(room_name, trial_data)

        return room_name, job_id
