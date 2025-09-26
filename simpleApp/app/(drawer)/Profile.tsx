import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../redux/theme';

const colors = ["#E84E1D", "#1DB954", "#E91E63", "#3F51B5", "#FF9800"];

export default function ProfileScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const [profile, setProfile] = useState({
    username: "Guest",
    email: "",
    avatar: null,
    avatarBg: colors[Math.floor(Math.random() * colors.length)],
  });

  const backgroundColor = useSharedValue(theme.backgroundColor);
  const textColor = useSharedValue(theme.textColor);
  const secondaryTextColor = useSharedValue(theme.secondaryTextColor);

  useEffect(() => {
    backgroundColor.value = withTiming(theme.backgroundColor, { duration: 300 });
    textColor.value = withTiming(theme.textColor, { duration: 300 });
    secondaryTextColor.value = withTiming(theme.secondaryTextColor, { duration: 300 });
  }, [theme]);

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

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [])
  );

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <Ionicons name="ellipsis-vertical" size={24} color={theme.textColor} />
      </View>

      <View style={styles.avatarWrapper}>
        {profile.avatar ? (
          <Image source={{ uri: profile.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: profile.avatarBg }]}>
            <Animated.Text style={[styles.avatarText, animatedTextStyle]}>
              {profile.username ? profile.username.charAt(0).toUpperCase() : "?"}
            </Animated.Text>
          </View>
        )}
      </View>

      <Animated.Text style={[styles.username, animatedTextStyle]}>{profile.username}</Animated.Text>
      <Animated.Text style={[styles.email, animatedSecondaryTextStyle]}>{profile.email}</Animated.Text>

      <TouchableOpacity
        style={[styles.editButton, { borderColor: theme.borderColor }]}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <Animated.Text style={[styles.editButtonText, animatedTextStyle]}>EDIT PROFILE</Animated.Text>
      </TouchableOpacity>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Animated.Text style={[styles.statNumber, animatedTextStyle]}>0</Animated.Text>
          <Animated.Text style={[styles.statLabel, animatedSecondaryTextStyle]}>PLAYLISTS</Animated.Text>
        </View>
        <View style={styles.statItem}>
          <Animated.Text style={[styles.statNumber, animatedTextStyle]}>0</Animated.Text>
          <Animated.Text style={[styles.statLabel, animatedSecondaryTextStyle]}>FOLLOWERS</Animated.Text>
        </View>
        <View style={styles.statItem}>
          <Animated.Text style={[styles.statNumber, animatedTextStyle]}>31</Animated.Text>
          <Animated.Text style={[styles.statLabel, animatedSecondaryTextStyle]}>FOLLOWING</Animated.Text>
        </View>
      </View>

      <Animated.Text style={[styles.activity, animatedSecondaryTextStyle]}>No recent activity</Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 48,
    fontWeight: "bold",
    fontFamily: 'SpotifyMix-Bold',
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
    fontFamily: 'SpotifyMix-Bold',
  },
  email: {
    fontSize: 14,
    marginBottom: 20,
    fontFamily: 'SpotifyMix-Regular',
  },
  editButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 6,
    marginBottom: 20,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: 'SpotifyMix-Regular',
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
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: 'SpotifyMix-Bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'SpotifyMix-Regular',
  },
  activity: {
    fontSize: 14,
    marginTop: 10,
    fontFamily: 'SpotifyMix-Regular',
  },
});