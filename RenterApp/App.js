import { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { auth } from "./configs/dbConfig";
import StackNavigations from "./navigations/StackNavigations";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const listener = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(user !== null ? true : false);
      console.log(
        `Auth state changed. ${
          user !== null ? `User uid: ${user.uid}` : "User not logged in"
        }`
      );
    });

    return listener;
  }, []);

  return isLoggedIn === null 
  ? (<ActivityIndicator />) 
  : (
    <NavigationContainer>
      <StackNavigations isLoggedIn={isLoggedIn} />
    </NavigationContainer>
  );
}

export default App;
