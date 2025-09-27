import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../redux/theme';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const colors = ["#E84E1D", "#1DB954", "#E91E63", "#3F51B5", "#FF9800"];

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const navigation = useNavigation();
  const theme = useTheme();
  const [profile, setProfile] = useState({
    username: "Guest",
    avatar: null,
    avatarBg: colors[Math.floor(Math.random() * colors.length)],
  });

  const backgroundColor = useSharedValue(theme.backgroundColor || '#121212');
  const textColor = useSharedValue(theme.textColor || '#FFFFFF');
  const secondaryTextColor = useSharedValue(theme.secondaryTextColor || '#B3B3B3');

  useEffect(() => {
    backgroundColor.value = withTiming(theme.backgroundColor || '#121212', { duration: 300 });
    textColor.value = withTiming(theme.textColor || '#FFFFFF', { duration: 300 });
    secondaryTextColor.value = withTiming(theme.secondaryTextColor || '#B3B3B3', { duration: 300 });
  }, [theme]);

  const animatedDrawerStyle = useAnimatedStyle(() => ({
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
      } catch (e) {
        console.log("Failed to load data:", e);
      }
    };
    loadData();
  }, []);

  const handleViewProfile = () => {
    props.navigation.closeDrawer();
    props.navigation.navigate('TabNavigator', { screen: 'Profile' });
  };

  const handleSettings = () => {
    props.navigation.closeDrawer();
    props.navigation.navigate('Settings');
  };

  const handleNotImplemented = () => {
    Alert.alert('Not Implemented', 'This feature is not implemented yet.');
  };

  // Render dynamic content based on props.descriptors
  return (
    <Animated.View style={[styles.drawer, animatedDrawerStyle]}>
      <TouchableOpacity onPress={handleViewProfile} style={styles.profileSection}>
        <View style={styles.profileAvatarWrapper}>
          {profile.avatar ? (
            <Image source={{ uri: profile.avatar }} style={styles.profileAvatar} />
          ) : (
            <View style={[styles.profileAvatar, { backgroundColor: profile.avatarBg }]}>
              <Animated.Text style={[styles.profileAvatarText, animatedTextStyle]}>
                {profile.username ? profile.username.charAt(0).toUpperCase() : "?"}
              </Animated.Text>
            </View>
          )}
        </View>
        <View style={styles.profileInfo}>
          <Animated.Text style={[styles.profileName, animatedTextStyle]}>{profile.username || "zai.cxg"}</Animated.Text>
          <Animated.Text style={[styles.viewProfile, animatedSecondaryTextStyle]}>View profile</Animated.Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={handleNotImplemented}>
        <Ionicons name="add-outline" size={24} color={textColor.value} />
        <Animated.Text style={[styles.itemText, animatedTextStyle]}>Add account</Animated.Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={handleNotImplemented}>
        <Ionicons name="flash-outline" size={24} color={textColor.value} />
        <Animated.Text style={[styles.itemText, animatedTextStyle]}>What's new</Animated.Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={handleNotImplemented}>
        <Ionicons name="time-outline" size={24} color={textColor.value} />
        <Animated.Text style={[styles.itemText, animatedTextStyle]}>Recents</Animated.Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={handleNotImplemented}>
        <Ionicons name="notifications-outline" size={24} color={textColor.value} />
        <Animated.Text style={[styles.itemText, animatedTextStyle]}>Your Updates</Animated.Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={handleSettings}>
        <Ionicons name="settings-outline" size={24} color={textColor.value} />
        <Animated.Text style={[styles.itemText, animatedTextStyle]}>Settings and privacy</Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
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
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  viewProfile: {
    fontSize: 14,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
});