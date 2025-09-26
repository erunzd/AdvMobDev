import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import { useWindowDimensions } from "react-native";
import CustomDrawerContent from "./CustomDrawerContent";
import Profile from "./Profile";
import Settings from "./Settings";
import Playlist from "./Playlist";

const Drawer = createDrawerNavigator();

export default function DrawerLayout() {
  const dimensions = useWindowDimensions();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
          headerShown: false,
        headerStyle: { backgroundColor: "#121212" },
        headerTintColor: "#fff",
        drawerStyle: { backgroundColor: "#121212", width: 240 },
        sceneContainerStyle: { backgroundColor: "#121212" },
        drawerType: dimensions.width >= 768 ? "permanent" : "slide",
        overlayColor: "rgba(0,0,0,0.6)",
        drawerHideStatusBarOnOpen: true,
      }}
    >
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="Playlist" component={Playlist} />
    </Drawer.Navigator>
  );
}