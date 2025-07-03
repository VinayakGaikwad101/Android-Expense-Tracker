import { Platform } from "react-native";

// Access environment variables using process.env
// In Expo, environment variables must be prefixed with EXPO_PUBLIC_
const config = {
  // Use deployed Vercel URL for production, fallback to local for development
  API_URL: process.env.EXPO_PUBLIC_API_URL || Platform.select({
    android: "http://10.0.2.2:5001/api",
    ios: "http://localhost:5001/api",
    default: "http://10.0.2.2:5001/api",
  }),
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
};

console.log("Environment Config - API_URL:", config.API_URL);

export default config;
