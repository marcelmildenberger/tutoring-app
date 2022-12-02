import { View, ImageBackground, Text, TouchableOpacity } from "react-native";
import React from "react";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { useTailwind } from "tailwind-rn";

const LoginScreen = () => {
  const { signInWithGoogle, loading } = useAuth();
  const navigation = useNavigation();
  const tw = useTailwind();

  return (
    <View style={tw("flex-1")}>
      <ImageBackground
        resizeMode="cover"
        style={tw("flex-1")}
        source={{ uri: "https://tinder.com/static/tinder.png" }}
      >
        <TouchableOpacity
          onPress={signInWithGoogle}
          style={[
            tw("absolute bottom-40 w-52 bg-white p-4 rounded-2xl"),
            { marginHorizontal: "25%" },
          ]}
        >
          <Text style={tw("font-semibold text-center")}>
            Sign in & get swiping
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
