import { Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  return (
    <SafeAreaView className="">
      <View className="pt-20">
        <Text className="text-center text-5xl font-bold text-foreground">
          Welcome To FastBreak
        </Text>
      </View>

      <View className=" flex  justify-center p-10 ">
        <Text className=" text-primary">Login</Text>
        <TextInput
          placeholder="Gavin@Hooli.com"
          className=" bg-primary-foreground p-4 text-primary  placeholder:text-slate-400  "
        ></TextInput>
        <Text className="text-primary "> Password</Text>
        <TextInput
          placeholder="I Hate Pied Piper"
          className="bg-primary-foreground p-4 text-primary  placeholder:text-slate-400"
          secureTextEntry={true}
        ></TextInput>
      </View>
    </SafeAreaView>
  );
};
export default Login;
