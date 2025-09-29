import React, { useReducer, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, Alert, ImageBackground, Modal } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../redux/theme";

interface Song {
  id: string;
  name: string;
  artist: string;
  cover: string;
}

interface PlaylistDetails {
  name: string;
  description: string;
  image: string;
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

const availableSongs: Song[] = [
  { id: "1", name: "THIS IS FOR", artist: "TWICE", cover: "https://images.genius.com/47e6ebb1bb55a3118b86be115728b83d.1000x1000x1.png" },
  { id: "2", name: "XOXZ", artist: "IVE", cover: "https://images.genius.com/1d12d65e9b03a24c4f3da14cdd06d4db.1000x1000x1.png" },
  { id: "3", name: "XO", artist: "ENHYPEN", cover: "https://images.genius.com/b8ddaec7a447a13d7dd6268e1bdd6ffb.1000x1000x1.png" },
  { id: "4", name: "Beat It", artist: "Sean Kingston", cover: "https://i.ytimg.com/vi/Sf49qhtXVwk/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AG-B4AC0AWKAgwIABABGGUgWihjMA8=&rs=AOn4CLDRMG262yr8Htzq5pJqbkQD30yTAg" },
  { id: "5", name: "Die For You", artist: "The Weeknd", cover: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a" },
];

export default function PlaylistDetail() {
  const { id, name: initialName } = useLocalSearchParams<{ id: string; name: string }>();
  const theme = useTheme();
  const router = useRouter();
  const [songName, setSongName] = useState("");
  const [playlistName, setPlaylistName] = useState(initialName || "Playlist Name");
  const [description, setDescription] = useState("No description yet");
  const [playlistImage, setPlaylistImage] = useState("https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2?v=v2");
  const [state, dispatch] = useReducer(reducer, { songs: [], history: [], future: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.multiGet([`playlist-${id}`, `playlist-${id}-details`]).then(([songsData, detailsData]) => {
      if (songsData[1]) {
        dispatch({ type: "SET", payload: JSON.parse(songsData[1]) });
      }
      if (detailsData[1]) {
        const parsedDetails = JSON.parse(detailsData[1]);
        setPlaylistName(parsedDetails.name || initialName);
        setDescription(parsedDetails.description || "No description yet");
        setPlaylistImage(parsedDetails.image || playlistImage);
      }
    });
  }, [id, initialName]);

  useEffect(() => {
    AsyncStorage.setItem(`playlist-${id}`, JSON.stringify(state.songs));
  }, [state.songs, id]);

  useEffect(() => {
    AsyncStorage.setItem(
      `playlist-${id}-details`,
      JSON.stringify({ name: playlistName, description, image: playlistImage })
    );
  }, [playlistName, description, playlistImage, id]);

  const addSong = (song: Song) => {
    dispatch({ type: "ADD", payload: song });
    setIsEditing(false); // Assuming modal closes after adding
  };

  const handleEdit = () => setIsEditing(true);
  const handleSaveEdit = () => {
    setIsEditing(false);
    Alert.alert("Saved", "Playlist details updated!");
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPlaylistImage(result.assets[0].uri);
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    if (index === 0) {
      return (
        <ImageBackground
          source={{ uri: playlistImage }}
          style={styles.coverContainer}
          blurRadius={10}
        >
          <Image source={{ uri: playlistImage }} style={styles.coverImage} />
          {isEditing ? (
            <TextInput
              value={playlistName}
              onChangeText={setPlaylistName}
              style={[styles.editTitle, { backgroundColor: theme.inputBackground, color: theme.textColor, borderColor: theme.borderColor }]}
              placeholder="Enter playlist name"
            />
          ) : (
            <Text style={[styles.playlistName, { color: theme.textColor }]}>{playlistName}</Text>
          )}
          {isEditing ? (
            <TextInput
              value={description}
              onChangeText={setDescription}
              style={[styles.editDescription, { backgroundColor: theme.inputBackground, color: theme.textColor, borderColor: theme.borderColor }]}
              placeholder="Enter description"
            />
          ) : (
            <Text style={[styles.description, { color: theme.secondaryTextColor }]}>{description}</Text>
          )}
          {isEditing && (
            <TouchableOpacity onPress={pickImage} style={[styles.editImageButton, { backgroundColor: theme.accentColor, borderRadius: 8 }]}>
              <Text style={{ color: "#fff" }}>Change Image</Text>
            </TouchableOpacity>
          )}
          <Text style={[styles.ownerInfo, { color: theme.secondaryTextColor }]}>You · {state.songs.length} songs · 3m</Text>
        </ImageBackground>
      );
    } else if (index === 1) {
      return (
        <View style={[styles.actionBar, { backgroundColor: theme.backgroundColor }]}>
          <TouchableOpacity>
            <Ionicons name="arrow-down-circle-outline" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Ionicons name="add" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="share-social-outline" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEditModalVisible(true)}>
            <Ionicons name="ellipsis-horizontal" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.playButton}>
            <Ionicons name="play" size={24} color="#000000" />
          </TouchableOpacity>
        </View>
      );
    } else if (index === 2) {
      return (
        <View style={[styles.toolBar, { backgroundColor: theme.backgroundColor }]} />
      );
    } else if (index === 3 && state.songs.length === 0) {
      return (
        <View style={[styles.emptyState, { backgroundColor: theme.backgroundColor }]}>
          <Ionicons name="musical-notes-outline" size={64} color={theme.secondaryTextColor} />
          <Text style={[styles.emptyText, { color: theme.textColor }]}>This playlist is empty</Text>
          <Text style={[styles.emptySubtext, { color: theme.secondaryTextColor }]}>Add songs to get started.</Text>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.accentColor }]} onPress={() => setIsEditing(true)}>
            <Text style={{ color: "#fff" }}>Add Songs</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      const song = state.songs[index - 4]; // Adjust index for header items, skip empty state
      if (song) {
        return (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
            <View style={[styles.songItem, { backgroundColor: theme.backgroundColor, borderBottomColor: theme.borderColor }]}>
              <Image source={{ uri: song.cover }} style={styles.songImage} />
              <View style={styles.songDetails}>
                <Text style={[styles.songTitle, { color: theme.textColor }]}>{song.name}</Text>
                <Text style={[styles.songArtist, { color: theme.secondaryTextColor }]}>{song.artist}</Text>
              </View>
              <TouchableOpacity onPress={() => dispatch({ type: "REMOVE", payload: song.id })}>
                <Ionicons name="ellipsis-horizontal" size={20} color={theme.secondaryTextColor} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        );
      }
      return null;
    }
  };

  const renderModalItem = ({ item }: { item: Song }) => (
    <TouchableOpacity style={styles.modalItem} onPress={() => addSong(item)}>
      <Image source={{ uri: item.cover }} style={styles.modalImage} />
      <View style={styles.modalTextContainer}>
        <Text style={[styles.modalTitle, { color: theme.textColor }]}>{item.name}</Text>
        <Text style={[styles.modalArtist, { color: theme.secondaryTextColor }]}>{item.artist}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEditModal = () => (
    <Modal visible={isEditModalVisible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.backgroundColor }]}>
          <Text style={[styles.modalHeader, { color: theme.textColor }]}>Edit Playlist</Text>
          <TextInput
            value={playlistName}
            onChangeText={setPlaylistName}
            style={[styles.editTitle, { backgroundColor: theme.inputBackground, color: theme.textColor, borderColor: theme.borderColor }]}
            placeholder="Enter playlist name"
          />
          <TouchableOpacity onPress={pickImage} style={[styles.editImageButton, { backgroundColor: theme.accentColor, borderRadius: 8, marginTop: 16 }]}>
            <Text style={{ color: "#fff" }}>Change Cover Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: theme.accentColor, marginTop: 16 }]}
            onPress={() => {
              handleSaveEdit();
              setIsEditModalVisible(false);
            }}
          >
            <Text style={{ color: "#fff" }}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: theme.inputBackground, marginTop: 8 }]}
            onPress={() => setIsEditModalVisible(false)}
          >
            <Text style={{ color: theme.textColor }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <FlatList
        data={[...Array(state.songs.length === 0 ? 4 : 4 + state.songs.length).keys()]} // 4 header items + song count
        renderItem={renderItem}
        keyExtractor={(index) => index.toString()}
        ListFooterComponent={
          <View style={[styles.toolBar, { backgroundColor: theme.backgroundColor }]}>
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
        }
        style={{ flex: 1 }}
      />
      <Modal visible={isEditing} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundColor }]}>
            <Text style={[styles.modalHeader, { color: theme.textColor }]}>Add Songs</Text>
            <FlatList
              data={availableSongs.filter((song) => !state.songs.some((s) => s.id === song.id))} // Exclude already added songs
              renderItem={renderModalItem}
              keyExtractor={(item) => item.id}
            />
            <TouchableOpacity style={[styles.closeButton, { backgroundColor: theme.accentColor }]} onPress={() => setIsEditing(false)}>
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {renderEditModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", flex: 1, textAlign: "center" },
  coverContainer: { alignItems: "center", padding: 16, position: "relative" },
  coverImage: { width: 200, height: 200, borderRadius: 8, marginBottom: 8 },
  playlistName: { fontSize: 24, fontWeight: "bold" },
  subtext: { fontSize: 14, marginVertical: 4 },
  description: { fontSize: 14, color: "#AAAAAA" },
  ownerInfo: { fontSize: 12, color: "#AAAAAA" },
  actionBar: { flexDirection: "row", justifyContent: "space-around", padding: 16, borderTopWidth: 1, borderTopColor: "#333" },
  playButton: { backgroundColor: "#1DB954", borderRadius: 50, padding: 12 },
  toolBar: { flexDirection: "row", justifyContent: "space-around", padding: 16 },
  toolButton: { flexDirection: "row", alignItems: "center", padding: 8, borderRadius: 8 },
  toolText: { marginLeft: 8, fontSize: 16 },
  songInputContainer: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 16 },
  input: { flex: 1, padding: 10, borderWidth: 1, borderRadius: 8 },
  addBtn: { marginLeft: 10, padding: 10, borderRadius: 8 },
  songItem: { flexDirection: "row", alignItems: "center", padding: 12, borderBottomWidth: 1 },
  songImage: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
  songDetails: { flex: 1 },
  songTitle: { fontSize: 16 },
  songArtist: { fontSize: 14 },
  actionRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 16, padding: 16 },
  editTitle: { fontSize: 24, fontWeight: "bold", borderWidth: 1, borderRadius: 8, padding: 8, marginBottom: 8 },
  editDescription: { fontSize: 14, borderWidth: 1, borderRadius: 8, padding: 8, marginBottom: 8 },
  editImageButton: { padding: 10, borderRadius: 8, marginTop: 8 },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  emptyText: { fontSize: 24, fontWeight: "bold", marginVertical: 8 },
  emptySubtext: { fontSize: 16, textAlign: "center", marginBottom: 16 },
  addButton: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 20 },
  modalOverlay: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { padding: 16, borderRadius: 8, marginHorizontal: 16 },
  modalHeader: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  modalItem: { flexDirection: "row", alignItems: "center", padding: 12, borderBottomWidth: 1, borderBottomColor: "#333" },
  modalImage: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
  modalTextContainer: { flex: 1 },
  modalTitle: { fontSize: 16 },
  modalArtist: { fontSize: 14 },
  closeButton: { padding: 12, borderRadius: 8, alignItems: "center", marginTop: 8 },
});