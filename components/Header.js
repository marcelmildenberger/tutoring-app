import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useTailwind } from "tailwind-rn";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { Linking } from "react-native";

const Header = ({ title, callEnabled, phoneNumber }) => {
  const tw = useTailwind();
  const navigation = useNavigation();
  return (
    <View style={tw("p-2 flex-row items-center justify-between")}>
      <View style={tw("flex flex-row items-center")}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw("p-2")}>
          <Ionicons name="chevron-back-outline" size={34} color="#ff8836" />
        </TouchableOpacity>
        <Text style={tw("text-2xl font-bold pl-2")}>{title}</Text>
      </View>

      {callEnabled && (
        <TouchableOpacity
          onPress={() => Linking.openURL(`tel:${phoneNumber}`)}
          style={tw(
            "rounded-full mr-4 p-3 bg-[#ff8836] h-10 w-10 flex flex-row items-center"
          )}
        >
          <Foundation style={tw("")} name="telephone" size={20} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
