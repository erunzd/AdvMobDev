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

const colors = ["#E84E1D", "#1DB954", "#E91E63", "#3F51B5", "#FF9800"]; // fallback avatar bg colors

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarBg, setAvatarBg] = useState(colors[Math.floor(Math.random() * colors.length)]);

  // Validation states
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isValid, setIsValid] = useState(false);

  // Live validation function
  const validateFields = () => {
    const newUsernameError = username.length < 3 ? "Username must be at least 3 characters." : "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newEmailError = !emailRegex.test(email) ? "Please enter a valid email address." : "";

    setUsernameError(newUsernameError);
    setEmailError(newEmailError);

    setIsValid(!newUsernameError && !newEmailError);
  };

  // Load saved profile on mount
  useEffect(() => {
    const loadProfile = async () => {
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
    loadProfile();
  }, []);

  // Run validation on every change
  useEffect(() => {
    validateFields();
  }, [username, email]);

  // Pick image from gallery
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

  // Save profile
  const saveProfile = async () => {
    if (!isValid) {
      Alert.alert("Validation Error", "Please fix the errors below.");
      return;
    }

    const profileData = { username, email, avatar, avatarBg };
    try {
      await AsyncStorage.setItem("userProfile", JSON.stringify(profileData));
      Alert.alert("Success", "Profile updated!");
      navigation.goBack(); // go back to ProfileScreen
    } catch (e) {
      console.log("Failed to save profile:", e);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
            <Text style={styles.avatarText}>
              {username ? username[0].toUpperCase() : "?"}
            </Text>
          </View>
        )}
        <TouchableOpacity style={styles.changeAvatarBtn} onPress={pickImage}>
          <Text style={styles.changeAvatarText}>
            {avatar ? "Change Photo" : "Add Photo"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Username */}
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={[styles.input, usernameError ? styles.inputError : null]}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter username"
        placeholderTextColor="#777"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, emailError ? styles.inputError : null]}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter email"
        placeholderTextColor="#777"
        keyboardType="email-address"
        autoComplete="email"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, !isValid ? styles.saveButtonDisabled : null]}
        onPress={saveProfile}
        disabled={!isValid}
      >
        <Text style={[styles.saveText, !isValid ? styles.saveTextDisabled : null]}>SAVE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
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
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
    color: "#fff",
    fontSize: 48,
    fontWeight: "bold",
  },
  changeAvatarBtn: {
    marginTop: 10,
  },
  changeAvatarText: {
    color: "#1DB954",
    fontWeight: "600",
  },
  label: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
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
  },
  saveButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 40,
  },
  saveButtonDisabled: {
    backgroundColor: "#666",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveTextDisabled: {
    color: "#999",
  },
});