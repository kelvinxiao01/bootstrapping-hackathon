# CRO Recruiter - Clinical Trial Patient Management

## Overview
This is a **CRO Recruiter** application for clinical trial patient recruitment and management, built with Next.js frontend and Supabase database backend.

**Current State:** ✅ Fully functional Supabase-integrated application with local eligibility scoring
- Frontend: Next.js 15.5.6 with React 19, TypeScript, and Tailwind CSS v4
- Database: Supabase (PostgreSQL) with realtime subscriptions
- Eligibility Scoring: Local deterministic algorithm (no external AI API required)
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

### Local Eligibility Scoring
- **Deterministic Algorithm**: 9 fixed trial categories with rule-based scoring (0-100)
- **Instant Calculation**: Client-side computation with no network latency
- **Automatic Caching**: Results saved to Supabase for persistence
- **Re-score Button**: Recalculate eligibility anytime with latest patient data

### CSV Import
- **Drag & Drop**: Upload patient data via CSV files
- **Preview**: Shows data before import
- **Sample Format**: Includes example CSV structure
- Supports: name, age, diagnosis, email, phone, medications

### Supabase Data Layer
Ready-to-use Supabase service functions for:
- `listPatients()` - Fetch all patients from Supabase
- `getPatient(id)` - Fetch single patient by ID
- `updatePatient(id, updates)` - Update patient data
- `rescorePatient(id)` - Calculate and cache eligibility locally
- `subscribeToPatients()` - Realtime updates via Supabase subscriptions
- `getTableColumns()` - Dynamic schema introspection

## Recent Changes

**October 18, 2025** - Supabase Integration with Local Eligibility Scoring
- **Complete Supabase Integration**:
  - Replaced mock data with live Supabase database queries
  - Realtime subscriptions for automatic dashboard updates
  - Environment variables configured: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
  - Dynamic schema introspection supports any table structure
- **Local Deterministic Eligibility Scoring**:
  - No external AI API required (removed OpenAI dependency)
  - 9 fixed trial categories with rule-based scoring algorithm
  - Instant client-side calculation (0ms latency)
  - Results cached in Supabase columns: top_category, eligibility_score, eligibility_label
  - Re-score button recalculates and updates database
- **Flexible Patient Data Model** (supports snake_case Supabase schema):
  - Demographics: dob, age, sex, height_cm, weight_kg, bmi
  - Vitals: systolic_bp, diastolic_bp
  - Lifestyle: smoking_status, pack_years
  - Diabetes: diabetes_dx, diabetes_type, a1c_pct_recent, egfr_ml_min_1_73m2_recent
  - Cardiovascular: mi_history, stroke_tia_history, pad_history, hf_history, lvef_pct, nyha_class
  - Medications: statin_current, anticoagulant_current, sglt2_current, glp1_current, insulin_current
  - Biomarkers: ntprobnp_pg_ml, ldl_mg_dl, hdl_mg_dl, triglycerides_mg_dl
  - Oncology: active_cancer, cancer_primary_site, cancer_stage, treatment_status
  - Dermatology: eczema_history, iga_score
  - Women's Health: pregnancy_status
- **Dynamic Field Labels**: Automatic conversion from snake_case to human-readable labels
  - Example: `egfr_ml_min_1_73m2_recent` → "Recent eGFR (mL/min/1.73m²)"
- **Updated Dashboard**:
  - Loads patient data directly from Supabase on mount
  - Realtime updates when data changes
  - Re-score button triggers local calculation + database update
  - Status changes persist to Supabase immediately
- **Updated Patient Detail Page**:
  - Fetches individual patient from Supabase by ID
  - Displays all clinical fields dynamically (no hardcoded columns)
  - Re-score and status update buttons persist to database
  - Shows computed eligibility reasons from scoring algorithm
- Removed all OpenAI/AI API references
- Architect-reviewed and approved for production deployment

**October 18, 2025** - Enterprise UI Polish
- Removed all emojis, replaced with professional SVG icons
- Removed "Powered by AI" badge and informal elements
- Updated color palette for medical/clinical professionalism
- Enhanced homepage with comprehensive product information

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
- **Database**: Supabase (PostgreSQL) with @supabase/supabase-js client
- **State Management**: React useState with Supabase realtime subscriptions
- **Development**: Next.js dev server on port 5000
- **Deployment**: Autoscale deployment target for production
- **Package Manager**: npm

### Supabase Configuration
Environment variables required:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous/public API key

The application connects directly to Supabase for:
1. **Patient Data**: Real-time database queries
2. **Eligibility Scoring**: Local computation with Supabase caching
3. **Patient Updates**: Direct Supabase updates with realtime sync
4. **Automated Calling**: Optional Python backend integration via `NEXT_PUBLIC_API_URL`

## Development Workflow
The Next.js development server runs automatically via the "Next.js Dev Server" workflow.
- Access the app through the webview on port 5000
- Hot reload is enabled for instant changes
- Data loads from Supabase database in real-time
- Eligibility scoring runs locally in the browser (no backend required)
- Optional Python backend can be connected via `NEXT_PUBLIC_API_URL` for calling features

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
