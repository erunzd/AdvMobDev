import React, { useEffect } from "react"; // Added useEffect to React import
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
import CustomDrawerContent from "./CustomDrawerContent";
import ProfileScreen from "./Profile";
import SettingsScreen from "./Settings";
import PlaylistScreen from "./Playlist";
import HomeScreen from "./Home";
import SearchScreen from "./Search";
import PlaylistDetail from "./PlaylistDetail";
import { useTheme } from "../../redux/theme"; // Ensure this matches your Redux theme hook

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const theme = useTheme(); // Get the current theme
  console.log("Theme in TabNavigator:", theme); // Debug theme

  useEffect(() => {
    console.log("TabNavigator re-rendered with theme:", theme);
  }, [theme]); // Log re-render on theme change

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => {
        console.log("Route:", route.name, "Focused:", navigation.isFocused(), "Theme Mode:", theme.mode); // Debug
        return {
          headerShown: false,
          tabBarActiveTintColor: theme.mode === "dark" ? "#FFFFFF" : "#000000", // White in dark, black in light
          tabBarInactiveTintColor: theme.mode === "dark" ? "#B3B3B3" : "#757575", // Gray in dark, muted gray in light
          tabBarStyle: {
            backgroundColor: theme.backgroundColor || "#121212", // Fallback to dark if undefined
            borderTopWidth: 0,
            height: 60,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0, // Remove shadow on Android
            paddingTop: 5,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: 4,
            color: navigation.isFocused()
              ? theme.mode === "dark"
                ? "#FFFFFF"
                : "#000000"
              : theme.mode === "dark"
              ? "#B3B3B3"
              : "#757575",
          },
          tabBarIcon: ({ focused, color }) => {
            console.log("Icon Color:", color, "Focused:", focused, "Theme Mode:", theme.mode); // Debug icon color
            let iconName;
            if (route.name === "Home") iconName = "home-outline";
            else if (route.name === "Search") iconName = "search-outline";
            else if (route.name === "Playlist") iconName = "albums-outline";
            else if (route.name === "Profile") iconName = "person-outline";

            return <Ionicons name={iconName} size={24} color={color} />;
          },
        };
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Playlist" component={PlaylistScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function DrawerLayout() {
  const dimensions = useWindowDimensions();
  const theme = useTheme();
  console.log("Drawer Theme:", theme);

  return (
    <Drawer.Navigator
      initialRouteName="TabNavigator"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: theme.backgroundColor || "#121212" },
        headerTintColor: theme.textColor || "#FFFFFF",
        drawerStyle: { backgroundColor: theme.backgroundColor || "#121212", width: 240 },
        sceneContainerStyle: { backgroundColor: theme.backgroundColor || "#121212", paddingBottom: 60 }, // Adjust for tab bar
        drawerType: dimensions.width >= 768 ? "permanent" : "slide",
        overlayColor: "rgba(0,0,0,0.6)",
        drawerHideStatusBarOnOpen: true,
      }}
    >
      <Drawer.Screen name="TabNavigator" component={TabNavigator} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="PlaylistDetail" component={PlaylistDetail} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
}