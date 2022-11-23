import { SafeAreaView, Text, Button } from "react-native";
import React from "react";
import Header from "../components/Header";

const ChatScreen = () => {
  return (
    <SafeAreaView>
      <Header title={"Chat"} callEnabled={true} />
    </SafeAreaView>
  );
};

export default ChatScreen;
