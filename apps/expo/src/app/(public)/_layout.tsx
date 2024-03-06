import React from "react";
import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";

const PublicLayout = () => {
  const { colorScheme } = useColorScheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f472b6",
        },
        contentStyle: {
          backgroundColor: colorScheme == "dark" ? "#0c0d33" : "#FFFFFF",
        },
        // headerShown: process.env.NODE_ENV === "development" ? true : false,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          headerTitle: "Clerk Auth App",
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="register"
        options={{
          headerTitle: "Create Account",
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="reset"
        options={{
          headerTitle: "Reset Password",
        }}
      ></Stack.Screen>
    </Stack>
  );
};

export default PublicLayout;
