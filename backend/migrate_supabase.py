"""
Migration script to update Supabase CrobotMaster table.
- Change last_contacted column from text to timestamptz
- Convert existing text values to proper timestamp format
"""
import os
import sys
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv()

def run_migration():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SK")

    if not url or not key:
        print("❌ Missing SUPABASE_URL or SUPABASE_SK environment variables")
        sys.exit(1)

    print("🔄 Connecting to Supabase...")
    print(f"   URL: {url}")

    # Use PostgreSQL connection via Supabase
    # Since we can't run ALTER TABLE via REST API, we'll provide the SQL command

    print("\n⚠️ Supabase Python client cannot execute ALTER TABLE commands.")
    print("\nPlease run this SQL in Supabase SQL Editor:")
    print("   Dashboard → SQL Editor → New Query")
    print("=" * 70)
    print('''
-- Change last_contacted column from text to timestamptz
-- This will convert existing text values to proper timestamps
ALTER TABLE "CrobotMaster"
ALTER COLUMN last_contacted TYPE timestamptz
USING CASE
    WHEN last_contacted IS NULL OR last_contacted = '' THEN NULL
    WHEN last_contacted ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}' THEN last_contacted::timestamptz
    ELSE CURRENT_TIMESTAMP
END;

-- Verify the change
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'CrobotMaster' AND column_name = 'last_contacted';
    ''')
    print("=" * 70)
    print("\n✅ After running the SQL:")
    print("   - Column will be type 'timestamp with time zone'")
    print("   - Existing date strings will be converted to timestamps")
    print("   - Invalid values will be set to current timestamp\n")

if __name__ == "__main__":
    run_migration()
