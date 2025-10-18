import logging
from fastapi import APIRouter, HTTPException, status

from models import LaunchCallRequest, LaunchCallResponse
from services.livekit_service import LiveKitService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["calls"])


@router.post("/launch-call", response_model=LaunchCallResponse)
async def launch_call(request: LaunchCallRequest):
    """
    Launch an outbound call to a clinical trial participant.

    This endpoint:
    1. Creates a LiveKit room
    2. Dispatches the clinical trial agent with participant data
    3. The agent will make an outbound SIP call to the participant

    Args:
        request: LaunchCallRequest containing participant information

    Returns:
        LaunchCallResponse with room name and job ID
    """
    try:
        logger.info(f"Launching call to {request.participant_name} at {request.phone_number}")

        # Initialize LiveKit service
        livekit_service = LiveKitService()

        # Launch the outbound call
        room_name, job_id = await livekit_service.launch_outbound_call(
            participant_name=request.participant_name,
            participant_context=request.participant_context,
            phone_number=request.phone_number,
            trial_name=request.trial_name,
            trial_description=request.trial_description,
            compensation_info=request.compensation_info,
            contact_info=request.contact_info,
            sip_trunk_id=request.sip_trunk_id,
            caller_id=request.caller_id,
        )

        logger.info(f"Call launched successfully to room {room_name} with job {job_id}")

        return LaunchCallResponse(
            success=True,
            room_name=room_name,
            job_id=job_id,
            message=f"Call launched successfully to {request.participant_name}",
        )

    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Configuration error: {str(e)}",
        )

    except Exception as e:
        logger.error(f"Failed to launch call: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to launch call: {str(e)}",
        )


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "clinical-trial-agent-api"}
