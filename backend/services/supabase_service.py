import os
import logging
from datetime import datetime, timezone
from supabase import create_client, Client

logger = logging.getLogger(__name__)


class SupabaseService:
    """Service for interacting with Supabase database."""

    def __init__(self):
        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_SK")  # Service key for backend operations

        if not self.url or not self.key:
            raise ValueError(
                "Missing required Supabase configuration. "
                "Ensure SUPABASE_URL and SUPABASE_SK are set in environment."
            )

        # Create Supabase client
        self.client: Client = create_client(self.url, self.key)
        logger.info("SupabaseService initialized successfully")

    def normalize_phone_number(self, phone: str) -> str:
        """
        Normalize phone number format for consistent matching.

        Args:
            phone: Phone number in any format

        Returns:
            Normalized phone number (E.164 format with +1)
        """
        # Remove any whitespace, dashes, parentheses
        cleaned = ''.join(c for c in phone if c.isdigit() or c == '+')

        # Ensure it starts with +
        if not cleaned.startswith('+'):
            # Assume US number if no country code
            if len(cleaned) == 10:
                cleaned = f'+1{cleaned}'
            elif len(cleaned) == 11 and cleaned.startswith('1'):
                cleaned = f'+{cleaned}'
            else:
                cleaned = f'+{cleaned}'

        return cleaned

    async def update_patient_status(self, phone_number: str, status: str) -> dict:
        """
        Update the status and last_contacted columns for a patient record identified by phone number.

        Args:
            phone_number: Phone number of the participant
            status: New status value (e.g., "Contacted")

        Returns:
            Dictionary with success status and message

        Raises:
            Exception if update fails
        """
        try:
            # Normalize phone number for matching
            normalized_phone = self.normalize_phone_number(phone_number)

            # Get current timestamp in ISO format with timezone
            current_timestamp = datetime.now(timezone.utc).isoformat()

            logger.info(f"Updating status for phone: {normalized_phone} to '{status}' at {current_timestamp}")

            # Update both status and last_contacted columns
            update_data = {
                "status": status,
                "last_contacted": current_timestamp
            }

            # Try to find and update the record
            # First, try exact match with normalized phone
            result = (
                self.client.table("CrobotMaster")
                .update(update_data)
                .eq("phone", normalized_phone)
                .execute()
            )

            # If no match found, try without +1 prefix
            if not result.data:
                phone_without_plus = normalized_phone.lstrip('+')
                logger.info(f"Trying alternate format: {phone_without_plus}")
                result = (
                    self.client.table("CrobotMaster")
                    .update(update_data)
                    .eq("phone", phone_without_plus)
                    .execute()
                )

            # If still no match, try with just the 10 digits
            if not result.data and len(normalized_phone) > 10:
                last_10_digits = normalized_phone[-10:]
                logger.info(f"Trying last 10 digits: {last_10_digits}")
                result = (
                    self.client.table("CrobotMaster")
                    .update(update_data)
                    .eq("phone", last_10_digits)
                    .execute()
                )

            if result.data:
                logger.info(f"Successfully updated {len(result.data)} record(s) to status '{status}' with timestamp")
                return {
                    "success": True,
                    "message": f"Updated {len(result.data)} record(s)",
                    "phone_number": normalized_phone,
                    "status": status,
                    "last_contacted": current_timestamp
                }
            else:
                logger.warning(f"No records found for phone number: {normalized_phone}")
                return {
                    "success": False,
                    "message": f"No records found for phone number: {normalized_phone}",
                    "phone": normalized_phone
                }

        except Exception as e:
            logger.error(f"Failed to update patient status: {e}")
            raise

    async def get_patient_by_phone(self, phone_number: str) -> dict | None:
        """
        Retrieve patient record by phone number.

        Args:
            phone_number: Phone number of the participant

        Returns:
            Patient record dict or None if not found
        """
        try:
            normalized_phone = self.normalize_phone_number(phone_number)

            result = (
                self.client.table("CrobotMaster")
                .select("*")
                .eq("phone", normalized_phone)
                .execute()
            )

            if result.data and len(result.data) > 0:
                return result.data[0]

            return None

        except Exception as e:
            logger.error(f"Failed to retrieve patient: {e}")
            return None
