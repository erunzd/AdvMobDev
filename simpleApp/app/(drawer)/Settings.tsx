import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Switch, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../redux/themeSlice';
import { useTheme } from '../../redux/theme';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { RootState } from '../../redux/store';
import AsyncStorage from "@react-native-async-storage/async-storage";

const colors = ["#E84E1D", "#1DB954", "#E91E63", "#3F51B5", "#FF9800"];

export default function SettingsScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { mode } = useSelector((state: RootState) => state.theme);
  const theme = useTheme();
  const [profile, setProfile] = useState({
    username: "Guest",
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem("userProfile");
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          setProfile({
            username: parsed.username || "Guest",
            avatar: parsed.avatar || null,
            avatarBg: parsed.avatarBg || colors[Math.floor(Math.random() * colors.length)],
          });
        }
        const savedMode = await AsyncStorage.getItem("themeMode");
        if (savedMode) {
          dispatch(setTheme(savedMode));
        } else {
          dispatch(setTheme('dark')); // Default to dark mode
        }
      } catch (e) {
        console.log("Failed to load data:", e);
      }
    };
    loadData();
  }, [dispatch]);

  const toggleTheme = (value: boolean) => {
    const newMode = value ? 'dark' : 'light';
    dispatch(setTheme(newMode));
    AsyncStorage.setItem("themeMode", newMode);
  };

  const handleItemPress = (item: string) => {
    if (item === 'Theme') {
      // No modal needed, theme toggle is directly on the screen
    } else {
      Alert.alert(`${item}`, 'This feature is not implemented yet.');
    }
  };

  const handleViewProfile = () => {
    navigation.navigate('TabNavigator', { screen: 'Profile' });
  };

  const handleLogOut = () => {
    Alert.alert(
      'Log out',
      'You have been logged out.',
      [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]
    );
  };

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <Animated.Text style={[styles.headerTitle, animatedTextStyle]}>Settings</Animated.Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Profile Section */}
        <TouchableOpacity style={styles.profileSection} onPress={handleViewProfile}>
          <View style={styles.profileAvatarWrapper}>
            {profile.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.profileAvatar} />
            ) : (
              <View style={[styles.profileAvatar, { backgroundColor: profile.avatarBg }]}>
                <Text style={styles.profileAvatarText}>
                  {profile.username ? profile.username.charAt(0).toUpperCase() : "?"}
                </Text>
              </View>
            )}
          </View>
          <Animated.Text style={[styles.profileName, animatedTextStyle]}>{profile.username}</Animated.Text>
          <Animated.Text style={[styles.viewProfile, animatedSecondaryTextStyle]}>View profile</Animated.Text>
        </TouchableOpacity>

        {/* Settings List */}
        <View style={styles.listContainer}>
          {[
            'Account',
            'Data-saving and offline',
            'Content and display',
            'Privacy and social',
            'Media quality',
            'Notifications',
            'Apps and devices',
            'About',
            'Theme'
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.listItem} onPress={() => handleItemPress(item)}>
              <Animated.Text style={[styles.listItemText, animatedTextStyle]}>{item}</Animated.Text>
              <Ionicons name="chevron-forward" size={20} color={theme.secondaryTextColor} />
            </TouchableOpacity>
          ))}
          <View style={styles.listItem}>
            <Animated.Text style={[styles.listItemText, animatedTextStyle]}>Dark Mode</Animated.Text>
            <Switch
              value={mode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: '#1DB954' }}
              thumbColor={mode === 'dark' ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logOutButton} onPress={handleLogOut}>
          <Animated.Text style={[styles.logOutText, animatedTextStyle, { color: '#000000' }]}>Log out</Animated.Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: 'SpotifyMix-Bold',
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  profileAvatarWrapper: {
    marginRight: 12,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  profileAvatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: 'SpotifyMix-Bold',
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: 'SpotifyMix-Bold',
    flex: 1,
  },
  viewProfile: {
    fontSize: 14,
    fontFamily: 'SpotifyMix-Regular',
    marginRight: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  listItemText: {
    fontSize: 16,
    fontFamily: 'SpotifyMix-Regular',
  },
  logOutButton: {
    backgroundColor: "#1db954",
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 40,
  },
  logOutText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: 'SpotifyMix-Bold',
  },
});