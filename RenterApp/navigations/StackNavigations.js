import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import ListingDetailsScreen from "../screens/ListingDetailsScreen";
import TabNavigations from "./TabNavigations";
import { ScreenName as Constants } from "../constants/common";

const Stack = createNativeStackNavigator();

const StackNavigations = (props) => {
  return (
    <Stack.Navigator>
      {props.isLoggedIn ? (
        <>
          <Stack.Screen
            name={Constants.STACK_MAIN}
            component={TabNavigations}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={Constants.SCREEN_LISTING_DETAILS}
            component={ListingDetailsScreen}
          />
        </>
      ) : (
        <Stack.Screen
          name={Constants.SCREEN_LOGIN}
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

export default StackNavigations;
