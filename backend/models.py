from pydantic import BaseModel, Field


class LaunchCallRequest(BaseModel):
    """Request model for launching an outbound call to a clinical trial participant."""

    participant_name: str = Field(..., description="Name of the potential participant")
    participant_context: str = Field(..., description="Context about the participant (eligibility criteria, medical history, etc.)")
    phone_number: str = Field(..., description="Phone number to call (E.164 format preferred, e.g., +1234567890)")

    # Optional trial information
    trial_name: str | None = Field(None, description="Name of the clinical trial")
    trial_description: str | None = Field(None, description="Brief description of the trial")
    compensation_info: str | None = Field(None, description="Compensation details for participants")
    contact_info: str | None = Field(None, description="Contact information for follow-up questions")

    # Optional SIP configuration overrides
    sip_trunk_id: str | None = Field(None, description="Override SIP trunk ID (uses env var if not provided)")
    caller_id: str | None = Field(None, description="Override caller ID (uses env var if not provided)")


class LaunchCallResponse(BaseModel):
    """Response model for launch call request."""

    success: bool = Field(..., description="Whether the call launch was successful")
    room_name: str | None = Field(None, description="LiveKit room name where the call is taking place")
    message: str = Field(..., description="Status message or error description")
    job_id: str | None = Field(None, description="Agent job ID for tracking")
