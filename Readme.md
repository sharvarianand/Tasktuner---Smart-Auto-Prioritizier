# 🎯 TaskTuner - Smart Auto-Prioritizer

> **The AI-powered productivity app that roasts you into action**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-green)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9-orange)](https://firebase.google.com/)

## 📖 Overview

TaskTuner is a **Smart Auto-Prioritizer** that goes beyond just organizing tasks - it ensures you actually complete them. We address the critical problem of professionals wasting time managing tasks manually, missing critical deadlines and priorities due to limited context and static tools. Our AI-assisted productivity tool accepts input via text or voice, auto-prioritizes tasks using deadlines and importance, and syncs intelligently with calendars for optimized daily execution.

### 🎯 The Problem

- **Professionals waste time managing tasks manually** - leading to missed deadlines and poor prioritization
- **Limited context and static tools** - traditional productivity apps don't understand task urgency or impact
- **Manual task management** - users spend more time organizing than executing
- **Lack of intelligent prioritization** - no AI-based ranking algorithm to sort tasks by urgency and impact
- **Poor calendar integration** - tasks don't automatically sync with daily schedules
- **Lack of motivation and engagement** - even well-prioritized tasks often go uncompleted due to boring, robotic reminders

### 💡 The Solution

TaskTuner is a **Smart Auto-Prioritizer** that combines AI-powered task management with intelligent calendar integration AND engaging execution features. Our solution provides:

- **Smart task input** (text or voice) to auto-detect priority, time, and type
- **AI-based ranking algorithm** to sort tasks by urgency and impact
- **Google Calendar integration** to auto-slot tasks for optimized daily execution
- **Intelligent dashboard** for tracking progress, priority buckets, and upcoming deadlines
- **Goal-based task generation** - Define goals (e.g., "Crack GATE 2026"), and TaskTuner generates tasks and subtasks using NLP
- **GenZ-style engagement** - Voice roasts and humor that keep you motivated to actually complete tasks

## ✨ Key Features

### 🤖 Smart Auto-Prioritization
- **AI-Powered Task Analysis**: Uses NLP to automatically detect priority, deadlines, and task type from natural language input
- **Intelligent Ranking Algorithm**: Sorts tasks by urgency and impact using advanced AI models
- **Context-Aware Prioritization**: Considers user history, workload, and external factors for optimal task ordering
- **Smart Scheduling**: Automatically syncs with Google Calendar to suggest optimal task slots

### 🎭 Voice & Text Input
- **Smart Voice Input**: Natural language processing for voice-to-task conversion
- **Text Input Intelligence**: Auto-detects priority, deadlines, and task type from written input
- **Context-Aware Processing**: Understands task context, dependencies, and user preferences
- **Multi-Modal Input**: Support for both voice and text input with seamless switching

### 🎭 GenZ-Style Engagement
- **AI Voice Roasts**: Text-to-speech alerts that call out your procrastination with brutal honesty
  > *"You've moved 'Start Assignment' for the third time. Grow up."*
- **Dynamic Emotional Tones**: Roasts delivered with varied moods — sarcastic, disappointed, empathetic — based on user context
- **Context-Aware Roasting**: Integrates mood tracking, user history, even noise levels to fine-tune roast style and intensity

### 🎮 Gamified Productivity
- **Points System**: Earn points for task completion and maintaining streaks
- **Unlockable Content**: Roast packs and voice styles as rewards
- **Daily Streak Challenges**: Maintain momentum with daily challenges
- **Leaderboard**: Compete with friends and stay motivated

### 📊 Intelligent Dashboard
- **Progress Tracking**: Real-time visualization of task completion and productivity metrics
- **Priority Buckets**: Automatic categorization of tasks by urgency and importance
- **Upcoming Deadlines**: Smart alerts and notifications for critical deadlines
- **Calendar Integration**: Seamless sync with Google Calendar for optimized scheduling

### 🎨 User Experience
- **Drag-and-Drop Interface**: AI suggests priorities, but users can override via intuitive UI
- **Responsive Design**: Works seamlessly across all devices
- **Real-time Sync**: Your tasks and progress sync across all devices
- **Smart Notifications**: Context-aware reminders and alerts

## 🛠 Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **Framer Motion** - Smooth animations and transitions

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Firebase** – Realtime Database and backend infrastructure
- **Clerk.dev** – Authentication and user management
- **OpenAI API** - AI-powered task understanding and roast generation

### Integrations
- **Google Calendar API** - Intelligent calendar integration and auto-slotting
- **Web Speech API** - Voice input processing and text-to-speech
- **Firebase Auth** - User authentication and management
- **OpenAI API** - Advanced NLP for task understanding and prioritization

### Deployment
- **Vercel** - Frontend deployment
- **Render** - Backend deployment
- **Firebase Hosting** - Static file hosting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account
- Clerk.dev account and API keys
- OpenAI API key
- Google Calendar API credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sharvarianand/Tasktuner---Smart-Auto-Prioritizer.git
   cd tasktuner
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Frontend (.env.local)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY=your_google_api_key

   # Backend (.env)
   PORT=3001
   OPENAI_API_KEY=your_openai_api_key
   FIREBASE_SERVICE_ACCOUNT_KEY=your_service_account_key
   ```

4. **Start the development servers**
   ```bash
   # Start frontend (port 3000)
   cd frontend
   npm run dev

   # Start backend (port 3001)
   cd ../backend
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
tasktuner/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages and layouts
│   ├── components/          # Reusable React components
│   ├── lib/                 # Utility functions and configurations
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   └── public/              # Static assets
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   └── tests/               # Backend tests
├── docs/                    # Documentation
├── .github/                 # GitHub workflows and templates
└── README.md               # This file
```

## 🎯 Core Features in Detail

### Smart Auto-Prioritization Engine
- **NLP Analysis**: Understands task context, deadlines, and importance from natural language
- **Intelligent Ranking**: AI-based algorithm that considers urgency, impact, and user context
- **Dependency Mapping**: Identifies task dependencies and suggests optimal execution order
- **Context-Aware Processing**: Adapts prioritization based on user workload and preferences
- **Goal-Based Task Generation**: Define goals (e.g., "Crack GATE 2026"), and TaskTuner generates tasks and subtasks using NLP

### Voice & Text Input Processing
- **Natural Language Understanding**: Processes voice and text input to extract task details
- **Auto-Detection**: Automatically identifies priority, deadlines, and task type
- **Multi-Modal Support**: Seamless switching between voice and text input
- **Context Preservation**: Maintains conversation context for better task understanding

### GenZ Engagement & Gamification
- **Voice Roast Engine**: AI generates personalized roasts based on user behavior and task completion patterns
- **Emotional Intelligence**: Adapts tone based on user mood, history, and current workload
- **Gamification System**: Points, streaks, and unlockable content to maintain engagement
- **Social Features**: Share achievements and compete with friends for motivation

### Intelligent Dashboard & Analytics
- **Real-time Progress Tracking**: Visual metrics for productivity and task completion
- **Priority Bucket Management**: Automatic categorization and organization of tasks
- **Smart Notifications**: Context-aware alerts for deadlines and important tasks
- **Calendar Integration**: Seamless sync with Google Calendar for optimized scheduling

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Tasks
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/complete` - Mark task as complete

### AI Features
- `POST /api/ai/prioritize` - AI task prioritization and ranking
- `POST /api/ai/process-input` - Process voice and text input
- `POST /api/ai/generate-tasks` - Generate tasks from goals
- `POST /api/ai/analyze-context` - Analyze task context and dependencies
- `POST /api/ai/generate-roast` - Generate contextual roasts for motivation

### Calendar Integration
- `GET /api/calendar/events` - Get calendar events
- `POST /api/calendar/schedule` - Schedule task in calendar

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm run test

# Run all tests
npm run test:all
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Render)
```bash
cd backend
npm run build
# Deploy to Render dashboard
```

## 📈 Roadmap

### Phase 1: MVP (Current)
- [x] Smart task input (text and voice)
- [x] AI-based ranking algorithm
- [x] Google Calendar integration
- [x] Intelligent dashboard
- [x] User authentication
- [x] Goal-based task generation
- [x] Voice roast engine

### Phase 2: Enhanced Features
- [ ] Advanced NLP features (NER, SRL, Sentiment Analysis)
- [ ] Multi-criteria task prioritization (TOPSIS)
- [ ] Outlook Calendar integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Enhanced gamification system

### Phase 3: B2B Expansion
- [ ] Enterprise task management
- [ ] Team collaboration features
- [ ] Department-level analytics
- [ ] Advanced team prioritization
- [ ] Corporate wellness features

### Phase 4: AI Enhancement
- [ ] Predictive task scheduling
- [ ] Context-aware prioritization
- [ ] Personalized productivity insights
- [ ] Advanced voice processing
- [ ] Emotional intelligence enhancement

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the AI capabilities
- **Firebase** for backend infrastructure
- **Vercel** for frontend hosting
- **Tailwind CSS** for the beautiful UI components
- **The GenZ community** for inspiration on the roast humor

## 📞 Support

- **Email**: support@tasktuner.app
- **Discord**: [Join our community](https://discord.gg/tasktuner)
- **Twitter**: [@TaskTunerApp](https://twitter.com/TaskTunerApp)
- **Documentation**: [docs.tasktuner.app](https://docs.tasktuner.app)

## 🎯 Mission Statement

> *"Let's be real: productivity apps are painfully boring. We made TaskTuner to fix that. It's like a sarcastic life coach in your pocket—using AI to schedule your tasks and roast you into action. Because sometimes, shame is the best motivator."*

TaskTuner is more than a Smart Auto-Prioritizer. It's an intelligent assistant that understands your workload, automatically prioritizes your tasks, generates tasks from your goals, and uses GenZ humor to ensure you actually complete them. Because prioritization is just the first step - execution is everything.

---

**Made with ❤️ and a lot of sass by Sharvari Bhondekar**

*Let's tune tasks and turn heads — one roast at a time.* 