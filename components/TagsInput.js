import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useTailwind } from "tailwind-rn/dist";

const TagsInput = ({ tags, setTags }) => {
  const [text, setText] = useState("");
  const tw = useTailwind();
  const handleEnter = (e) => {
    if (e.nativeEvent.key === "Backspace") {
      setText((prev) => prev.slice(0, prev.length - 1));
      return;
    }

    if (!(e.nativeEvent.key === ",")) {
      setText((prev) => `${prev}${e.nativeEvent.key}`);
      return;
    }
    setTags((prev) => [...prev, text]);
    setText("");
  };
  const removeTag = (index) => {
    setTags((prev) => tags.filter((el, i) => i !== index));
  };
  return (
    <View style={[styles.tagsInputContainer]}>
      <View style={tw("flex flex-row ")}>
        {tags.map((tag, index) => (
          <View
            key={index}
            style={[tw("flex flex-row p-2 m-1"), styles.tagItem]}
          >
            <Text style={tw("pl-2")}>{tag}</Text>
            <TouchableOpacity onPress={() => removeTag(index)}>
              <Text style={[tw("ml-1 pr-1   ")]}>&times;</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TextInput
        editable={tags.length >= 3 ? false : true}
        selectTextOnFocus={tags.length >= 3 ? false : true}
        onKeyPress={(e) => handleEnter(e)}
        keyboardType="default"
        value={text}
        returnKeyType="done"
        placeholder={`Divide multiple entries with " , "`}
      />
    </View>
  );
};

export default TagsInput;

const styles = StyleSheet.create({
  tagsInputContainer: {
    border: "2px solid #000",
    borderRadius: "3px",

    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },

  tagItem: {
    backgroundColor: "rgb(218, 216, 216)",
    display: "inline-block",
    borderRadius: "20px",
  },

  tagsInput: {
    flexGrow: "1",
    border: "none",
    outline: "none",
  },
});
