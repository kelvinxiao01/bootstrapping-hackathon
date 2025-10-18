# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a monorepo with separate frontend and backend:

- **Frontend**: Next.js 15.5.6 with React 19, TypeScript, and Tailwind CSS v4
  - Located in `frontend/bootstrapping-hackathon/`
  - Uses App Router architecture
  - Path alias: `@/*` maps to project root

- **Backend**: Python 3.13+ project
  - Located in `backend/`
  - Uses `pyproject.toml` for dependency management
  - Currently minimal implementation

## Development Commands

### Frontend (run from `frontend/bootstrapping-hackathon/`)

```bash
# Start development server with Turbopack
npm run dev

# Production build with Turbopack
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Backend (run from `backend/`)

```bash
# Run the backend application
python main.py
```

## Key Technologies

- **Frontend**: Next.js 15 with Turbopack, React 19, TypeScript 5, Tailwind CSS 4, ESLint 9
- **Backend**: Python 3.13
- **Fonts**: Uses Geist and Geist Mono from Google Fonts

## Important Notes

- Frontend uses Turbopack for both dev and build (via `--turbopack` flag)
- TypeScript strict mode is enabled
- Path imports use `@/` prefix to reference files from the project root
