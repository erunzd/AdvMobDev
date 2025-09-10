# AdvMobDev  

This repository contains my first project in the **Advanced Mobile Software Development** course.  
It is a prototype mobile application built with **React Native** and **Expo Router**, featuring Spotify-inspired screens and navigation patterns.  

---

## 📱 Screenshots  

- Login Screen/SignUp
<img width="1080" height="2400" alt="Login" src="https://github.com/user-attachments/assets/f7fa34b3-fdc7-46e6-986f-d6ce3c146c01" />
<img width="1080" height="2400" alt="SignUp" src="https://github.com/user-attachments/assets/ba48cc8d-c0ec-429d-af83-a12f3cd4c32c" />

- Content Screens  
<img width="1080" height="2400" alt="Profile" src="https://github.com/user-attachments/assets/a409dc52-c2e8-41a5-b1a2-1f1e35d4dfb7" />
<img width="1080" height="2400" alt="Settings" src="https://github.com/user-attachments/assets/7347f7da-98d5-4f2a-8137-3fe006e3ed3e" />
<img width="1080" height="2400" alt="Playlist" src="https://github.com/user-attachments/assets/668988a9-0a9e-4ddc-9756-77bb05a587de" />

- Drawer
<img width="1080" height="2400" alt="DrawerV1" src="https://github.com/user-attachments/assets/67fcd084-6eb5-4da9-b3ee-cc588bf56677" />


---

## 🧭 Navigation Flow  
The application uses a **stack navigator** for the authentication flow (Login and Sign Up), while a **custom drawer navigator** manages access to the main screens (Profile, Settings, and Playlists).  
Users start at the Login screen, can register via the Sign Up screen, and once authenticated, they gain access to the drawer-based main app.  
The drawer features smooth **animated slide-in transitions** powered by `react-native-reanimated`.  
For accessibility, intuitive labels, consistent iconography, and touch-friendly buttons ensure the app is easy to navigate for all users.  

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
