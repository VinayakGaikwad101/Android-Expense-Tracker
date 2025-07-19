import SafeScreen from "@/components/SafeScreen";
import { ClerkProvider } from "@clerk/clerk-expo";
import { Slot } from "expo-router";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import config from "@/config/env";

export default function RootLayout() {
  return (
    <SafeScreen>
      <ClerkProvider 
        tokenCache={tokenCache}
        publishableKey={config.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
        <Slot />
      </ClerkProvider>
    </SafeScreen>
  );
}
