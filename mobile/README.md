# TaskTuner Mobile (React Native / Expo)

A lightweight mobile client to view prioritized tasks and run a simple focus timer.

## Prerequisites
- Node 18+
- Expo CLI: `npm i -g expo`
- Backend running (defaults to `http://localhost:3001/api`)

## Setup
```bash
cd mobile
npm install
```

Optionally set API base:
```bash
# .env or shell
EXPO_PUBLIC_API_BASE=https://your-backend-host/api
```

## Run
```bash
npm start          # opens Expo dev tools
npm run android    # build/run Android
npm run ios        # build/run iOS (macOS only)
npm run web        # web preview
```

## Screens
- Home: Navigate to Tasks / Focus
- Tasks: Lists prioritized tasks (uses backend /api/tasks with aiPriority)
- Focus: Minimal 25-minute timer

## Next Steps
- Auth (Clerk) integration
- Full Focus Lock parity features
- Task CRUD
- Offline caching
