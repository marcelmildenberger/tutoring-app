import { Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import * as Calendar from "expo-calendar";
import { useTailwind } from "tailwind-rn/dist";
import { Entypo } from "@expo/vector-icons";

export default function CalendarMessage(props) {
  const { event } = props;
  const tw = useTailwind();
  const [calendarID, setCalendarID] = useState(null);

  useEffect(() => {
    (async () => {
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      calendars.map((item) => {
        if (item.title === "SucSEED") {
          setCalendarID(item.id);
        }
        return;
      });
    })();
  }, []);
  const createCalendarEntry = async () => {
    const newEvent = event;
    newEvent.startDate = new Date(event.startDate);
    newEvent.endDate = new Date(event.endDate);
    await Calendar.createEventAsync(calendarID, event);
  };
  return (
    <TouchableOpacity
      onPress={createCalendarEntry}
      style={[
        tw(
          "flex flex-row items-center  border-[#FFA943] border rounded-lg  px-5 py-3 my-2"
        ),
        { alignSelf: "center" },
      ]}
    >
      <Entypo
        name="calendar"
        size={24}
        color="#ff8836"
        style={tw("mb-1 mr-2")}
      />
      <Text style={tw("font-bold mr-2")}>{event.title}</Text>
      <Text>{`${new Date(event.startDate).toLocaleString("en", {
        dateStyle: "short",
        timeStyle: "short",
        hourCycle: "h24",
      })} - ${new Date(event.endDate).toLocaleString("en", {
        timeStyle: "short",
        hourCycle: "h24",
      })}`}</Text>
      <Text>{` at ${event.location}`}</Text>
    </TouchableOpacity>
  );
}
