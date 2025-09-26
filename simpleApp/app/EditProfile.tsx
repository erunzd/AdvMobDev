import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useTheme } from '../redux/theme';

const colors = ["#E84E1D", "#1DB954", "#E91E63", "#3F51B5", "#FF9800"];

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarBg, setAvatarBg] = useState(colors[Math.floor(Math.random() * colors.length)]);

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isValid, setIsValid] = useState(false);

  const backgroundColor = useSharedValue(theme.backgroundColor);
  const textColor = useSharedValue(theme.textColor);
  const secondaryTextColor = useSharedValue(theme.secondaryTextColor);
  const inputBackground = useSharedValue(theme.inputBackground);

  useEffect(() => {
    backgroundColor.value = withTiming(theme.backgroundColor, { duration: 300 });
    textColor.value = withTiming(theme.textColor, { duration: 300 });
    secondaryTextColor.value = withTiming(theme.secondaryTextColor, { duration: 300 });
    inputBackground.value = withTiming(theme.inputBackground, { duration: 300 });
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
  const animatedInputStyle = useAnimatedStyle(() => ({
    backgroundColor: inputBackground.value,
    color: textColor.value,
  }));

  const validateFields = () => {
    const newUsernameError = username.length < 3 ? "Username must be at least 3 characters." : "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newEmailError = !emailRegex.test(email) ? "Please enter a valid email address." : "";

    setUsernameError(newUsernameError);
    setEmailError(newEmailError);

    setIsValid(!newUsernameError && !newEmailError);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem("userProfile");
        if (savedProfile) {
          const { username, email, avatar, avatarBg } = JSON.parse(savedProfile);
          setUsername(username || "");
          setEmail(email || "");
          setAvatar(avatar || null);
          setAvatarBg(avatarBg || colors[0]);
        }
      } catch (e) {
        console.log("Failed to load profile:", e);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    validateFields();
  }, [username, email]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Please allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setAvatar(result.assets[0].uri);
    }
  };

  const saveProfile = async () => {
    if (!isValid) {
      Alert.alert("Validation Error", "Please fix the errors below.");
      return;
    }

    const profileData = { username, email, avatar, avatarBg };
    try {
      await AsyncStorage.setItem("userProfile", JSON.stringify(profileData));
      Alert.alert("Success", "Profile updated!");
      navigation.goBack();
    } catch (e) {
      console.log("Failed to save profile:", e);
    }
  };

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <Animated.Text style={[styles.headerTitle, animatedTextStyle]}>Edit Profile</Animated.Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.avatarWrapper}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
            <Animated.Text style={[styles.avatarText, animatedTextStyle]}>
              {username ? username[0].toUpperCase() : "?"}
            </Animated.Text>
          </View>
        )}
        <TouchableOpacity style={[styles.changeAvatarBtn, { backgroundColor: theme.accentColor }]} onPress={pickImage}>
          <Animated.Text style={[styles.changeAvatarText, animatedTextStyle]}>
            {avatar ? "Change Photo" : "Add Photo"}
          </Animated.Text>
        </TouchableOpacity>
      </View>

      <Animated.Text style={[styles.label, animatedSecondaryTextStyle]}>Username</Animated.Text>
      <Animated.View style={[styles.input, animatedInputStyle, usernameError ? styles.inputError : null]}>
        <TextInput
          style={{ color: theme.textColor, fontFamily: 'SpotifyMix-Regular' }}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username"
          placeholderTextColor={theme.secondaryTextColor}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </Animated.View>
      {usernameError ? <Animated.Text style={[styles.errorText, animatedTextStyle]}>{usernameError}</Animated.Text> : null}

      <Animated.Text style={[styles.label, animatedSecondaryTextStyle]}>Email</Animated.Text>
      <Animated.View style={[styles.input, animatedInputStyle, emailError ? styles.inputError : null]}>
        <TextInput
          style={{ color: theme.textColor, fontFamily: 'SpotifyMix-Regular' }}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email"
          placeholderTextColor={theme.secondaryTextColor}
          keyboardType="email-address"
          autoComplete="email"
        />
      </Animated.View>
      {emailError ? <Animated.Text style={[styles.errorText, animatedTextStyle]}>{emailError}</Animated.Text> : null}

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: theme.accentColor }, !isValid ? styles.saveButtonDisabled : null]}
        onPress={saveProfile}
        disabled={!isValid}
      >
        <Animated.Text style={[styles.saveText, animatedTextStyle, !isValid ? styles.saveTextDisabled : null]}>SAVE</Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: 'SpotifyMix-Bold',
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 20,
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
  changeAvatarBtn: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  changeAvatarText: {
    fontWeight: "600",
    fontFamily: 'SpotifyMix-Regular',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    marginTop: 12,
    fontFamily: 'SpotifyMix-Regular',
  },
  input: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  inputError: {
    borderWidth: 1,
    borderColor: "#f44336",
  },
  errorText: {
    color: "#f44336",
    fontSize: 12,
    marginBottom: 8,
    fontFamily: 'SpotifyMix-Regular',
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 40,
  },
  saveButtonDisabled: {
    backgroundColor: "#666",
  },
  saveText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: 'SpotifyMix-Bold',
  },
  saveTextDisabled: {
    color: "#999",
  },
});