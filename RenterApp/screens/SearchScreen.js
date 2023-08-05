import React, { useState, useEffect, useCallback } from "react";
import {
  Alert,
  ActivityIndicator,
  Image,
  View,
  Text,
  StyleSheet,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import MapView, { Marker, Callout } from "react-native-maps";
import { Svg, Image as ImageSvg } from "react-native-svg";

import { getCurrentLocation } from "../services/locationService";

import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../configs/dbConfig";
import { addBooking } from "../services/firebaseService";

const SearchScreen = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [listingsList, setListingsList] = useState([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getUserLocation();
      getListings();
    }, [])
  );

  const getListings = async () => {
    // get all listings of the user's as a dictionary: allListings[listingId] = listingData
    const allListings = [];
    const listingDocs = await getDocs(collection(db, "Listings"));
    listingDocs.forEach((doc) => {
      const listing = {
        id: doc.id,
        ...doc.data(),
      };
      allListings.push(listing);
    });
    setListingsList(allListings);
  };

  const getUserLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setUserLocation(location.coords);
      setIsMapLoaded(true);
    } catch (err) {
      Alert.alert("Error", err.message);
      console.error(`Failed to get user location`);
    }
  };

  // If userLocation is not available, return null
  if (!userLocation) {
    return null;
  }

  const getRandomFutureDate = () => {
    const currentDate = new Date();
    const randomDays = Math.floor(Math.random() * 365); 
    const futureDate = new Date(currentDate.getTime() + randomDays * 24 * 60 * 60 * 1000); 
    return futureDate;
  };

  const doBooking = async (listing) => {
    const result = await addBooking(listing, getRandomFutureDate().toISOString());
    result.isAdded
      ? Alert.alert("Success", "Booking request sent")
      : Alert.alert("Error", "Unable to request vehicle");
  };

  if (!isMapLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {userLocation && (
        <MapView
          style={{ height: "100%", width: "100%" }}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
        >
          {listingsList.map((listing, index) => {
            const coords = {
              latitude: listing.pickupLocation.coordinates.latitude,
              longitude: listing.pickupLocation.coordinates.longitude,
            };

            return (
              <Marker
                key={index}
                coordinate={coords}
                title={listing.name}
                description={listing.desc}
              >
                <View style={styles.markerContainer}>
                  <Text style={{ color: "black", fontWeight: "bold" }}>
                    ${listing.rentalPrice}
                  </Text>
                </View>
                <Callout onPress={() => doBooking(listing)}>
                  <View style={styles.calloutContainer}>
                      <View style={styles.calloutImageContainer}>
                        <Svg>
                          <ImageSvg
                            width="100%"
                            height="85"
                            href={{ uri: listing.images[0] }}
                          />
                        </Svg>
                      </View>

                      <View style={styles.calloutContent}>
                        <Text style={styles.calloutTitle}>{listing.name}</Text>
                        <Text style={styles.calloutPrice}>
                          Price: ${listing.rentalPrice}
                        </Text>
                        <Text style={styles.calloutSeat}>
                          Seats: {listing.seat}
                        </Text>
                      </View>
                      <View style={styles.bookNowButton}>
                        <Text style={styles.bookNowButtonText}>Book Now</Text>
                      </View>
                    </View>
                  {/* </View> */}
                </Callout>
              </Marker>
            );
          })}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  markerContainer: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 20,
  },
  calloutContainer: {
    width: 200,
    height: 200,
    borderRadius: 10,
    elevation: 5,
  },
  calloutImageContainer: {
    height: 80,
  },
  calloutContent: {
    flex: 1,
    justifyContent: "space-evenly",
    width: "90%",
    alignSelf: "center",
    paddingVertical: 4,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  calloutPrice: {
    marginTop: 2,
    color: "red",
  },
  calloutSeat: {
    marginTop: 2,
    color: "black",
  },
  bookNowButton: {
    backgroundColor: "blue",
    paddingVertical: 5,
    borderRadius: 8,
  },
  bookNowButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SearchScreen;
