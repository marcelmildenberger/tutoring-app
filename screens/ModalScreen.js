import {
  Text,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { useTailwind } from "tailwind-rn/dist";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { REACT_APP_API_URL } from "@env";

const ModalScreen = () => {
  const tw = useTailwind();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [job, setJob] = useState(null);
  const [age, setAge] = useState(null);

  const incompleteForm = !image || !age || !job;

  const updateUserProfile = () => {
    const response = fetch(
      `${REACT_APP_API_URL}/updateUserProfile/${user.uid}`,
      {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
          data: {
            id: user.uid,
            displayName: user.displayName,
            photoURL: image,
            job: job,
            age: age,
          },
        }),
      }
    )
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((error) => alert(error));
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={tw("flex-1 items-center pt-1")}>
        <Image
          style={tw("h-20 w-full")}
          resizeMode="contain"
          source={{ uri: "https://links.papareact.com/2pf" }}
        />

        <Text style={tw("text-xl text-gray-500 p-2 font-bold")}>
          Welcome {user.displayName}
        </Text>

        <Text style={tw("text-center p-4 font-bold text-[#ff8836]")}>
          Step 1: The Profile Pic
        </Text>
        <TextInput
          value={image}
          onChangeText={(text) => setImage(text)}
          style={tw("text-center text-xl pb-2")}
          placeholder="Enter a Profile Pic URL"
        />

        <Text style={tw("text-center p-4 font-bold text-[#ff8836]")}>
          Step 2: The Job
        </Text>
        <TextInput
          value={job}
          onChangeText={(text) => setJob(text)}
          style={tw("text-center text-xl pb-2")}
          placeholder="Enter your occupation"
        />

        <Text style={tw("text-center p-4 font-bold text-[#ff8836]")}>
          Step 3: The Age
        </Text>
        <TextInput
          keyboardType="numeric"
          value={age}
          onChangeText={(text) => setAge(text)}
          style={tw("text-center text-xl pb-2")}
          placeholder="Enter your age"
        />

        <TouchableOpacity
          disabled={incompleteForm}
          style={[
            tw("w-64 p-3 rounded-xl absolute bottom-10 "),
            incompleteForm ? tw("bg-gray-400") : tw("bg-[#ff8836]"),
          ]}
          onPress={updateUserProfile}
        >
          <Text style={tw("text-center text-white text-xl")}>
            Update Profile
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ModalScreen;
