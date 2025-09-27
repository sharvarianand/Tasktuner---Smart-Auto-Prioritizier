# 🔧 Expo Go Troubleshooting Guide

## If "Failed to Download Remote Update" Error Persists

### 1. Force Close and Restart Expo Go
- **Android**: Close Expo Go completely from recent apps
- **iOS**: Double-tap home button, swipe up on Expo Go
- Reopen Expo Go and scan QR code again

### 2. Clear Expo Go Cache
- **Android**: Go to Settings > Apps > Expo Go > Storage > Clear Cache
- **iOS**: Uninstall and reinstall Expo Go app

### 3. Check Network Connection
- Ensure your phone and computer are on the same WiFi network
- Try switching to mobile data and back to WiFi
- Disable VPN if active

### 4. Use Development Build (Alternative)
If Expo Go continues to have issues:
```bash
cd mobile
npx expo run:android
# or
npx expo run:ios
```

### 5. Try Tunnel Mode (If Local Doesn't Work)
```bash
cd mobile
npx expo start --tunnel --clear
```

### 6. Restart Development Server
```bash
# Stop current server (Ctrl+C)
cd mobile
npx expo start --clear --localhost
```

### 7. Reset Everything (Nuclear Option)
```bash
cd mobile
rm -rf node_modules
npm install
npx expo install --fix
npx expo start --clear
```

## Common Causes and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `java.io.IOException` | Cache corruption | Clear all caches |
| `Network request failed` | WiFi/network issues | Check network connectivity |
| `Bundle download failed` | Metro bundler issues | Restart with `--clear` |
| `Update download timeout` | Slow connection | Use `--localhost` or `--tunnel` |

## Debug Information

Check the Expo development server logs for:
- Bundle build errors
- Network connectivity issues
- Cache-related warnings

## Still Having Issues?

1. Check Expo CLI version: `npx expo --version`
2. Update if needed: `npm install -g @expo/cli@latest`
3. Try creating a minimal test project to isolate the issue