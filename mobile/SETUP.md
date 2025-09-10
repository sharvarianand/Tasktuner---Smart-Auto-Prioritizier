# 🚀 TaskTuner Mobile - Setup Guide (Expo SDK 53)

This guide will walk you through setting up the TaskTuner mobile app for development and production deployment using Expo SDK 53.

## 📋 Prerequisites

### Required Software
- **Node.js 18+**: [Download here](https://nodejs.org/)
- **Expo CLI**: `npm install -g @expo/cli`
- **Git**: [Download here](https://git-scm.com/)

### Platform-Specific Requirements

#### For Development (Recommended)
- **Expo Go App**: [Download from App Store](https://apps.apple.com/app/expo-go/id982107779) or [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **Physical Device**: iPhone or Android phone for testing

#### For Custom Development (Optional)
- **Android Studio**: [Download here](https://developer.android.com/studio) (for custom Android builds)
- **Xcode 14+**: [Download from App Store](https://apps.apple.com/us/app/xcode/id497799835) (for custom iOS builds)

### Backend Requirements
- **TaskTuner Backend**: Running on `http://localhost:3001` (or your backend URL)
- **Firebase Project**: For push notifications
- **Clerk.dev Account**: For authentication

## 🔧 Installation Steps

### 1. Clone and Setup Project

```bash
# Clone the repository
git clone <repository-url>
cd mobile

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key

# Backend API Configuration
API_BASE_URL=http://localhost:3001/api

# Firebase Configuration
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id

# Development Configuration
DEBUG=true
LOG_LEVEL=debug
```

### 3. Backend Connection Setup

Ensure your TaskTuner backend is running:

```bash
# In your backend directory
cd ../backend
npm install
npm run dev
```

The backend should be accessible at `http://localhost:3001`

### 4. Firebase Setup (Optional for Push Notifications)

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing TaskTuner project
3. Enable Cloud Messaging
4. Add your app to the project

#### Expo Push Notifications
Expo handles push notifications through their service, so you don't need to configure Firebase manually unless you're using custom native code.

### 5. Clerk Authentication Setup

#### Create Clerk Application
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy the publishable key to your `.env` file
4. Configure OAuth providers (Google, Apple, etc.)

#### Configure Clerk for Expo
1. Add your Expo app bundle ID to Clerk settings
2. Configure redirect URLs for Expo
3. Enable biometric authentication if desired

## 🏃‍♂️ Running the App

### Development Mode

#### Start Expo Development Server
```bash
npm start
# or
expo start
```

#### Run on Device/Simulator
```bash
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

#### Using Expo Go App
1. Install Expo Go on your phone from App Store/Google Play
2. Run `expo start` in your terminal
3. Scan the QR code with your phone's camera (iOS) or Expo Go app (Android)
4. The app will load on your device

### Debugging

#### React Native Debugger
1. Install [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
2. Start the app in debug mode
3. Open React Native Debugger

#### Flipper (Optional)
1. Install [Flipper](https://fbflipper.com/)
2. Start the app
3. Connect Flipper for advanced debugging

## 🔧 Configuration

### API Configuration

Update `src/config/constants.ts`:

```typescript
export const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3001/api' // Android emulator
  : 'https://your-production-api.com/api'; // Production
```

### Theme Configuration

Customize themes in `src/config/constants.ts`:

```typescript
export const THEME_CONFIG = {
  light: {
    primary: '#0ea5e9',
    secondary: '#d946ef',
    // ... other colors
  },
  dark: {
    primary: '#38bdf8',
    secondary: '#e879f9',
    // ... other colors
  },
};
```

### Voice Configuration

Configure voice settings in `src/config/constants.ts`:

```typescript
export const VOICE_CONFIG = {
  defaultRate: 1.0,
  defaultPitch: 1.0,
  defaultVolume: 0.8,
  supportedLanguages: ['en-US', 'en-GB'],
};
```

## 🚀 Building for Production

### EAS Build (Recommended)

#### Install EAS CLI
```bash
npm install -g eas-cli
```

#### Login to Expo
```bash
eas login
```

#### Configure EAS Build
```bash
eas build:configure
```

#### Build for Android
```bash
eas build --platform android
```

#### Build for iOS
```bash
eas build --platform ios
```

### Legacy Build (Custom Development)

#### Android Build
```bash
# Generate keystore (first time only)
keytool -genkey -v -keystore tasktuner-release-key.keystore -alias tasktuner -keyalg RSA -keysize 2048 -validity 10000

# Build release APK
eas build --platform android --local
```

#### iOS Build
```bash
# Build for iOS
eas build --platform ios --local
```

## 📱 Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### Manual Testing Checklist

#### Authentication
- [ ] Sign up with email
- [ ] Sign in with existing account
- [ ] Forgot password flow
- [ ] Biometric authentication (if enabled)

#### Core Features
- [ ] Create new task
- [ ] Edit existing task
- [ ] Mark task as complete
- [ ] Delete task
- [ ] AI prioritization
- [ ] Voice input for tasks

#### Calendar Integration
- [ ] Google Calendar OAuth
- [ ] Create calendar event
- [ ] Sync with Google Calendar
- [ ] View calendar events

#### Notifications
- [ ] Push notification permissions
- [ ] Task reminder notifications
- [ ] Streak reminder notifications
- [ ] Roast notifications

#### Voice Features
- [ ] Speech-to-text input
- [ ] Text-to-speech output
- [ ] Voice settings configuration
- [ ] Roast voice delivery

#### Offline Support
- [ ] App works without internet
- [ ] Tasks sync when connection restored
- [ ] Offline task creation
- [ ] Cached data display

## 🐛 Troubleshooting

### Common Issues

#### Metro bundler cache issues
```bash
npx react-native start --reset-cache
```

#### Android build issues
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

#### iOS build issues
```bash
cd ios
pod install
# Clean build folder in Xcode
```

#### Network connectivity issues
- Check API_BASE_URL in constants
- Verify backend server is running
- Check network permissions in AndroidManifest.xml
- Test with different network (WiFi vs mobile data)

#### Authentication issues
- Verify CLERK_PUBLISHABLE_KEY is correct
- Check Clerk dashboard configuration
- Ensure redirect URLs are properly configured
- Test with different authentication methods

#### Firebase issues
- Verify google-services.json is in correct location
- Check Firebase project configuration
- Ensure Cloud Messaging is enabled
- Verify API keys are correct

### Debug Commands

#### Check React Native version
```bash
npx react-native --version
```

#### Check Android SDK
```bash
adb devices
```

#### Check iOS simulator
```bash
xcrun simctl list devices
```

#### Clear all caches
```bash
npm start -- --reset-cache
cd android && ./gradlew clean && cd ..
cd ios && rm -rf build && cd ..
```

## 📚 Additional Resources

### Documentation
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Clerk.dev Documentation](https://clerk.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Navigation Documentation](https://reactnavigation.org/)

### Community
- [React Native Community](https://github.com/react-native-community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)
- [Discord Server](https://discord.gg/tasktuner)

### Tools
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/)
- [React Native Performance](https://reactnative.dev/docs/performance)

---

## 🆘 Getting Help

If you encounter issues not covered in this guide:

1. **Check the logs**: Look at Metro bundler and device logs
2. **Search existing issues**: Check GitHub issues and Stack Overflow
3. **Join our Discord**: Get help from the community
4. **Create an issue**: Report bugs or request features

**Happy coding! 🚀**
