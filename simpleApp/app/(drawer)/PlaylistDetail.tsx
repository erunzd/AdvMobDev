// app/playlistDetail.tsx
import React, { useReducer, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/redux/theme";

interface Song {
  id: string;
  name: string;
}

interface State {
  songs: Song[];
  history: State[];
  future: State[];
}

type Action =
  | { type: "ADD"; payload: Song }
  | { type: "REMOVE"; payload: string }
  | { type: "CLEAR" }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SET"; payload: Song[] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD":
      return {
        songs: [...state.songs, action.payload],
        history: [...state.history, state],
        future: [],
      };
    case "REMOVE":
      return {
        songs: state.songs.filter((s) => s.id !== action.payload),
        history: [...state.history, state],
        future: [],
      };
    case "CLEAR":
      return { songs: [], history: [...state.history, state], future: [] };
    case "UNDO":
      if (state.history.length === 0) return state;
      const prev = state.history[state.history.length - 1];
      return {
        ...prev,
        history: state.history.slice(0, -1),
        future: [state, ...state.future],
      };
    case "REDO":
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        ...next,
        history: [...state.history, state],
        future: state.future.slice(1),
      };
    case "SET":
      return { ...state, songs: action.payload };
    default:
      return state;
  }
}

export default function PlaylistDetail() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const theme = useTheme();
  const [songName, setSongName] = React.useState("");
  const [state, dispatch] = useReducer(reducer, { songs: [], history: [], future: [] });

  // 🔹 Load persisted songs
  useEffect(() => {
    AsyncStorage.getItem(`playlist-${id}`).then((data) => {
      if (data) {
        dispatch({ type: "SET", payload: JSON.parse(data) });
      }
    });
  }, [id]);

  // 🔹 Save songs when changed
  useEffect(() => {
    AsyncStorage.setItem(`playlist-${id}`, JSON.stringify(state.songs));
  }, [state.songs]);

  const addSong = () => {
    if (!songName.trim()) return;
    dispatch({ type: "ADD", payload: { id: Date.now().toString(), name: songName } });
    setSongName("");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.title, { color: theme.textColor }]}>{name}</Text>

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Add a song..."
          placeholderTextColor={theme.secondaryTextColor}
          value={songName}
          onChangeText={setSongName}
          style={[
            styles.input,
            { backgroundColor: theme.inputBackground, color: theme.textColor, borderColor: theme.borderColor },
          ]}
        />
        <TouchableOpacity onPress={addSong} style={[styles.addBtn, { backgroundColor: theme.accentColor }]}>
          <Text style={{ color: "#fff" }}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Song List */}
      <FlatList
        data={state.songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
            <View style={[styles.songItem, { borderBottomColor: theme.borderColor }]}>
              <Text style={{ color: theme.textColor }}>{item.name}</Text>
              <TouchableOpacity onPress={() => dispatch({ type: "REMOVE", payload: item.id })}>
                <Text style={{ color: theme.accentColor }}>Remove</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      />

      {/* Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity onPress={() => dispatch({ type: "UNDO" })}>
          <Text style={{ color: theme.accentColor }}>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch({ type: "REDO" })}>
          <Text style={{ color: theme.accentColor }}>Redo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch({ type: "CLEAR" })}>
          <Text style={{ color: "red" }}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  inputRow: { flexDirection: "row", marginBottom: 16 },
  input: { flex: 1, padding: 10, borderWidth: 1, borderRadius: 8 },
  addBtn: { marginLeft: 10, padding: 10, borderRadius: 8 },
  songItem: { flexDirection: "row", justifyContent: "space-between", padding: 12, borderBottomWidth: 1 },
  actionRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 16 },
});
