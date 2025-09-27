export default {
  expo: {
    name: 'tasktuner-mobile',
    slug: 'tasktuner-mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/Tasktuner_logo.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/images/Tasktuner_logo.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.yourcompany.tasktuner',
      buildNumber: '1.0.0',
      newArchEnabled: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/Tasktuner_logo.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.yourcompany.tasktuner',
      versionCode: 1,
      newArchEnabled: true
    },
    web: {
      favicon: './assets/images/Tasktuner_logo.png',
      bundler: 'metro',
      output: 'static'
    },
    extra: {
      clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
      eas: {
        projectId: 'your-project-id'
      }
    },
    updates: {
      enabled: false,
      checkAutomatically: 'NEVER',
      fallbackToCacheTimeout: 0,
      url: null
    },
    scheme: 'tasktuner',
    plugins: [
      'expo-font',
      'expo-router',
      'expo-secure-store',
      'expo-web-browser',
      [
        'expo-notifications',
        {
          icon: './assets/images/Tasktuner_logo.png',
          color: '#ffffff',
          sounds: []
        }
      ]
    ]
  }
};
