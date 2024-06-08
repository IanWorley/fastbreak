import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  return (
    <SafeAreaView className="">
      <View className="p-16">
        <Text className="text-center text-5xl font-bold text-foreground">
          Welcome To FastBreak
        </Text>
      </View>

      <View className="flex flex-col justify-center p-10">
        <Text className="text-primary">Login</Text>
        <TextInput
          placeholder="Gavin@Hooli.com"
          className="bg-secondary p-4 text-primary placeholder:text-slate-400"
        ></TextInput>
        <Text className="text-primary"> Password</Text>
        <TextInput
          className="bg-secondary p-4 text-primary placeholder:text-slate-400"
          secureTextEntry={true}
        ></TextInput>
        <Pressable>
          <Text className="text-primary">Forgot Password?</Text>
        </Pressable>
      </View>
      <View className="flex flex-row justify-evenly p-10">
        <Pressable>
          <Text className="text-primary">Sign Up</Text>
        </Pressable>

        <Pressable>
          <Text className="text-primary">Login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
export default Login;
