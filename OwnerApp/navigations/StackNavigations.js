import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CreateListingScreen from "../screens/CreateListingScreen"
import LoginScreen from "../screens/LoginScreen"
import TabNavigations from "./TabNavigations"
import Constants from "../constants/ScreenName";

const Stack = createNativeStackNavigator();

const StackNavigations = (props) => {
    return (
        <Stack.Navigator>
        {props.isLoggedIn ? (
          <>
            <Stack.Screen
              name={Constants.SCREEN_MAIN}
              component={TabNavigations}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={Constants.SCREEN_CREATE_LISTING}
              component={CreateListingScreen}
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
    )
}

export default StackNavigations