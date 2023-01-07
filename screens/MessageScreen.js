import {
  View,
  SafeAreaView,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import useAuth from "../hooks/useAuth";
import { useRoute } from "@react-navigation/native";
import { useTailwind } from "tailwind-rn/dist";
import SenderMessage from "../components/SenderMessage";
import ReceiverMessage from "../components/ReceiverMessage";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CalendarMessage from "../components/CalendarMessage";

const MessageScreen = () => {
  const { user } = useAuth();
  const { params } = useRoute();
  const tw = useTailwind();
  const { matchDetails } = params;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches", matchDetails.id, "messages"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
      ),
    [matchDetails, db]
  );
  const sendMessage = () => {
    if (input.length === 0) {
      return;
    }
    addDoc(collection(db, "matches", matchDetails.id, "messages"), {
      timestamp: serverTimestamp(),
      userId: user.uid,
      displayName: user.displayName,
      photoURL: matchDetails.users[user.uid].photoURL,
      messageType: "message",
      message: input,
    });

    setInput("");
  };
  return (
    <SafeAreaView style={tw("flex-1")}>
      <Header
        title={getMatchedUserInfo(matchDetails?.users, user.uid).displayName}
        callEnabled={true}
        phoneNumber={
          getMatchedUserInfo(matchDetails?.users, user.uid).phoneNumber
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw("flex-1")}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            data={messages}
            style={tw("pl-4")}
            keyExtractor={(item) => item.id}
            renderItem={({ item: message }) => {
              if (message.messageType === "message") {
                return message.userId === user.uid ? (
                  <SenderMessage key={message.id} message={message} />
                ) : (
                  <ReceiverMessage key={message.id} message={message} />
                );
              } else if (message.messageType === "calendarEntry") {
                return (
                  <CalendarMessage
                    key={message.id}
                    event={message.calendarEvent}
                  />
                );
              }
            }}
            inverted={-1}
          />
        </TouchableWithoutFeedback>
        <View
          style={tw(
            "flex-row justify-between items-center border-t  border-gray-200 px-5 py-2"
          )}
        >
          <View style={{ maxWidth: "80%" }}>
            <TextInput
              style={tw("h-10 text-lg")}
              placeholder="Send Message..."
              onChangeText={setInput}
              value={input}
              onSubmitEditing={sendMessage}
            />
          </View>
          <View style={tw("flex flex-row items-center mt-3 ml-2 ")}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Calendar", { matchDetails })}
            >
              <Entypo name="calendar" size={24} color="#ff8836" />
            </TouchableOpacity>
            <Button
              title="Send"
              style={tw("ml-4")}
              color="#ff8836"
              onPress={sendMessage}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessageScreen;
