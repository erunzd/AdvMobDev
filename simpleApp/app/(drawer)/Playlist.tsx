import React from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const playlists = [
  {
    id: "1",
    title: "9INE/NONE",
    image:
      "https://static.wikia.nocookie.net/twicenation/images/4/4d/THIS_IS_FOR_-_Digital_Cover.jpg/revision/latest/scale-to-width-down/1000?cb=20250520162612",
  },
  {
    id: "2",
    title: "OSCS",
    image:
      "https://i.pinimg.com/736x/7c/49/07/7c4907757f675f5a9af7f73efb1aba60.jpg",
  },
  {
    id: "3",
    title: "CRASH",
    image:
      "https://i.pinimg.com/736x/ea/5f/65/ea5f65226903ddf52f54bdf6814d3fba.jpg",
  },
  {
    id: "4",
    title: "MIXnMATCH",
    image:
      "https://i.pinimg.com/736x/a4/75/de/a475de8ae14e15170d2a7e37557fae13.jpg",
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
