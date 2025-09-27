const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for SVG files
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

// Exclude backend directory from bundling
config.resolver.blockList = [
  /backend\/.*/,
  /\.\.\/backend\/.*/,
];

// Ensure we only watch the mobile directory and its subdirectories
config.watchFolders = [__dirname];

// Add resolver configuration to prevent caching issues
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Reset cache more aggressively for development
config.resetCache = true;

module.exports = config;