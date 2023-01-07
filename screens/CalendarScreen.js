import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as Calendar from "expo-calendar";
import { useTailwind } from "tailwind-rn/dist";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";

export default function CalendarScreen() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [location, setLocation] = useState(null);
  const [title, setTitle] = useState(null);
  const [notes, setNotes] = useState(null);
  const [calendarID, setCalendarID] = useState(null);
  const navigation = useNavigation();
  const { user } = useAuth();
  const tw = useTailwind();
  const { params } = useRoute();
  const { matchDetails } = params;
  const incompleteForm = !startDate || !endDate || !title || !location;

  async function getDefaultCalendarSource() {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    return defaultCalendar.source;
  }
  useEffect(() => {
    (async () => {
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      calendars.map((item) => {
        if (item.title === "SucSEED") {
          calendarExists = true;
          setCalendarID(item.id);
        }
        return;
      });
    })();
  }, []);

  const sendCalendarEntry = async () => {
    const event = {
      allDay: false,
      availability: "BUSY",
      calendarid: calendarID,
      startDate: startDate,
      endDate: endDate,
      location: location,
      notes: notes,
      recurrenceRule: null,
      status: "TENTATIVE",
      title: title,
    };
    await Calendar.createEventAsync(calendarID, event);

    event.startDate = event.startDate.toString();
    event.endDate = event.endDate.toString();

    addDoc(collection(db, "matches", matchDetails.id, "messages"), {
      timestamp: serverTimestamp(),
      userId: user.uid,
      displayName: user.displayName,
      photoURL: matchDetails.users[user.uid].photoURL,
      messageType: "calendarEntry",
      calendarEvent: event,
    });

    navigation.goBack();
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={tw("flex-1 items-center pt-1")}>
        <Image
          style={tw("h-20 w-full")}
          resizeMode="contain"
          source={require("../images/Logo_Profil.png")}
        />

        <Text style={tw("text-xl text-gray-500 p-2 font-bold")}>
          Suggest a appointment
        </Text>

        <Text style={tw("text-center p-4 font-bold text-[#ff8836]")}>
          Title
        </Text>
        <TextInput
          style={tw("text-center text-xl pb-2")}
          placeholder="Enter a title for the event"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />

        <Text style={tw("text-center p-4 font-bold text-[#ff8836]")}>
          Start date
        </Text>
        <DateTimePicker
          testID="dateTimePicker"
          value={startDate}
          onChange={(e, date) => {
            setStartDate(date);
            return;
          }}
          mode="datetime"
        />
        <Text style={tw("text-center p-4 font-bold text-[#ff8836]")}>
          End date
        </Text>
        <DateTimePicker
          testID="dateTimePickerEnd"
          value={endDate}
          onChange={(e, date) => {
            setEndDate(date);
            return;
          }}
          mode="datetime"
        />
        <Text style={tw("text-center p-4 font-bold text-[#ff8836]")}>
          Location
        </Text>
        <TextInput
          style={tw("text-center text-xl pb-2")}
          placeholder="Enter a location"
          value={location}
          onChangeText={(text) => setLocation(text)}
        />

        <Text style={tw("text-center p-4 font-bold text-[#ff8836]")}>
          {`(optional) Notes`}
        </Text>
        <TextInput
          style={tw("text-center text-xl pb-2")}
          placeholder="Enter some notes for the event"
          value={notes}
          onChangeText={(text) => setNotes(text)}
        />

        <TouchableOpacity
          disabled={incompleteForm}
          style={[
            tw("w-64 p-3 rounded-xl absolute bottom-10 "),
            incompleteForm ? tw("bg-gray-400") : tw("bg-[#ff8836]"),
          ]}
          onPress={(e) => {
            e.preventDefault();
            sendCalendarEntry();
            return;
          }}
        >
          <Text style={tw("text-center text-white text-xl")}>
            Send Calendar Entry
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}
