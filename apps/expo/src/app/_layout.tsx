import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { TRPCProvider } from "~/utils/api";

import "../styles.css";

import React from "react";
import Constants from "expo-constants";
import { ClerkProvider } from "@clerk/clerk-expo";
import { useColorScheme } from "nativewind";

import { tokenCache } from "~/utils/StoreLoginInfo";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme } = useColorScheme();

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
        <Stack
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
        />
        <StatusBar />
      </TRPCProvider>
    </ClerkProvider>
  );
}
