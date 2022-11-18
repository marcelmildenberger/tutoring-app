import { View, Text, Button } from "react-native";
import React from "react";
import useAuth from "../hooks/useAuth";

const ChatScreen = () => {
  const { logout, loading, user } = useAuth();

  return (
    <View>
      <Text>I am the Chat Screen</Text>
      <Button title="Sign Out" onPress={() => logout()} disabled={loading} />
    </View>
  );
};

export default ChatScreen;
