import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { api } from "~/utils/api";

export default function Index() {
  const utils = api.useUtils();

  const { data, isLoading, isError } = api.test.all.useQuery();

  return (
    <SafeAreaView className=" bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="h-full w-full bg-background p-4">
        <Text className="pb-2 text-center text-5xl font-bold text-foreground">
          Create <Text className="text-primary">T3</Text> Turbo
        </Text>

        <Pressable
          onPress={() => void utils.post.all.invalidate()}
          className="flex items-center rounded-lg bg-primary p-2"
        >
          <Text className="text-foreground"> Refresh posts</Text>
        </Pressable>

        <View className="py-2">
          <Text className="font-semibold italic text-primary">
            Press on a post
          </Text>
        </View>
        {/* <CreatePost /> */}
        <View>
          <Text className="text-foreground">Posts</Text>
          {isLoading && <Text className="text-primary">Loading...</Text>}
          {isError && <Text className="text-primary">Error: {isError}</Text>}
          {data && (
            <View>
              <Text className="text-primary">{data}</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
