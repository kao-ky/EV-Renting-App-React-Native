import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";

import logoutButton from "../components/logoutButton";
import SearchScreen from "../screens/SearchScreen";
import ReservationScreen from "../screens/ReservationScreen";
import { ScreenName as Constants } from "../constants/common";

const Tab = createBottomTabNavigator();

const TabNavigations = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === Constants.SCREEN_SEARCH) {
            iconName = "car";
          } else if (route.name === Constants.SCREEN_RESERVATIONS) {
            iconName = "carryout";
          }

          return <AntDesign name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#24A0ED",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name={Constants.SCREEN_SEARCH}
        component={SearchScreen}
        options={{
          headerRight: () => logoutButton(),
        }}
      />
      <Tab.Screen
        name={Constants.SCREEN_RESERVATIONS}
        component={ReservationScreen}
        options={{
          headerRight: () => logoutButton(),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigations;
