import React from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const playlists = [
  {
    id: "1",
    title: "FOUR",
    image:
      "https://static.wikia.nocookie.net/twicenation/images/4/4d/THIS_IS_FOR_-_Digital_Cover.jpg/revision/latest/scale-to-width-down/1000?cb=20250520162612",
  },
  {
    id: "2",
    title: "AVOCADO",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPmwerVyZ2w0zj6a33kIptvTW7H6b0rEp3TuTFqWf2WQ&s&ec=73068120",
  },
  {
    id: "3",
    title: "GO",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGgVnvMpMpaLtED4BjRDqVfYVzOTW_M4VR-g&s",
  },
  {
    id: "4",
    title: "SUPER",
    image:
      "https://i1.sndcdn.com/artworks-cxEb5z7z5WepDt88-Accr7w-t500x500.jpg",
  },
];

export default function PlaylistsScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="musical-notes" size={28} color="#1DB954" />
        <Text style={styles.headerText}>Playlists</Text>
      </View>

      {/* Playlist List */}
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.playlistItem}>
            <Image source={{ uri: item.image }} style={styles.coverImage} />
            <Text style={styles.playlistTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  coverImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  playlistTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
