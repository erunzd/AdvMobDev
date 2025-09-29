import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useTheme } from "../../redux/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Playlist {
  id: string;
  name: string;
  createdBy: string;
  cover: string;
}

const predefinedPlaylists: Playlist[] = [
  { id: "1", name: "Liked Songs", createdBy: "You", cover: "https://misc.scdn.co/liked-songs/liked-songs-300.jpg" },
  { id: "2", name: "rand", createdBy: "zai.cxg", cover: "https://i.scdn.co/image/ab67706c0000bebb0e0c2c6c5c0c2c6c5c0c2c6c" },
  { id: "3", name: "ambot", createdBy: "Czai)", cover: "https://i.scdn.co/image/ab67706c0000bebb0e0c2c6c5c0c2c6c5c0c2c6c" },
];

export default function PlaylistScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const router = useRouter();
  const [profile, setProfile] = useState({
    username: "Guest",
    avatar: null,
    avatarBg: theme.accentColor,
  });
  const [activeTab, setActiveTab] = useState<"playlists" | "artists">("playlists");
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); // Flag to prevent multiple loads

  const backgroundColor = useSharedValue(theme.backgroundColor);
  const textColor = useSharedValue(theme.textColor);
  const secondaryTextColor = useSharedValue(theme.secondaryTextColor);

  useEffect(() => {
    // Update animations on theme change
    backgroundColor.value = withTiming(theme.backgroundColor, { duration: 300 });
    textColor.value = withTiming(theme.textColor, { duration: 300 });
    secondaryTextColor.value = withTiming(theme.secondaryTextColor, { duration: 300 });
  }, [theme, backgroundColor, textColor, secondaryTextColor]);

  useEffect(() => {
    // Load data only once on mount
    if (!isLoaded) {
      loadProfile();
      loadPlaylists();
      setIsLoaded(true); // Set flag after initial load
    }
  }, [isLoaded]); // Empty dependency array for mount-only execution

  const animatedContainerStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));
  const animatedTextStyle = useAnimatedStyle(() => ({
    color: textColor.value,
  }));
  const animatedSecondaryTextStyle = useAnimatedStyle(() => ({
    color: secondaryTextColor.value,
  }));

  const loadProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem("userProfile");
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfile({
          username: parsed.username || "Guest",
          avatar: parsed.avatar || null,
          avatarBg: parsed.avatarBg || theme.accentColor,
        });
      }
    } catch (e) {
      console.log("Failed to load profile:", e);
    }
  };

  const loadPlaylists = async () => {
    try {
      const savedPlaylists = await AsyncStorage.getItem("playlists");
      console.log("Loaded playlists from storage:", savedPlaylists);
      if (savedPlaylists) {
        const parsedPlaylists = JSON.parse(savedPlaylists);
        console.log("Parsed playlists:", parsedPlaylists);
        setPlaylists(parsedPlaylists);
      } else {
        console.log("No saved playlists, initializing with predefined:", predefinedPlaylists);
        setPlaylists(predefinedPlaylists);
        await savePlaylists(predefinedPlaylists);
      }
    } catch (e) {
      console.log("Failed to load playlists:", e);
    }
  };

  const savePlaylists = async (updatedPlaylists: Playlist[]) => {
    try {
      await AsyncStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
      setPlaylists(updatedPlaylists);
      console.log("Playlists saved:", updatedPlaylists);
    } catch (e) {
      console.log("Failed to save playlists:", e);
    }
  };

  const handleAddPlaylist = () => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: `New Playlist ${playlists.length + 1}`,
      createdBy: profile.username,
      cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKRcM0IsJUkLyCuleVHR_WNv6swhCVLRHciA&s",
    };
    const updatedPlaylists = [newPlaylist, ...playlists];
    savePlaylists(updatedPlaylists);
  };

  const handleDeletePlaylist = (id: string) => {
    Alert.alert("Confirm", "Are you sure you want to delete this playlist?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const updatedPlaylists = playlists.filter((playlist) => playlist.id !== id);
          savePlaylists(updatedPlaylists);
        },
      },
    ]);
  };

  const renderPlaylistItem = ({ item }: { item: Playlist }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.inputBackground }]}
      onPress={() =>
        router.push({
          pathname: "/(drawer)/PlaylistDetail",
          params: { id: item.id, name: item.name },
        })
      }
    >
      <Image source={{ uri: item.cover }} style={styles.coverImage} />
      <View style={{ flex: 1 }}>
        <Animated.Text style={[styles.title, animatedTextStyle]}>
          {item.name}
        </Animated.Text>
        <Animated.Text style={[styles.subtitle, animatedSecondaryTextStyle]}>
          Playlist · {item.createdBy}
        </Animated.Text>
      </View>
      <TouchableOpacity onPress={() => handleDeletePlaylist(item.id)}>
        <Ionicons name="ellipsis-vertical" size={20} color={theme.secondaryTextColor} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const avatarComponent = profile.avatar ? (
    <Image source={{ uri: profile.avatar }} style={styles.avatar} />
  ) : (
    <View style={[styles.avatar, { backgroundColor: profile.avatarBg }]}>
      <Animated.Text style={[styles.avatarText, animatedTextStyle]}>
        {profile.username.charAt(0).toUpperCase()}
      </Animated.Text>
    </View>
  );

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          {avatarComponent}
        </TouchableOpacity>
        <Animated.Text style={[styles.headerTitle, animatedTextStyle]}>
          Your Library
        </Animated.Text>
        <TouchableOpacity onPress={handleAddPlaylist}>
          <Ionicons name="add" size={24} color={theme.textColor} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab("playlists")}
          style={[
            styles.tab,
            { backgroundColor: activeTab === "playlists" ? theme.accentColor : theme.inputBackground },
          ]}
        >
          <Animated.Text
            style={[
              styles.tabText,
              { color: activeTab === "playlists" ? "#fff" : theme.secondaryTextColor },
            ]}
          >
            Playlists
          </Animated.Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("artists")}
          style={[
            styles.tab,
            { backgroundColor: activeTab === "artists" ? theme.accentColor : theme.inputBackground },
          ]}
        >
          <Animated.Text
            style={[
              styles.tabText,
              { color: activeTab === "artists" ? "#fff" : theme.secondaryTextColor },
            ]}
          >
            Artists
          </Animated.Text>
        </TouchableOpacity>
      </View>

      {activeTab === "playlists" ? (
        <>
          {playlists.length === 0 ? (
            <ScrollView contentContainerStyle={styles.emptyStateContainer}>
              <Ionicons name="musical-notes-outline" size={64} color={theme.secondaryTextColor} />
              <Animated.Text style={[styles.emptyTitle, animatedSecondaryTextStyle]}>
                Create a playlist
              </Animated.Text>
              <Animated.Text style={[styles.emptySubtitle, animatedSecondaryTextStyle]}>
                Make a new playlist to get started.
              </Animated.Text>
              <TouchableOpacity
                style={[styles.createButton, { backgroundColor: theme.accentColor }]}
                onPress={handleAddPlaylist}
              >
                <Animated.Text style={[styles.createButtonText, { color: "#fff" }]}>
                  Create playlist
                </Animated.Text>
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <FlatList
              data={playlists}
              renderItem={renderPlaylistItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
            />
          )}
        </>
      ) : (
        <ScrollView contentContainerStyle={styles.emptyStateContainer}>
          <Ionicons name="person-outline" size={64} color={theme.secondaryTextColor} />
          <Animated.Text style={[styles.emptyTitle, animatedSecondaryTextStyle]}>
            Follow your first artist
          </Animated.Text>
          <Animated.Text style={[styles.emptySubtitle, animatedSecondaryTextStyle]}>
            Find an artist you love and hit follow.
          </Animated.Text>
          <TouchableOpacity style={[styles.createButton, { backgroundColor: theme.accentColor }]}>
            <Animated.Text style={[styles.createButtonText, { color: "#fff" }]}>
              Find artists
            </Animated.Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: { fontSize: 20, fontWeight: "bold" },
  headerTitle: { fontSize: 24, fontWeight: "bold", flex: 1 },
  icon: { marginLeft: 16 },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  tabText: { fontSize: 16, fontWeight: "bold" },
  emptyStateContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    maxWidth: 300,
  },
  createButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  createButtonText: { fontSize: 16, fontWeight: "bold" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  coverImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 12,
  },
  title: { fontSize: 16, fontWeight: "bold" },
  subtitle: { fontSize: 13 },
  listContent: { paddingBottom: 20 },
});