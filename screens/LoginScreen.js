import { View, ImageBackground, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { useTailwind } from "tailwind-rn";
import * as Calendar from "expo-calendar";

const LoginScreen = () => {
  const { signInWithGoogle, loading } = useAuth();
  const navigation = useNavigation();
  const tw = useTailwind();

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        var calendarExists = false;
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );
        calendars.map((item) => {
          if (item.title === "SucSEED") {
            calendarExists = true;
          }
          return;
        }); 
        if (!calendarExists) {
          const defaultCalendarSource =
            Platform.OS === "ios"
              ? await getDefaultCalendarSource()
              : { isLocalAccount: true, name: "SucSEED" };
          await Calendar.createCalendarAsync({
            title: "SucSEED",
            color: "#ff8836",
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: defaultCalendarSource.id,
            source: defaultCalendarSource,
            name: "SucSEED",
            ownerAccount: "personal",
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
          });
        }
      }
    })();
  }, []);

  async function getDefaultCalendarSource() {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    return defaultCalendar.source;
  }

  return (
    <View style={tw("flex-1")}>
      <ImageBackground
        resizeMode="cover"
        style={tw("flex-1")}
        source={require("../images/Logo-Sucseed.png")}
      >
        <TouchableOpacity
          onPress={signInWithGoogle}
          style={[
            tw("absolute bottom-40 w-52 bg-white p-4 rounded-2xl"),
            { marginHorizontal: "25%" },
          ]}
        >
          <Text style={tw("font-semibold text-center")}>Log In & Sucseed</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
