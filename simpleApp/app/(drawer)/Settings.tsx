import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, setAccentColor, setBackgroundColor } from '../../redux/themeSlice';
import { useTheme } from '../../redux/theme';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { RootState } from '../../redux/store';
import AsyncStorage from "@react-native-async-storage/async-storage";

const defaultAccentColors = ["#1DB954", "#FF4081", "#3F51B5", "#FF9800", "#00C4B4"];
const defaultBackgroundColors = ["#FFFFFF", "#000000", "#1E1E1E", "#F5F5F5", "#2C2C2C"];
const colors = ["#E84E1D", "#1DB954", "#E91E63", "#3F51B5", "#FF9800"];

export default function SettingsScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { mode } = useSelector((state: RootState) => state.theme);
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
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
        const savedTheme = await AsyncStorage.getItem("theme");
        if (savedTheme) {
          const { mode, accentColor, backgroundColor } = JSON.parse(savedTheme);
          dispatch(setTheme(mode));
          if (accentColor) dispatch(setAccentColor(accentColor));
          if (backgroundColor) dispatch(setBackgroundColor(backgroundColor));
        }
      } catch (e) {
        console.log("Failed to load data:", e);
      }
    };
    loadData();
  }, [dispatch]);

  const selectMode = (newMode: 'light' | 'dark' | 'custom') => {
    dispatch(setTheme(newMode));
    if (newMode === 'light') {
      dispatch(setBackgroundColor('#FFFFFF'));
    } else if (newMode === 'dark') {
      dispatch(setBackgroundColor('#121212'));
    }
  };

  const selectAccentColor = (color: string) => {
    dispatch(setAccentColor(color));
  };

  const selectBackgroundColor = (color: string) => {
    dispatch(setBackgroundColor(color));
  };

  const saveTheme = async () => {
    const themeData = { mode, accentColor: theme.accentColor, backgroundColor: theme.backgroundColor };
    try {
      await AsyncStorage.setItem("theme", JSON.stringify(themeData));
      Alert.alert("Success", "Theme settings saved!");
      setModalVisible(false);
    } catch (e) {
      console.log("Failed to save theme:", e);
      Alert.alert("Error", "Failed to save theme settings.");
    }
  };

  const handleItemPress = (item: string) => {
    if (item === 'Theme') {
      setModalVisible(true);
    } else {
      Alert.alert(`${item}`, 'This feature is not implemented yet.');
    }
  };

  const handleViewProfile = () => {
    navigation.navigate('Profile');
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
                {profile.username ? profile.username[0].toUpperCase() : "?"}
              </Text>
            </View>
          )}
        </View>
        <Animated.Text style={[styles.profileName, animatedTextStyle]}>{profile.username}</Animated.Text>
        <Animated.Text style={[styles.viewProfile, animatedSecondaryTextStyle]}>View profile</Animated.Text>
        <Ionicons name="chevron-forward" size={20} color={theme.secondaryTextColor} />
      </TouchableOpacity>

      {/* Settings List */}
      <View style={styles.listContainer}>
        {[
          'Account',
          'Data Saver',
          'Playback',
          'Content and display',
          'Theme',
          'Privacy and social',
          'Audio Quality',
          'Video Quality',
          'Storage',
          'Notifications',
          'Apps and devices',
          'About'
        ].map((item, index) => (
          <TouchableOpacity key={index} style={styles.listItem} onPress={() => handleItemPress(item)}>
            <Animated.Text style={[styles.listItemText, animatedTextStyle]}>{item}</Animated.Text>
            <Ionicons name="chevron-forward" size={20} color={theme.secondaryTextColor} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Log Out Button */}
      <TouchableOpacity style={styles.logOutButton} onPress={handleLogOut}>
        <Animated.Text style={[styles.logOutText, animatedTextStyle, { color: '#000000' }]}>Log out</Animated.Text>
      </TouchableOpacity>

      {/* Theme Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <Animated.View style={[styles.modalContainer, animatedContainerStyle]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color={theme.textColor} />
            </TouchableOpacity>
            <Animated.Text style={[styles.modalHeaderTitle, animatedTextStyle]}>Theme Settings</Animated.Text>
            <View style={{ width: 24 }} />
          </View>

          <Animated.Text style={[styles.sectionTitle, animatedTextStyle]}>Theme Mode</Animated.Text>

          <TouchableOpacity style={styles.modeOption} onPress={() => selectMode('light')}>
            <View style={styles.radioCircle}>
              {mode === 'light' && <View style={styles.selectedRb} />}
            </View>
            <View style={styles.modeTextContainer}>
              <Animated.Text style={[styles.modeLabel, animatedTextStyle]}>Light Theme</Animated.Text>
              <Animated.Text style={[styles.modeDescription, animatedSecondaryTextStyle]}>Bright and clean interface</Animated.Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modeOption} onPress={() => selectMode('dark')}>
            <View style={styles.radioCircle}>
              {mode === 'dark' && <View style={styles.selectedRb} />}
            </View>
            <View style={styles.modeTextContainer}>
              <Animated.Text style={[styles.modeLabel, animatedTextStyle]}>Dark Theme</Animated.Text>
              <Animated.Text style={[styles.modeDescription, animatedSecondaryTextStyle]}>Easy on the eyes, perfect for low light</Animated.Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modeOption} onPress={() => selectMode('custom')}>
            <View style={styles.radioCircle}>
              {mode === 'custom' && <View style={styles.selectedRb} />}
            </View>
            <View style={styles.modeTextContainer}>
              <Animated.Text style={[styles.modeLabel, animatedTextStyle]}>Custom Theme</Animated.Text>
              <Animated.Text style={[styles.modeDescription, animatedSecondaryTextStyle]}>Personalize your colors</Animated.Text>
            </View>
          </TouchableOpacity>

          {mode === 'custom' && (
            <View>
              <Animated.Text style={[styles.sectionTitle, animatedTextStyle]}>Customize Colors</Animated.Text>

              <Animated.Text style={[styles.label, animatedSecondaryTextStyle]}>Accent Color</Animated.Text>
              <View style={styles.colorPicker}>
                {defaultAccentColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[styles.colorOption, { backgroundColor: color }]}
                    onPress={() => selectAccentColor(color)}
                  />
                ))}
              </View>

              <Animated.Text style={[styles.label, animatedSecondaryTextStyle]}>Background Color</Animated.Text>
              <View style={styles.colorPicker}>
                {defaultBackgroundColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[styles.colorOption, { backgroundColor: color }]}
                    onPress={() => selectBackgroundColor(color)}
                  />
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: '#1DB954' }]}
            onPress={saveTheme}
          >
            <Animated.Text style={[styles.saveText, animatedTextStyle, { color: '#000000' }]}>Save</Animated.Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: 'SpotifyMix-Bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: 'SpotifyMix-Bold',
    marginBottom: 10,
  },
  modeOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1DB954',
  },
  modeTextContainer: {
    flex: 1,
  },
  modeLabel: {
    fontSize: 16,
    fontFamily: 'SpotifyMix-Regular',
  },
  modeDescription: {
    fontSize: 12,
    fontFamily: 'SpotifyMix-Regular',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    marginTop: 12,
    fontFamily: 'SpotifyMix-Regular',
  },
  colorPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  saveButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 40,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: 'SpotifyMix-Bold',
    color: "#000000",
  },
});