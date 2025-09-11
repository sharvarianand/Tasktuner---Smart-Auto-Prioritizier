# 🎯 TaskTuner – Smart Auto‑Prioritizer

> The AI‑powered productivity app that roasts you into action.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/) [![Node.js](https://img.shields.io/badge/Node.js-18-green)](https://nodejs.org/) [![Firebase](https://img.shields.io/badge/Firebase-9-orange)](https://firebase.google.com/)

## Overview
TaskTuner turns tasks into execution. Add tasks via text or voice, let AI auto‑prioritize and schedule them, then stay focused with a distraction‑free Focus Mode and roast‑powered motivation.

## Key Features
- **AI prioritization**: NLP extracts deadlines/importance and ranks tasks.
- **Calendar sync**: Auto‑slot tasks with Google Calendar.
- **Voice & text input**: Seamless capture with TTS/ASR support.
- **Gen‑Z roasts**: Context‑aware voice roasts to keep you moving.
- **Dashboard & analytics**: Progress, priority buckets, upcoming deadlines.
- **Focus Mode**: Minimal workspace with timers, ambient sound, and smart breaks.

## Tech Stack
- **Frontend**: React 18 + Vite, TypeScript, Tailwind, Framer Motion
- **Backend**: Node.js, Express
- **Infra**: Firebase, OpenAI API, Google Calendar API, Clerk (auth)

## Quick Start
1) Clone and install
```bash
git clone https://github.com/sharvarianand/Tasktuner---Smart-Auto-Prioritizer.git
cd "Tasktuner - Smart Auto Prioritizer"

cd frontend && npm install
cd ../backend && npm install
```

2) Env vars
```bash
# frontend/.env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_OPENAI_API_KEY=...
VITE_GOOGLE_CALENDAR_API_KEY=...

# backend/.env
PORT=3001
OPENAI_API_KEY=...
FIREBASE_SERVICE_ACCOUNT_KEY=...
```

3) Run
```bash
# Frontend (Vite default: http://localhost:5173)
cd frontend && npm run dev

# Backend (http://localhost:3001)
cd ../backend && npm run dev
```

## Focus Mode
Stay in flow while executing prioritized tasks. Includes session timer, subtle animations, optional ambient audio, and roast nudges when you drift.

## Deployment
- Frontend: Netlify or Vercel (build in `frontend`)
- Backend: Render (deploy `backend`)

## License
MIT — see `LICENSE`.

## Links
- Docs: `docs.tasktuner.app`
- Support: `support@tasktuner.app`
- Twitter: `@TaskTunerApp`

