import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, Pressable } from "react-native";
import { logout } from "../services/firebaseService";

const logoutButton = () => {
  const alertLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => doLogout(),
      },
    ]);
  };

  const doLogout = async () => {
    const isLoggedOut = await logout();
    if (!isLoggedOut) {
      Alert.alert("Logout Failure", "Unknown error occurred")
    }
  }

  return (
    <Pressable onPress={() => alertLogout()} style={{ marginRight: 15 }}>
      <MaterialCommunityIcons name="logout-variant" size={24} color="black" />
    </Pressable>
  );
};

export default logoutButton;
