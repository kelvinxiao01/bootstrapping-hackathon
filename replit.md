# CRO Recruiter - Clinical Trial Patient Management

## Overview
This project is a **CRO Recruiter** application for clinical trial patient recruitment and management. It utilizes a Next.js frontend and a Supabase database backend. The primary purpose is to efficiently manage patient data for clinical trials, focusing on qualified study types, and providing tools for filtering, sorting, and real-time data updates. The application is production-ready and aims to streamline patient management for clinical research organizations.

## User Preferences
None specified yet.

## System Architecture

### UI/UX Decisions
The application features a professional and clean UI suitable for clinical use, with a focus on patient management. It employs a consistent color palette and uses SVG icons for clarity. The dashboard prioritizes the "Qualified Study Type" feature, making it the leftmost column with distinctive colored badges for easy identification.

**Homepage Design:**
- Soft animated aurora gradient background (subtle blue/indigo tones)
- Hero section with main headline: "Empower Your Research Team Through"
- Animated rotating subheadlines (3-second fade transitions):
  - "AI-powered patient calls"
  - "Seamless eligibility screening"
  - "Automated follow-ups"
- Clean enterprise palette: soft whites, light blues, slate gray
- Professional clinical aesthetic with no emojis
- Modern, credible, and enterprise-ready design

### Technical Implementations
- **Frontend**: Built with Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS v4.
- **Backend**: Supabase (PostgreSQL) is used as the database.
- **Data Handling**: Utilizes Supabase's real-time subscriptions for live dashboard updates, efficient data fetching with `.range()` for pagination, and direct Supabase service functions for patient management (list, get, update).
- **Filtering System**: Comprehensive server-side filtering with OR semantics:
  - **Search Filter**: Debounced (300ms) search across name, phone, and email fields with OR logic
  - **Contact Status Filter**: Exact match filter (All, Pending, Contacted, Interested, Onboard, Needs Info, Ineligible, Unreachable, Do Not Contact)
  - **Study Type Filter**: Multi-select with OR semantics - matches patients qualified for ANY selected study type
  - **Combined Filters**: When search and study type filters are both active, they use OR semantics (match search OR study type) due to Supabase query builder limitations
  - All filters use server-side processing with accurate pagination counts
- **Sorting**: Options for 'Last Contacted', 'Name', 'Age', and 'Status' with ascending/descending toggle.
- **Pagination**: Displays 10 patients per page with intuitive navigation and accurate total counts.
- **CSV Import**: Supports drag-and-drop CSV uploads with a preview feature.
- **Eligibility Scoring**: Local, rule-based scoring algorithm (client-side) for patient eligibility, cached in Supabase.
- **Dynamic Fields**: Supports 54-column flexible patient data model with dynamic conversion from snake_case to human-readable labels.

### Feature Specifications
- **Patient Management Dashboard**: Displays patient data with a primary focus on "Qualified Study Type" (8 categories: Diabetes, CKD, Cardiovascular, Oncology, Dermatology, Metabolic/Obesity, Neurology, Women's Health). Includes stat cards for study type counts.
- **Advanced Filtering & Sorting**: Search by name/condition, multi-select study type filter, and 8 sorting options.
- **Patient Table View**: Features columns for Qualified Study Type, Patient details, Current Status (Pending, Contacted, Interested, Onboard), Last Contacted date, and Actions (view details, start call).
- **CSV Import**: Facilitates uploading patient data with a defined sample format.

### System Design Choices
- **Frontend-centric Logic**: Most of the core logic, including eligibility scoring, is handled on the client-side for performance, interacting directly with Supabase.
- **Real-time Capabilities**: Leverages Supabase subscriptions for instant UI updates upon data changes.
- **Modular Structure**: Organized project with clear separation of components, services, and types.

## External Dependencies
- **Supabase**: Used for database (PostgreSQL), real-time subscriptions, and authentication (via API keys).
  - **Table name**: `CrobotMaster`
  - **Primary key**: `patient_id` (string)
  - **Schema**: 54 columns with snake_case names
  - **RLS Configuration**: Row Level Security must be configured for data access
    - Disable RLS for testing: `ALTER TABLE "CrobotMaster" DISABLE ROW LEVEL SECURITY;`
    - Or create read policy: `CREATE POLICY "Allow public read access" ON "CrobotMaster" FOR SELECT TO public USING (true);`
- **Next.js**: Frontend framework.
- **React**: UI library.
- **TypeScript**: Programming language.
- **Tailwind CSS**: Styling framework.