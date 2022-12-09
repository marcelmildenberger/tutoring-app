import { View, Text, Image } from "react-native";
import React from "react";
import { useTailwind } from "tailwind-rn/dist";

const ReceiverMessage = ({ message }) => {
  const tw = useTailwind();
  return (
    <View
      style={[
        tw("bg-[#FFD455] rounded-lg rounded-tl-none px-5 py-3 mx-3 my-2 ml-14"),
        { alignSelf: "flex-start" },
      ]}
    >
      <Image
        style={tw("h-12 w-12 rounded-full absolute top-0 -left-14")}
        source={{ uri: message.photoURL }}
      />
      <Text style={tw("text-black")}>{message.message}</Text>
    </View>
  );
};

export default ReceiverMessage;
