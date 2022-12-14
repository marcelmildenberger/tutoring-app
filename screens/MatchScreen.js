import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTailwind } from "tailwind-rn/dist";

const MatchScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { loggedInProfile, userSwiped } = params;
  const tw = useTailwind();

  return (
    <ImageBackground
      resizeMode="cover"
      style={[tw("flex-1"), { opacity: 0.85 }]}
      source={require("../images/Farbverlauf.png")}
    >
      <View style={[tw("h-full pt-20")]}>
        <View style={tw("justify-center px-10 pt-20")}>
          <Image
            style={tw("h-20 w-full")}
            source={require("../images/Match_Screen.png")}
          />
        </View>
        <Text style={tw("text-black text-center mt-5 text-lg")}>
          You and {userSwiped.displayName} have liked each other.
        </Text>

        <View style={tw("flex-row justify-evenly mt-5")}>
          <Image
            style={tw("h-32 w-32 rounded-full")}
            source={{ uri: loggedInProfile.photoURL }}
          />
          <Image
            style={tw("h-32 w-32 rounded-full")}
            source={{ uri: userSwiped.photoURL }}
          />
        </View>

        <TouchableOpacity
          style={tw("bg-white m-5 px-10 py-8 rounded-full mt-20")}
        >
          <Text
            onPress={() => {
              navigation.goBack();
              navigation.navigate("Chat");
            }}
            style={tw("text-center")}
          >
            Send a Message
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default MatchScreen;
