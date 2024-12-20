import { Slot, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { TRPCProvider } from "~/utils/api";

import "../styles.css";

import React, { useEffect } from "react";
import Constants from "expo-constants";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";

// import { useColorScheme } from "nativewind";

import { tokenCache } from "~/utils/StoreLoginInfo";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  // const { colorScheme } = useColorScheme();

  return (
    <ClerkProvider
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      publishableKey={Constants.expoConfig?.extra?.clerkPublishableKey}
      tokenCache={tokenCache}
    >
      <TRPCProvider>
        {/*
          The Stack component displays the current page.
          It also allows you to configure your screens 
        */}
        {/* <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#f472b6",
            },
            contentStyle: {
              backgroundColor: colorScheme == "dark" ? "#09090B" : "#FFFFFF",
            },
            // headerShown: process.env.NODE_ENV === "development" ? true : false,
            headerShown: false,
          }}
        /> */}
        <Init />
        <StatusBar />
      </TRPCProvider>
    </ClerkProvider>
  );
}

const Init = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isLoaded) return;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (isSignedIn) {
      router.push(`/Dashboard`);
    } else {
      router.push(`/login`);
    }
  }, [isSignedIn]);

  return <Slot />;
};
