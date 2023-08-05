import { useState } from "react";
import {
  View,
  TextInput,
  Image,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { addListing } from "../services/firebaseService";
import Constants from "../constants/Label";

const CreateListingScreen = ({ route, navigation }) => {
  const { vehicle } = route.params;
  const seatCapacityOptions = ["2", "3", "4", "5", "6", "7", "8"];
  const fuelTypeOptions = ["BEV", "PHEV"];

  const [formInput, setFormInput] = useState({
    name: vehicle.name,
    images: vehicle.images,
    seat: `${vehicle.seat}`,
    fuel: `${vehicle.fuel}`,
    year: `${vehicle.year}`,
    range: `${vehicle.range}`,
    licensePlate: "",
    pickupAddress: "",
    rentalPrice: "",
  });

  const onFormChanged = (field, newValue) => {
    if (
      (field === Constants.FIELD_YEAR || field === Constants.FIELD_RENTAL_PRICE) &&
      isNaN(newValue)
    ) {
      return;
    }

    const updatedData = { ...formInput };
    updatedData[field] = newValue;
    setFormInput(updatedData);
  };

  const onFormSubmitted = async () => {
    const emptyValueFound = Object.values(formInput).some(
      (val) => val.toString().trim() === ""
    );

    if (emptyValueFound) {
      Alert.alert("Error", "Form must not contain empty values");
      return;
    }

    const result = await addListing(vehicle, formInput);

    result.isAdded
      ? Alert.alert("Success", "Listing Added", [
          {
            text: "Dismiss",
            onPress: () => navigation.goBack(),
            style: "cancel",
          },
        ])
      : Alert.alert("Error", result.error?.toString());
  };

  return (
    <View style={styles.container}>
      {/* Android depends on flexGrow: 1 on ScrollView, unnecessary to set "height" */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.descContainer}>
              <Image source={{ uri: vehicle.images[0] }} style={styles.image} />
              <Text style={styles.descLabel}>{vehicle.name}</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleInfoLabel}>Seat Capacity</Text>
                <SegmentedControl
                  values={seatCapacityOptions}
                  selectedIndex={seatCapacityOptions.indexOf(formInput.seat)}
                  onChange={(event) => {
                    const selectedIndex =
                      event.nativeEvent.selectedSegmentIndex;
                    onFormChanged(
                      Constants.FIELD_SEAT,
                      seatCapacityOptions[selectedIndex]
                    );
                  }}
                  fontStyle={{ color: "black" }}
                />
              </View>

              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleInfoLabel}>Fuel Type</Text>
                <SegmentedControl
                  values={fuelTypeOptions}
                  selectedIndex={fuelTypeOptions.indexOf(formInput.fuel)}
                  onChange={(event) => {
                    const selectedIndex =
                      event.nativeEvent.selectedSegmentIndex;
                    onFormChanged(
                      Constants.FIELD_FUEL,
                      fuelTypeOptions[selectedIndex]
                    );
                  }}
                  fontStyle={{ color: "black" }}
                />
              </View>

              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleInfoLabel}>Year</Text>
                <TextInput
                  value={formInput.year}
                  onChangeText={(value) =>
                    onFormChanged(Constants.FIELD_YEAR, value)
                  }
                  placeholder={Constants.PLACEHOLDER_MODEL_YEAR}
                  keyboardType="number-pad"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.ownerInfoContainer}>
                <Text style={styles.vehicleInfoLabel}>Owner Info</Text>
                <TextInput
                  value={formInput.licensePlate}
                  onChangeText={(value) =>
                    onFormChanged(Constants.FIELD_LICENSE_PLATE, value)
                  }
                  placeholder={Constants.PLACEHOLDER_LICENSE_PLATE}
                  autoCorrect={false}
                  autoCapitalize="characters"
                  style={styles.textInput}
                />

                <TextInput
                  value={formInput.rentalPrice}
                  onChangeText={(value) =>
                    onFormChanged(Constants.FIELD_RENTAL_PRICE, value)
                  }
                  placeholder={Constants.PLACEHOLDER_RENTAL_PRICE}
                  keyboardType="decimal-pad"
                  style={styles.textInput}
                />

                <TextInput
                  value={formInput.pickupAddress}
                  onChangeText={(value) =>
                    onFormChanged(Constants.FIELD_PICKUP_ADDRESS, value)
                  }
                  placeholder={Constants.PLACEHOLDER_PICKUP_ADDRESS}
                  autoCorrect={false}
                  autoCapitalize="words"
                  style={styles.textInput}
                />
              </View>

              <Pressable onPress={onFormSubmitted} style={styles.btn}>
                <Text style={styles.btnLabel}>{Constants.PLACEHOLDER_CREATE_BUTTON}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateListingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
  descContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  image: {
    resizeMode: "contain",
    height: 190,
    width: 250,
  },
  descLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  formContainer: {
    width: "90%",
    alignSelf: "center",
    paddingVertical: 10,
  },
  vehicleInfo: {
    marginVertical: 5,
  },
  vehicleInfoLabel: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
  },
  ownerInfoContainer: {
    paddingHorizontal: 0,
    backgroundColor: "white",
  },
  textInput: {
    backgroundColor: "#efefef",
    borderRadius: 12,
    padding: 10,
    marginVertical: 5,
  },
  btn: {
    alignSelf: "center",
    width: "100%",
    backgroundColor: "#068FFF",
    borderRadius: 16,
    paddingVertical: 16,
    marginVertical: 10,
  },
  btnLabel: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});
