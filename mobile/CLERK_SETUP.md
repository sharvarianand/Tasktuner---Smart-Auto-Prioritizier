# 🔐 Clerk Authentication Setup for TaskTuner Mobile

## Quick Setup Guide

### 1. Create Clerk Account
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Choose "React Native" as your platform

### 2. Get Your Publishable Key
1. In your Clerk dashboard, go to "API Keys"
2. Copy the **Publishable Key** (starts with `pk_test_` for development)

### 3. Configure Environment Variables
1. Copy `.env.example` to `.env` in the mobile directory
2. Replace the placeholder with your actual Clerk key:
   ```env
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-actual-key-here
   ```

### 4. Configure Clerk Settings
1. In Clerk dashboard, go to "Sessions"
2. Set session timeout as desired
3. Go to "Social Connections" to enable OAuth providers (Google, Apple, etc.)

### 5. Test Authentication
1. Restart your Expo development server
2. Try the "Start Getting Roasted" button
3. You should see the Clerk authentication screen

## Troubleshooting

### Button doesn't redirect to auth
- Check that your Clerk key starts with `pk_test_` or `pk_live_`
- Restart the Expo dev server after changing environment variables
- Check the console logs for Clerk configuration status

### Authentication screen not loading
- Verify your Clerk key is correct
- Check network connectivity
- Ensure Clerk application is properly configured

### Development vs Production
- Use `pk_test_` keys for development
- Use `pk_live_` keys for production
- Update the key in your deployment environment variables

## Next Steps

Once Clerk is configured, the "Start Getting Roasted" button will:
1. Redirect users to the Clerk authentication screen
2. Handle sign-in/sign-up flows
3. Navigate authenticated users to the main app
4. Provide access to personalized features and roasts

For more details, see the [Clerk React Native Documentation](https://clerk.com/docs/quickstarts/react-native).