import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StatusBar,  
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { login } from "../services/firebaseService";

const LoginScreen = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const onFormChanged = (field, newValue) => {
    const updatedCredentials = { ...credentials };
    updatedCredentials[field] = newValue;
    setCredentials(updatedCredentials);
  };

  const onLoginPressed = async () => {
    const isLoggedIn = await login(credentials.email, credentials.password);
    if (!isLoggedIn) {
      Alert.alert("Login Failure", "Please check your credentials and network connection")
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenPadding}>
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color="black" />
          <TextInput
            value={credentials.email}
            onChangeText={(value) => onFormChanged("email", value)}
            placeholder="Email"
            style={styles.textInput}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="key-sharp" size={24} color="black" />
          <TextInput
            value={credentials.password}
            onChangeText={(value) => onFormChanged("password", value)}
            placeholder="Password"
            style={styles.textInput}
          />
        </View>

        <Pressable onPress={onLoginPressed} style={styles.btn}>
          <Text style={styles.btnLabel}>LOGIN</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  screenPadding: {
    width: "85%",
  },
  inputContainer: {
    width: "100%",
    backgroundColor: "#efefef",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  btn: {
    borderWidth: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#24A0ED",
    borderColor: "#24A0ED",
    borderRadius: 8,
    paddingVertical: 16,
    marginVertical: 10,
  },
  btnLabel: {
    fontSize: 16,
    color: "#FFF",
  },
});
