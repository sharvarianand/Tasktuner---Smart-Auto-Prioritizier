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
      buildNumber: '1.0.0'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/Tasktuner_logo.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.yourcompany.tasktuner',
      versionCode: 1
    },
    web: {
      favicon: './assets/images/Tasktuner_logo.png'
    },
    extra: {
      clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      eas: {
        projectId: 'your-project-id'
      }
    },
    plugins: [
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
