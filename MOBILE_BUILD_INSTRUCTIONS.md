# 📱 TaskTuner Mobile App - Build Instructions

## ✅ Setup Complete!

Your mobile app development environment is ready. The Expo server has been configured and tested.

---

## 🚀 **Running the Mobile App**

### **Option 1: Development with Expo Go (Recommended for Testing)**

1. **Start the Expo development server:**
   ```bash
   cd mobile
   npm start
   ```

2. **Test on your device:**
   - **Android**: Install [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) from Play Store
   - **iOS**: Install [Expo Go](https://apps.apple.com/app/expo-go/id982107779) from App Store
   - Scan the QR code that appears in your terminal

3. **Test in emulator/simulator:**
   - Press `a` to open Android emulator
   - Press `i` to open iOS simulator (Mac only)
   - Press `w` to open in web browser

### **Option 2: Build APK for Android Testing**

Build a standalone APK that can be shared and installed on Android devices:

```bash
cd mobile
npx expo build:android -t apk
```

Or using EAS Build (recommended):

```bash
# Install EAS CLI (if not already installed)
npm install -g eas-cli

# Login to Expo account
eas login

# Configure EAS
eas build:configure

# Build Android APK
eas build --platform android --profile preview
```

The build will be created in the cloud and you'll get a download link.

### **Option 3: Development Build (For Advanced Features)**

If you need features not supported by Expo Go (like custom native modules):

```bash
cd mobile

# Build development client for Android
npx expo run:android

# Build development client for iOS (Mac only)
npx expo run:ios
```

---

## 📦 **Build Profiles (from eas.json)**

### **1. Development Build**
```bash
eas build --profile development --platform android
```
- Development client enabled
- Internal distribution
- Best for development and testing

### **2. Preview Build (APK)**
```bash
eas build --profile preview --platform android
```
- Creates an APK file
- Internal distribution
- Easy to share and test on devices
- **Recommended for stakeholder demos**

### **3. Production Build (AAB)**
```bash
eas build --profile production --platform android
```
- Creates Android App Bundle (AAB)
- Required for Google Play Store
- Optimized for production

---

## 🔧 **Update Dependencies (Recommended)**

The terminal showed some package version mismatches. Update them:

```bash
cd mobile
npx expo install expo@latest expo-device expo-font expo-notifications expo-router expo-web-browser
```

---

## 📱 **Current Configuration**

### **Environment Variables** (.env)
- ✅ **EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY**: Configured with frontend key
- ✅ **EXPO_PUBLIC_API_BASE_URL**: Set to `http://10.0.2.2:3001/api` (Android emulator)

### **Backend Connection**
- **Android Emulator**: `http://10.0.2.2:3001/api`
- **iOS Simulator**: `http://127.0.0.1:3001/api`
- **Physical Device**: Update .env to `http://10.252.103.176:3001/api`

### **App Configuration**
- **Package**: `com.yourcompany.tasktuner`
- **Version**: 1.0.0
- **Expo SDK**: 54.0.10
- **React Native**: 0.81.4

---

## 🎯 **Quick Start Guide**

### **For Immediate Testing:**

1. **Start Backend Server** (in separate terminal):
   ```bash
   cd backend
   npm start
   ```

2. **Start Mobile App**:
   ```bash
   cd mobile
   npm start
   ```

3. **Scan QR Code** with Expo Go app on your phone

### **For Building Installable APK:**

```bash
cd mobile

# Method 1: EAS Build (Cloud-based, recommended)
eas build --platform android --profile preview

# Method 2: Local Build (requires Android Studio)
npx expo run:android --variant release
```

---

## 🔍 **Troubleshooting**

### **If backend connection fails:**
1. Make sure backend is running on `http://localhost:3001`
2. For physical devices, update `.env`:
   ```
   EXPO_PUBLIC_API_BASE_URL=http://YOUR_COMPUTER_IP:3001/api
   ```
   Replace `YOUR_COMPUTER_IP` with your local IP (e.g., 192.168.1.100)

### **If Expo Go shows errors:**
1. Clear cache: Press `Shift + M` → Clear bundler cache
2. Restart server: `npm start --clear`

### **If build fails:**
1. Update packages: `npx expo install --fix`
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Check `android/` folder exists

---

## 📚 **Additional Resources**

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Guide](https://docs.expo.dev/build/introduction/)
- [React Native Documentation](https://reactnative.dev/)
- Mobile App Setup: `mobile/SETUP.md`
- API Integration: `mobile/API_INTEGRATION.md`

---

## 🎉 **You're All Set!**

Your TaskTuner mobile app is ready to build and test! 

**Next Steps:**
1. Start the development server: `npm start`
2. Test on your device with Expo Go
3. When ready, build an APK: `eas build --platform android --profile preview`

For production deployment to Google Play Store, use:
```bash
eas build --platform android --profile production
eas submit --platform android
```
