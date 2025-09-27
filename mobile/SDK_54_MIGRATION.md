# Expo SDK 54 Migration Guide

## Overview
This document outlines the changes made to upgrade TaskTuner Mobile from Expo SDK 53 to SDK 54.

## Key Changes

### 1. Updated Dependencies
- **Expo SDK**: `~53.0.0` → `~54.0.0`
- **Node.js Requirement**: `>=18` → `>=20` (Node 18 reached end-of-life)
- **New Architecture**: Enabled by default in SDK 54

### 2. Updated Expo Packages
All Expo packages have been updated to their SDK 54 compatible versions:

- `expo-auth-session`: `~6.2.1` → `~6.3.0`
- `expo-av`: `~15.1.7` → `~15.2.0`
- `expo-calendar`: `~14.1.4` → `~14.2.0`
- `expo-constants`: `~17.1.7` → `~17.2.0`
- `expo-device`: `~7.1.4` → `~7.2.0`
- `expo-font`: `~13.3.2` → `~13.4.0`
- `expo-linking`: `~7.1.7` → `~7.2.0`
- `expo-notifications`: `~0.31.4` → `~0.32.0`
- `expo-router`: `~5.1.5` → `~5.2.0`
- `expo-secure-store`: `~14.2.4` → `~14.3.0`
- `expo-speech`: `~13.1.7` → `~13.2.0`
- `expo-splash-screen`: `~0.30.10` → `~0.31.0`
- `expo-status-bar`: `~2.2.3` → `~2.3.0`
- `expo-system-ui`: `~5.0.11` → `~5.1.0`
- `expo-web-browser`: `~14.2.0` → `~14.3.0`

### 3. Updated React Native Packages
- `react-native-gesture-handler`: `~2.24.0` → `~2.25.0`
- `react-native-reanimated`: `~3.17.4` → `~3.18.0`
- `react-native-screens`: `~4.11.1` → `~4.12.0`

### 4. Updated Dev Dependencies
- `jest-expo`: `~52.0.0` → `~53.0.0`

### 5. New Architecture Configuration
Added `newArchEnabled: true` to both iOS and Android configurations in:
- `app.json`
- `app.config.js`

## Migration Steps

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Clear Cache and Reinstall
```bash
npx expo install --fix
```

### 3. Update Native Projects (if applicable)
If you have generated native projects, delete the `android` and `ios` directories:
```bash
rm -rf android ios
```

### 4. Install CocoaPods (iOS)
```bash
npx pod-install
```

### 5. Run Expo Doctor
```bash
npx expo-doctor@latest
```

## Breaking Changes to Watch For

### 1. New Architecture
- The New Architecture is now enabled by default
- Some third-party libraries may not be compatible yet
- If you encounter issues, you can temporarily disable it by setting `newArchEnabled: false`

### 2. Node.js Version
- Ensure you're using Node.js 20 or newer
- Update your CI/CD pipelines accordingly

### 3. React Native 0.79
- SDK 54 includes React Native 0.79
- Review the [React Native 0.79 changelog](https://github.com/facebook/react-native/releases/tag/v0.79.0) for any breaking changes

## Known Issues and Fixes

### Theme Loading Error
**Issue**: `Error loading theme: SyntaxError: Unexpected token 'l', "light" is not valid JSON`

**Cause**: Corrupted theme data in AsyncStorage from previous versions

**Fix**: The ThemeContext has been updated to handle legacy theme formats gracefully:
- Detects and converts legacy string formats (`"light"`, `"dark"`, `"system"`)
- Validates JSON structure before parsing
- Automatically clears corrupted data
- Provides utility functions for debugging

**Debug Tools**: 
- Use `ThemeDebugger` component in development mode
- Call `debugThemeStorage()` to inspect storage contents
- Use `clearThemeStorage()` to reset theme data

## Testing Checklist

- [ ] App builds successfully
- [ ] All screens render correctly
- [ ] Navigation works properly
- [ ] Theme switching works correctly
- [ ] Voice features function correctly
- [ ] Calendar integration works
- [ ] Notifications are received
- [ ] Authentication flows work
- [ ] API calls are successful

## Rollback Plan

If you encounter critical issues, you can rollback by:

1. Reverting the `package.json` changes
2. Setting `newArchEnabled: false` in app configs
3. Running `npm install` to restore previous versions

## Support

For issues related to SDK 54 migration:
- Check the [Expo SDK 54 release notes](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough)
- Review the [React Native 0.79 changelog](https://github.com/facebook/react-native/releases/tag/v0.79.0)
- Use `npx expo-doctor@latest` to identify potential issues
