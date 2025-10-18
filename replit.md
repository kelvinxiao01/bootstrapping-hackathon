# CRO Recruiter - Clinical Trial Patient Management

## Overview
This is a **CRO Recruiter** application for clinical trial patient recruitment and management, built with Next.js frontend and Python backend (ready for AI integration).

**Current State:** ✅ Fully functional frontend with mock data, ready for backend integration
- Frontend: Next.js 15.5.6 with React 19, TypeScript, and Tailwind CSS v4
- Backend: Python 3.11 (ready for AI calling and eligibility scoring)
- Development server running on port 5000

## Application Features

### Patient Management Dashboard
- **Patient Table View**: Excel-like grid displaying all patients with key information
  - Name, age, diagnosis, medications, test results
  - Eligibility scores (0-100 scale, color-coded)
  - Status indicators (Eligible, Needs Review, Ineligible, Pending)
  - Quick status updates via dropdown menus

### Search & Filtering
- **Search Bar**: Find patients by name or diagnosis
- **Status Filter**: Filter by eligibility status (All, Eligible, Needs Review, Ineligible, Pending)
- Real-time filtering without page refresh

### Patient Detail View
- **Side Panel**: Comprehensive patient information panel
  - Basic demographics and contact information
  - Complete medical history and medications
  - Detailed test results (BP, cholesterol, glucose, etc.)
  - Eligibility criteria checklist (interactive)
  - Clinical notes (editable)
  - Action buttons for AI features

### AI Integration (Ready for Backend)
- **Recalculate Eligibility**: Button to trigger AI scoring algorithm
- **Start Call**: Button to initiate automated patient calling system
- Mock implementations show expected workflow

### CSV Import
- **Drag & Drop**: Upload patient data via CSV files
- **Preview**: Shows data before import
- **Sample Format**: Includes example CSV structure
- Supports: name, age, diagnosis, email, phone, medications

### Backend API Layer
Ready-to-use API service functions for:
- `GET /patients` - Fetch all patients
- `GET /patients/:id` - Fetch single patient
- `POST /score` - Calculate eligibility score
- `POST /call/start` - Initiate AI calling
- `PATCH /patients/:id` - Update patient data
- `POST /patients/import` - Bulk import patients

## Recent Changes

**October 18, 2025** - CRO Recruiter Application Built
- Created complete patient management dashboard
- Implemented patient table with sorting and filtering
- Built patient detail view with eligibility criteria
- Added CSV import functionality with drag & drop
- Created API service layer ready for Python backend integration
- Included 6 sample patients with realistic medical data
- Designed clean, professional UI suitable for clinical use

**October 18, 2025** - Vercel to Replit Migration
- Configured Next.js to run on port 5000 with host binding (0.0.0.0)
- Removed Turbopack flags from build/dev scripts for better Replit compatibility
- Set up workflow for automatic Next.js development server
- Configured deployment settings for production (autoscale)
- Installed Node.js 20 and Python 3.11 environments
- Added .gitignore for Node.js and Python projects

## Project Structure
```
├── frontend/bootstrapping-hackathon/
│   ├── app/
│   │   ├── page.tsx                 # Landing page
│   │   ├── dashboard/
│   │   │   └── page.tsx             # Main dashboard
│   │   ├── layout.tsx               # Root layout
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── Header.tsx               # App header/navigation
│   │   ├── PatientTable.tsx         # Patient data grid
│   │   ├── PatientDetail.tsx        # Detail side panel
│   │   └── ImportCSV.tsx            # CSV import modal
│   ├── lib/
│   │   ├── api.ts                   # Backend API service
│   │   └── mockData.ts              # Sample patient data
│   ├── types/
│   │   └── patient.ts               # TypeScript types
│   └── package.json
└── backend/
    ├── main.py                      # Python backend (ready for AI)
    └── pyproject.toml
```

## Architecture

### Frontend Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React useState (client components)
- **Development**: Next.js dev server on port 5000
- **Deployment**: Autoscale deployment target for production
- **Package Manager**: npm

### Backend Integration Points
The frontend is structured to easily connect to Python backend endpoints:

1. **Patient Data**: `GET /patients` → Load patient list
2. **Eligibility Scoring**: `POST /score` → AI-powered scoring
3. **Automated Calling**: `POST /call/start` → Initiate calls
4. **Patient Updates**: `PATCH /patients/:id` → Save changes
5. **CSV Import**: `POST /patients/import` → Bulk data import

Set `NEXT_PUBLIC_API_URL` environment variable to connect to backend.

## Development Workflow
The Next.js development server runs automatically via the "Next.js Dev Server" workflow.
- Access the app through the webview on port 5000
- Hot reload is enabled for instant changes
- Mock data provides immediate functionality
- Backend can be developed independently and connected via API

## User Flow
1. **Landing Page** → User sees app overview and features
2. **Dashboard** → View all patients in table format
3. **Search/Filter** → Find specific patients or status groups
4. **Patient Details** → Click "View Details" to see full information
5. **Update Eligibility** → Check criteria, recalculate score
6. **Start Call** → Trigger AI calling system (backend)
7. **Import Data** → Upload CSV files to add patients
8. **Export/Manage** → Track recruitment progress

## Sample Data Included
6 realistic patient profiles with:
- Varied diagnoses (Diabetes, Hypertension, Asthma, COPD, Migraine)
- Complete medication lists
- Test results and vital signs
- Eligibility scores (45-92)
- Different statuses (Eligible, Needs Review, Ineligible, Pending)
- Contact information and clinical notes

## Runtime Verification

### Development Server
✅ Server successfully boots in ~2s
✅ Routes compile and serve without critical errors
✅ GET requests return 200 status codes
✅ Port 5000 binding confirmed working
✅ Dashboard loads with 6 sample patients
✅ Interactive features functional (search, filter, status updates)
⚠️ Cross-origin warnings from Replit iframe environment (expected, non-critical)

### Production Build & Start (Verified)
✅ `npm run build` completes successfully in 10.5s
✅ Optimized production bundle created
✅ Linting and type checking passed
✅ Static pages generated
✅ `npm run start` launches production server in 1.2s
✅ Production server binds to 0.0.0.0:5000 correctly

## Deployment Configuration
Located in `.replit` file:
- **Target**: autoscale (stateless, scales with traffic)
- **Build**: `cd frontend/bootstrapping-hackathon && npm run build`
- **Run**: `cd frontend/bootstrapping-hackathon && npm run start`
- **Port Mapping**: 5000 (local) → 80 (external)

## Next Steps for Backend Team
1. Create Python endpoints matching the API service layer
2. Implement AI eligibility scoring algorithm
3. Build automated calling system with AI agent
4. Connect database for persistent patient storage
5. Set up environment variable: `NEXT_PUBLIC_API_URL`
6. Test integration with frontend mock data replacement

## User Preferences
None specified yet.
