// import { Pressable, Text, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Stack } from "expo-router";
// import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";

// import SignInWithOAuth from "~/components/SignInWithOAuth";

// export default function Index() {
//   const { signOut } = useAuth();

//   return (
//     <SafeAreaView className=" bg-background">
//       {/* Changes page title visible on the header */}
//       <Stack.Screen options={{ title: "Home Page" }} />
//       <View className="flex h-full w-full items-center justify-center bg-background p-4">
//         <Text className=" text-center text-5xl font-bold text-foreground ">
//           Welcome To FastBreak
//         </Text>
//         <SignedIn>
//           <Text className="text-primary">You are Signed in</Text>
//           <Pressable
//             className="my-2 rounded-md bg-primary p-3"
//             onPress={() => {
//               void signOut();
//             }}
//           >
//             <Text className="text-primary-foreground">Sign Out</Text>
//           </Pressable>
//         </SignedIn>
//         <SignedOut>
//           <View className="pt-4">
//             <SignInWithOAuth />
//           </View>
//         </SignedOut>
//       </View>
//     </SafeAreaView>
//   );
// }

import { ActivityIndicator, View } from "react-native";

const StartPage = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default StartPage;
