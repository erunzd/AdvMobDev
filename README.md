# AdvMobDev  

This repository contains my first project in the **Advanced Mobile Software Development** course.  
It is a prototype mobile application built with **React Native** and **Expo Router**, featuring Spotify-inspired screens and navigation patterns.  

---

## 📱 Screenshots  

## First Activity

<p align="center">
  <img width="250" alt="beforeClick" src="https://github.com/user-attachments/assets/0c610a34-aa15-4cf8-98ff-8bdad339daca" />
  <img width="250" alt="afterClick" src="https://github.com/user-attachments/assets/2fc9766d-6b89-4056-9108-4adc608ab02e" />
</p>

## Spotify Activity - Week 2

### 🔑 Login / Sign Up  
<p align="center">
  <img src="https://github.com/user-attachments/assets/f7fa34b3-fdc7-46e6-986f-d6ce3c146c01" alt="Login" width="250" />
  <img src="https://github.com/user-attachments/assets/ba48cc8d-c0ec-429d-af83-a12f3cd4c32c" alt="SignUp" width="250" />
</p>

### 📂 Content Screens  
<p align="center">
  <img src="https://github.com/user-attachments/assets/a409dc52-c2e8-41a5-b1a2-1f1e35d4dfb7" alt="Profile" width="250" />
  <img src="https://github.com/user-attachments/assets/7347f7da-98d5-4f2a-8137-3fe006e3ed3e" alt="Settings" width="250" />
  <img src="https://github.com/user-attachments/assets/668988a9-0a9e-4ddc-9756-77bb05a587de" alt="Playlist" width="250" />
</p>

### 📑 Drawer  
<p align="center">
  <img src="https://github.com/user-attachments/assets/67fcd084-6eb5-4da9-b3ee-cc588bf56677" alt="DrawerV1" width="250" />
</p>

---

## 🧭 Navigation Flow  
The application uses a **stack navigator** for the authentication flow (Login and Sign Up), while a **custom drawer navigator** manages access to the main screens (Profile, Settings, and Playlists). Users start at the Login screen, can register via the Sign Up screen, and once authenticated, they gain access to the drawer-based main app. The drawer features smooth **animated slide-in transitions** powered by `react-native-reanimated`. For accessibility, intuitive labels, consistent iconography, and touch-friendly buttons ensure the app is easy to navigate for all users.  

---

## Week 4 - Activity 2: Spotify Profile Creation
The profile module enforces input validation by requiring usernames to be at least three characters long and emails to conform to a regex-based format check prior to persisting data. UI responsiveness is enhanced through react-native-reanimated, where theme-driven color values are bound to shared values and animated via withTiming transitions for smooth updates. Profile data (username, email, avatar, and background) is serialized to AsyncStorage on save, and the ProfileScreen leverages useFocusEffect to rehydrate state whenever the screen is revisited. This guarantees that the profile preview remains consistent with the latest persisted user data without requiring a manual refresh.

<p align="center">
  <img width="250" alt="editProfile" src="https://github.com/user-attachments/assets/290c05d1-b73c-4a04-9835-e2c6a4f10317" />
  <img width="250"alt="updatedProfile" src="https://github.com/user-attachments/assets/355608fa-f23b-430d-923a-61c800e3e946" />
</p>

---

## Week 5 - Activity 1: Theme Switcher

---

## ⚙️ Tech Stack  
- React Native  
- Expo Router  
- @react-navigation/drawer  
- react-native-reanimated  
- @expo/vector-icons  

---

## 📌 Notes  
- This is a prototype project created for educational purposes.  
- Future improvements may include API integration, persistent login, and user profile editing.  
