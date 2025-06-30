import { Platform } from "react-native";

// Access environment variables using process.env
// In Expo, environment variables must be prefixed with EXPO_PUBLIC_
const config = {
  // For Android Emulator, use 10.0.2.2 instead of localhost
  // For iOS Simulator, use localhost
  // For physical device, use your computer's IP address (e.g., 192.168.1.100)
  API_URL: Platform.select({
    android: "http://10.0.2.2:5001/api",
    ios: process.env.EXPO_PUBLIC_API_URL || "http://localhost:5001/api",
    default: process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:5001/api",
  }),
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
};

console.log("Environment Config - API_URL:", config.API_URL);

export default config;
