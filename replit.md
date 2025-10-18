# Bootstrapping Hackathon Project

## Overview
This is a Next.js application with a Python backend, migrated from Vercel to Replit.

**Current State:** ✅ Fully functional and running on Replit
- Frontend: Next.js 15.5.6 with React 19, TypeScript, and Tailwind CSS
- Backend: Python 3.11 (minimal setup)
- Development server running on port 5000

## Recent Changes
**October 18, 2025** - Vercel to Replit Migration
- Configured Next.js to run on port 5000 with host binding (0.0.0.0)
- Removed Turbopack flags from build/dev scripts for better Replit compatibility
- Set up workflow for automatic Next.js development server
- Configured deployment settings for production (autoscale)
- Installed Node.js 20 and Python 3.11 environments
- Added .gitignore for Node.js and Python projects

## Project Structure
```
├── frontend/
│   └── bootstrapping-hackathon/    # Next.js application
│       ├── app/                     # Next.js App Router
│       ├── public/                  # Static assets
│       └── package.json             # Frontend dependencies
└── backend/
    ├── main.py                      # Python backend (minimal)
    └── pyproject.toml               # Python dependencies
```

## Architecture
- **Frontend:** Next.js 15 with App Router, TypeScript, and Tailwind CSS v4
- **Development:** Next.js dev server on port 5000
- **Deployment:** Autoscale deployment target for production
- **Package Manager:** npm (detected from package-lock.json)

## Development Workflow
The Next.js development server runs automatically via the "Next.js Dev Server" workflow.
- Access the app through the webview on port 5000
- Hot reload is enabled for instant changes
- Backend is currently minimal but ready for expansion

## Runtime Verification (Migration Complete)

### Development Server
✅ Server successfully boots in 1.9s
✅ Routes compile and serve without critical errors (/ and /favicon.ico verified)
✅ GET requests return 200 status codes
✅ Port 5000 binding confirmed working
⚠️ Cross-origin warnings from Replit iframe environment (expected, non-critical)
⚠️ Hydration mismatch in dev overlay (Next.js internal, does not affect functionality)

### Production Build & Start (Verified)
✅ `npm run build` completes successfully in 10.5s
✅ Optimized production bundle created (107 kB first load)
✅ Linting and type checking passed
✅ Static pages generated (5/5)
✅ `npm run start` launches production server in 1.2s
✅ Production server binds to 0.0.0.0:5000 correctly

## Deployment Configuration
Located in `.replit` file:
- **Target:** autoscale (stateless, scales with traffic)
- **Build:** `cd frontend/bootstrapping-hackathon && npm run build`
- **Run:** `cd frontend/bootstrapping-hackathon && npm run start`
- **Port Mapping:** 5000 (local) → 80 (external)

## User Preferences
None specified yet.
