import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const colors = ["#E84E1D", "#1DB954", "#E91E63", "#3F51B5", "#FF9800"]; // fallback avatar bg colors

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState({
    username: "Guest",
    email: "",
    avatar: null,
    avatarBg: colors[Math.floor(Math.random() * colors.length)],
  });

  // Load profile from storage
  const loadProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem("userProfile");
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfile({
          ...parsed,
          username: parsed.username || "Guest",
          email: parsed.email || "",
          avatar: parsed.avatar || null,
          avatarBg: parsed.avatarBg || colors[Math.floor(Math.random() * colors.length)],
        });
      }
    } catch (e) {
      console.log("Failed to load profile:", e);
    }
  };

  // Reload every time screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Ionicons name="ellipsis-vertical" size={24} color="white" />
      </View>

      {/* Profile Avatar */}
      <View style={styles.avatarWrapper}>
        {profile.avatar ? (
          <Image source={{ uri: profile.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: profile.avatarBg }]}>
            <Text style={styles.avatarText}>
              {profile.username ? profile.username.charAt(0).toUpperCase() : "?"}
            </Text>
          </View>
        )}
      </View>

      {/* Username and Email */}
      <Text style={styles.username}>{profile.username}</Text>
      <Text style={styles.email}>{profile.email}</Text>

      {/* Edit Profile Button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <Text style={styles.editButtonText}>EDIT PROFILE</Text>
      </TouchableOpacity>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>PLAYLISTS</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>FOLLOWERS</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>31</Text>
          <Text style={styles.statLabel}>FOLLOWING</Text>
        </View>
      </View>

      {/* Recent Activity Placeholder */}
      <Text style={styles.activity}>No recent activity</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 40,
    marginBottom: 20,
  },
  avatarWrapper: {
    marginBottom: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "bold",
  },
  username: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
  },
  email: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 20,
  },
  editButton: {
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 6,
    marginBottom: 20,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginBottom: 40,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 2,
  },
  activity: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 10,
  },
});