import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";

import ListingScreen from "../screens/ListingScreen";
import BookingScreen from "../screens/BookingScreen";
import logoutButton from "../components/logoutButton";
import Constants from "../constants/ScreenName";

const Tab = createBottomTabNavigator();

const TabNavigations = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === Constants.SCREEN_LISTING) {
            iconName = "car";
          } else if (route.name === Constants.SCREEN_BOOKING) {
            iconName = "carryout";
          }

          return <AntDesign name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#24A0ED",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name={Constants.SCREEN_LISTING}
        component={ListingScreen}
        options={{
          headerRight: () => logoutButton(),
        }}
      />
      <Tab.Screen
        name={Constants.SCREEN_BOOKING}
        component={BookingScreen}
        options={{
          headerRight: () => logoutButton(),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigations;
