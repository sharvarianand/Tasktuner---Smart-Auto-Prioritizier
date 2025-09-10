# 📱 TaskTuner Mobile App

> **AI-powered productivity app that roasts you into action** - Expo SDK 53 Edition

## 📖 Overview

TaskTuner Mobile is the Expo-powered React Native companion to the web application, providing a native mobile experience for the AI-powered productivity platform. Built with Expo SDK 53, it connects to the existing backend APIs and delivers the same intelligent task prioritization, voice roasts, and gamification features optimized for mobile devices.

## ✨ Features

### 🔐 Authentication
- **Clerk Integration**: Seamless sign-in/sign-up with the same account as web
- **Biometric Support**: Face ID / Fingerprint authentication
- **Secure Token Management**: Automatic token refresh and storage

### 📋 Task Management
- **AI-Powered Prioritization**: Smart task ranking using existing backend algorithms
- **Voice Input**: Speech-to-text for quick task creation
- **Smart Categories**: Academic, Personal, Work task organization
- **Due Date Management**: Calendar integration with notifications
- **Task Completion**: Gamified completion with points and streaks

### 🎭 Voice & Engagement
- **AI Roasts**: Sarcastic motivational messages delivered via TTS
- **Voice Settings**: Customizable speech rate, pitch, and volume
- **Context-Aware**: Roasts adapt based on user behavior and task completion

### 📅 Calendar Integration
- **Google Calendar Sync**: OAuth2 authentication and event creation
- **Smart Scheduling**: AI-suggested optimal time slots
- **Event Management**: Create, update, and sync calendar events

### 🎯 Goals & Analytics
- **Goal-Based Task Generation**: AI breaks down goals into actionable tasks
- **Progress Tracking**: Visual progress indicators and milestone tracking
- **Analytics Dashboard**: Completion rates, streaks, and productivity insights
- **Leaderboard**: Social competition and achievement sharing

### 🔔 Notifications
- **Push Notifications**: Firebase Cloud Messaging integration
- **Smart Reminders**: Context-aware task and streak reminders
- **Quiet Hours**: Customizable notification schedules

## 🛠 Technology Stack

### Core Framework
- **Expo SDK 53**: Latest Expo framework for React Native development
- **React Native 0.76.3**: Cross-platform mobile development
- **TypeScript**: Type-safe development
- **NativeWind**: Tailwind CSS for React Native styling

### Navigation & State
- **React Navigation 6**: Bottom tabs and stack navigation
- **TanStack Query**: Server state management and caching
- **React Context**: Local state management

### Authentication & Backend
- **Clerk Expo**: Authentication and user management for Expo
- **Axios**: HTTP client for API communication
- **Expo SecureStore**: Secure local data persistence

### UI & Animations
- **Lucide React Native**: Icon library
- **Moti**: Smooth animations and transitions
- **React Native Reanimated**: Advanced animations

### Voice & Media
- **Expo Speech**: Text-to-speech functionality
- **Expo AV**: Audio playback capabilities
- **Expo Calendar**: Calendar integration

### Notifications & Storage
- **Expo Notifications**: Push notifications
- **Expo AsyncStorage**: Local storage
- **Expo NetInfo**: Network status monitoring

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+**: JavaScript runtime
- **Expo CLI**: `npm install -g @expo/cli`
- **Expo Go App**: For testing on physical devices
- **Android Studio**: For Android development (optional)
- **Xcode**: For iOS development (macOS only, optional)
- **Backend API**: Running TaskTuner backend server

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create `.env` file in the root directory:
   ```env
   # Clerk Configuration
   CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key
   
   # Backend API
   API_BASE_URL=http://localhost:3001/api
   
   # Firebase Configuration
   FIREBASE_API_KEY=your-firebase-api-key
   FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   FIREBASE_APP_ID=your-app-id
   ```

### Running the App

#### Development Mode
```bash
# Start Expo development server
npm start
# or
expo start

# Run on Android
npm run android
# or
expo start --android

# Run on iOS
npm run ios
# or
expo start --ios

# Run on web
npm run web
# or
expo start --web
```

#### Production Build
```bash
# Android
npm run build:android
# or
eas build --platform android

# iOS
npm run build:ios
# or
eas build --platform ios
```

## 📁 Project Structure

```
mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── ui/             # Base UI components (Button, Card, Input)
│   ├── screens/            # Screen components
│   │   ├── auth/           # Authentication screens
│   │   ├── TasksScreen.tsx # Main tasks screen
│   │   ├── CalendarScreen.tsx
│   │   ├── GoalsScreen.tsx
│   │   ├── AnalyticsScreen.tsx
│   │   ├── LeaderboardScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── navigation/         # Navigation configuration
│   ├── services/           # API service layer
│   ├── contexts/           # React contexts
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── config/             # Configuration files
├── android/                # Android-specific code
├── ios/                    # iOS-specific code
├── assets/                 # Images, fonts, and other assets
└── docs/                   # Documentation
```

## 🔌 Backend Integration

The mobile app connects to the existing TaskTuner backend through REST APIs:

### API Endpoints Used
- **Authentication**: `/api/auth/*` - User sign-in/sign-up
- **Tasks**: `/api/tasks/*` - CRUD operations and AI prioritization
- **AI Features**: `/api/ai/*` - Task generation and roast creation
- **Calendar**: `/api/calendar/*` - Google Calendar integration
- **Goals**: `/api/goals/*` - Goal management and task breakdown
- **Analytics**: `/api/analytics/*` - User statistics and insights

### API Service Layer
The app uses a centralized API service (`src/services/api.ts`) that handles:
- Automatic token management
- Request/response interceptors
- Error handling and retry logic
- Offline support and caching

## 🎨 UI/UX Design

### Design System
- **Color Palette**: Consistent with web app branding
- **Typography**: System fonts with proper hierarchy
- **Spacing**: 8px grid system for consistent layouts
- **Components**: Reusable UI components with theme support

### Theme Support
- **Light/Dark Mode**: Automatic system theme detection
- **Custom Themes**: User-customizable color schemes
- **Accessibility**: High contrast and screen reader support

### Animations
- **Smooth Transitions**: Page transitions and state changes
- **Micro-interactions**: Button presses and loading states
- **Gesture Support**: Swipe actions and pull-to-refresh

## 🔔 Push Notifications

### Firebase Cloud Messaging
- **Task Reminders**: Smart notifications for upcoming deadlines
- **Streak Alerts**: Daily motivation and streak maintenance
- **Achievement Notifications**: Unlock notifications and rewards
- **Roast Delivery**: AI-generated motivational messages

### Notification Types
- **Task Reminders**: 15 minutes before scheduled tasks
- **Daily Streaks**: Morning motivation and evening check-ins
- **Weekly Reports**: Productivity summaries and insights
- **Social Features**: Leaderboard updates and friend activities

## 🎤 Voice Features

### Speech-to-Text
- **Task Creation**: Voice input for quick task addition
- **Natural Language**: AI processes voice input for task details
- **Offline Support**: Basic voice recognition without internet

### Text-to-Speech
- **AI Roasts**: Sarcastic motivational messages
- **Task Reminders**: Voice notifications for important tasks
- **Accessibility**: Screen reader support for visually impaired users

### Voice Settings
- **Customizable**: Rate, pitch, volume, and voice selection
- **Language Support**: Multiple language options
- **Quiet Mode**: Disable voice features during quiet hours

## 📊 Analytics & Insights

### User Analytics
- **Completion Rates**: Task completion statistics
- **Streak Tracking**: Daily and weekly streak monitoring
- **Productivity Patterns**: Peak hours and optimal work times
- **Goal Progress**: Visual progress tracking for long-term goals

### AI Insights
- **Priority Recommendations**: AI-suggested task ordering
- **Time Optimization**: Best times for different task types
- **Habit Analysis**: User behavior pattern recognition
- **Personalized Suggestions**: Custom productivity recommendations

## 🔒 Security & Privacy

### Data Protection
- **Encrypted Storage**: Sensitive data encrypted locally
- **Secure Communication**: HTTPS for all API calls
- **Token Management**: Automatic token refresh and secure storage
- **Privacy Controls**: User control over data sharing and analytics

### Authentication Security
- **Multi-factor Authentication**: Optional 2FA support
- **Biometric Authentication**: Face ID / Fingerprint login
- **Session Management**: Automatic logout on security events
- **Device Trust**: Trusted device management

## 🚀 Deployment

### Android
1. **Generate Signed APK**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

2. **Upload to Google Play Store**
   - Create developer account
   - Upload APK/AAB file
   - Configure store listing
   - Submit for review

### iOS
1. **Archive for App Store**
   ```bash
   cd ios
   xcodebuild -workspace TaskTuner.xcworkspace -scheme TaskTuner -configuration Release -destination generic/platform=iOS -archivePath TaskTuner.xcarchive archive
   ```

2. **Upload to App Store Connect**
   - Create app in App Store Connect
   - Upload archive via Xcode or Application Loader
   - Configure app metadata
   - Submit for review

### Over-the-Air Updates
- **CodePush**: Microsoft CodePush for instant updates
- **Feature Flags**: Remote feature toggling
- **A/B Testing**: User experience optimization

## 🧪 Testing

### Unit Testing
```bash
npm test
```

### Integration Testing
```bash
npm run test:integration
```

### E2E Testing
```bash
npm run test:e2e
```

### Manual Testing Checklist
- [ ] Authentication flow (sign-in/sign-up)
- [ ] Task CRUD operations
- [ ] AI prioritization
- [ ] Voice input/output
- [ ] Calendar integration
- [ ] Push notifications
- [ ] Offline functionality
- [ ] Theme switching
- [ ] Navigation flow

## 🐛 Troubleshooting

### Common Issues

#### Metro bundler issues
```bash
npx react-native start --reset-cache
```

#### Android build issues
```bash
cd android && ./gradlew clean && cd ..
```

#### iOS build issues
```bash
cd ios && pod install && cd ..
```

#### Network connectivity
- Check API_BASE_URL configuration
- Verify backend server is running
- Check network permissions in app

### Debug Mode
- Enable React Native debugger
- Use Flipper for advanced debugging
- Check console logs for API errors

## 📈 Performance Optimization

### Bundle Size
- **Code Splitting**: Lazy load screens and components
- **Tree Shaking**: Remove unused code
- **Image Optimization**: Compress and resize images
- **Font Optimization**: Use system fonts where possible

### Runtime Performance
- **FlatList Optimization**: Virtualized lists for large datasets
- **Image Caching**: Efficient image loading and caching
- **Memory Management**: Proper cleanup of resources
- **Background Processing**: Efficient background tasks

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TaskTuner Web Team**: For the existing backend and design system
- **React Native Community**: For excellent documentation and tools
- **Clerk.dev**: For seamless authentication
- **Firebase**: For backend services and notifications

## 📞 Support

- **Email**: support@tasktuner.app
- **Discord**: [Join our community](https://discord.gg/tasktuner)
- **Documentation**: [docs.tasktuner.app](https://docs.tasktuner.app)

---

**Made with ❤️ and a lot of sass by the TaskTuner Team**

*Let's tune tasks and turn heads — one roast at a time.*
