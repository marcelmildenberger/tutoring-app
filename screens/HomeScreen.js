import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import { useTailwind } from "tailwind-rn";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import { REACT_APP_API_URL } from "@env";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const tw = useTailwind();

  useLayoutEffect(() => {
    const fetchUser = async () => {
      const fetchResponse = await fetch(
        `${REACT_APP_API_URL}/getUser/${user.uid}`
      );
      const userData = await fetchResponse.json();
      if (fetchResponse.status !== 200 && !userData?.data?.user) {
        navigation.navigate("Modal");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCards = async () => {
      const fetchProfiles = await fetch(
        `${REACT_APP_API_URL}/getProfiles/${user.uid}`
      );
      const fetchProfilesData = await fetchProfiles.json();
      setProfiles(fetchProfilesData);
    };
    fetchCards();
  }, []);

  const swipeRef = useRef(null);

  const swipeLeft = async (cardIndex) => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];
    const response = fetch(`${REACT_APP_API_URL}/pass/${user.uid}`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({ userSwiped: userSwiped }),
    });
  };

  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];
    const response = await fetch(`${REACT_APP_API_URL}/swipe/${user.uid}`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({ userSwiped: userSwiped }),
    });
    const data = await response.json();
    if (response.status === 200 && data?.match) {
      const loggedInProfile = data?.loggedInProfile;
      navigation.navigate("Match", {
        loggedInProfile,
        userSwiped,
      });
    }
  };

  return (
    <SafeAreaView style={tw("flex-1")}>
      {/* Header */}
      <View style={tw("flex-row px-5 justify-between items-center relative")}>
        <TouchableOpacity onPress={logout}>
          <Image
            style={tw("h-10 w-10 rounded-full")}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image
            style={tw("h-14 w-14")}
            resizeMode="contain"
            source={require("../images/pngfind.com-tinder-logo-png-131073.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864" />
        </TouchableOpacity>
      </View>

      {/* End of Header */}
      <View style={tw("flex-1 -mt-6")}>
        <Swiper
          containerStyle={{ backgroundColor: "transparent" }}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          ref={swipeRef}
          onSwipedLeft={(cardIndex) => {
            swipeLeft(cardIndex);
          }}
          onSwipedRight={(cardIndex) => {
            swipeRight(cardIndex);
          }}
          backgroundColor={"#4FD0E9"}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "MATCH",
              style: {
                label: {
                  color: "#4DED30",
                },
              },
            },
          }}
          renderCard={(card) =>
            card ? (
              <View
                key={card.id}
                style={tw("bg-white h-3/4 rounded-xl relative")}
              >
                <Image
                  style={tw("absolute top-0 h-full w-full rounded-xl")}
                  source={{ uri: card.photoURL }}
                />
                <View
                  style={[
                    tw(
                      "bg-white w-full h-20 absolute bottom-0 justify-between flex-row px-6 py-2 rounded-b-lg items-center"
                    ),
                    styles.cardShadow,
                  ]}
                >
                  <View>
                    <Text style={tw("text-xl font-bold")}>
                      {card.displayName}
                    </Text>
                    <Text>{card.occupation}</Text>
                  </View>
                  <Text style={tw("text-2xl font-bold")}>{card.age}</Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  tw(
                    "relative bg-white h-3/4 rounded-xl justify-center items-center"
                  ),
                  styles.cardShadow,
                ]}
              >
                <Text style={tw("font-bold pb-5")}>No more profiles</Text>
                <Image
                  style={tw("h-20 w-full")}
                  height={100}
                  width={100}
                  source={{ uri: "https://links.papareact.com/6gb" }}
                />
              </View>
            )
          }
        />
      </View>

      <View style={tw("flex flex-row justify-evenly")}>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()}
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-red-200"
          )}
        >
          <Entypo name="cross" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()}
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-green-200"
          )}
        >
          <AntDesign name="heart" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
