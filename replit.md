# CRO Recruiter - Clinical Trial Patient Management

## Overview
This project is a **CRO Recruiter** application for clinical trial patient recruitment and management. It utilizes a Next.js frontend and a Supabase database backend. The primary purpose is to efficiently manage patient data for clinical trials, focusing on qualified study types, and providing tools for filtering, sorting, and real-time data updates. The application is production-ready and aims to streamline patient management for clinical research organizations.

## User Preferences
None specified yet.

## System Architecture

### UI/UX Decisions
The application features a professional and clean UI suitable for clinical use, with a focus on patient management. It employs a consistent color palette and uses SVG icons for clarity. The dashboard prioritizes the "Qualified Study Type" feature, making it the leftmost column with distinctive colored badges for easy identification.

### Technical Implementations
- **Frontend**: Built with Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS v4.
- **Backend**: Supabase (PostgreSQL) is used as the database.
- **Data Handling**: Utilizes Supabase's real-time subscriptions for live dashboard updates, efficient data fetching with `.range()` for pagination, and direct Supabase service functions for patient management (list, get, update).
- **Filtering & Sorting**: Implements multi-select filtering by qualified study type, and sorting options for 'Last Contacted', 'Name', 'Age', and 'Status'.
- **Pagination**: Displays 10 patients per page with intuitive navigation.
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