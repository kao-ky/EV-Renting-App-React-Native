import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenName from "../constants/ScreenName"
import Constants from "../constants/Label";

const ListingScreen = ({ navigation }) => {
  const [vehiclesData, setVehiclesData] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVehiclesData, setFilteredVehiclesData] = useState([]);

  useEffect(() => {
    const fetchVehiclesData = async () => {
      try {
        const response = await fetch(
          "https://itsasr7.github.io/Vehicles/vehicles.json"
        );
        const json = await response.json();

        // only populate required info
        const filteredData = json.map((vehicleInfo) => ({
          name: `${vehicleInfo.make} ${vehicleInfo.model} ${vehicleInfo.trim}`,
          images: vehicleInfo.images.map((imageInfo) => imageInfo.url_full),
          seat: vehicleInfo.seats_max,
          fuel: vehicleInfo.fuel,
          year: vehicleInfo.model_year,
          range: vehicleInfo.total_range,
          handle: vehicleInfo.handle,
          make: vehicleInfo.make,
          model: vehicleInfo.model,
        }));

        setVehiclesData(filteredData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVehiclesData();
  }, []);

  const handleSearchQuery = (query) => {
    setSearchQuery(query);

    // Filter the vehicles based on the search query
    const filteredData = vehiclesData.filter((vehicle) =>
      vehicle.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredVehiclesData(filteredData);
  };

  const onListItemPressed = (vehicle) => {
    navigation.navigate(ScreenName.SCREEN_CREATE_LISTING, { vehicle: vehicle });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder={Constants.PLACEHOLDER_SEARCH}
          value={searchQuery}
          onChangeText={handleSearchQuery}
          autoCorrect={false}
        />
      </View>

      {searchQuery !== "" && filteredVehiclesData.length === 0 ? (
        <View style={styles.noSearchResultLabelContainer}>
        <Text style={styles.noSearchResultLabel}>No search results</Text>
        </View>
      ) : (
        <FlatList
          data={searchQuery ? filteredVehiclesData : vehiclesData}
          renderItem={(rowData) => {
            const vehicle = rowData.item;

            return (
              <Pressable onPress={() => onListItemPressed(vehicle)}>
                <View style={styles.listItem}>
                  <Text style={styles.carTitle}>{vehicle.name}</Text>

                  <View style={styles.carDetailsContainer}>
                    <Image
                      style={styles.image}
                      source={{ uri: vehicle.images[0] }}
                    />
                    <View style={styles.carInfo}>
                      <View style={styles.carInfoDetailContainer}>
                        <MaterialCommunityIcons
                          name="seat"
                          size={24}
                          color="black"
                        />
                        <Text style={styles.carInfoDetailLabel}>
                          {vehicle.seat}
                        </Text>
                      </View>

                      <View style={styles.carInfoDetailContainer}>
                        {vehicle.fuel === "BEV" ? (
                          <MaterialCommunityIcons
                            name="ev-station"
                            size={24}
                            color="black"
                          />
                        ) : (
                          <MaterialCommunityIcons
                            name="fuel-cell"
                            size={24}
                            color="black"
                          />
                        )}
                        <Text style={styles.carInfoDetailLabel}>
                          {vehicle.fuel}
                        </Text>
                      </View>

                      <View style={styles.carInfoDetailContainer}>
                        <MaterialCommunityIcons
                          name="timetable"
                          size={24}
                          color="black"
                        />
                        <Text style={styles.carInfoDetailLabel}>
                          {vehicle.year}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          }}
          keyExtractor={(vehicle) => vehicle.handle}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },
  listItem: {
    margin: 10,
    paddingTop: 10,
    width: "90%",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 16,
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#9DB2BF",
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  carDetailsContainer: {
    flexDirection: "row",
    padding: 2,
  },
  carInfoDetailContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  carInfoDetailLabel: {
    marginLeft: 5,
  },
  image: {
    resizeMode: "contain",
    height: 150,
    flex: 3,
  },
  carTitle: {
    width: "90%",
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  carInfo: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  searchBarContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "90%",
    alignSelf: "center",
    padding: 6,
    margin: 10,
  },
  searchBar: {
    fontSize: 16,
    textAlign: "center",
  },
  noSearchResultLabelContainer: {
    flex: 1,
    justifyContent: "center",
  },
  noSearchResultLabel: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18
  },
});

export default ListingScreen;
