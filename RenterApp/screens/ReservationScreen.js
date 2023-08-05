import React, { useState, useCallback } from "react";
import {
  FlatList,
  Image,
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getUserAllBookings } from "../services/firebaseService";
import { Status as Constants } from "../constants/common";

const ReservationScreen = () => {
  const [bookingsList, setBookingsList] = useState([]);
  const [filteredBookingsList, setFilteredBookingsList] = useState([]);
  const [filter, setFilter] = useState({
    useFilter: false,
    filterName: null,
  });


  useFocusEffect(
    useCallback(() => {
      getBookings();

      // reset to "All" filter upon tab on focused
      setFilter({
        useFilter: false,
        filterName: null,
      });
    }, [])
  );

  const getBookings = async () => {
    const allBookings = await getUserAllBookings();
    setBookingsList(allBookings);
  };

  const getAllBookings = () => {
    setFilter({
      useFilter: false,
      filterName: null,
    });

    setFilteredBookingsList(bookingsList);
  };

  const filterBookings = (status) => {
    setFilter({
      useFilter: true,
      filterName: status,
    });

    const result = bookingsList.filter((booking) => {
      if (booking.status === status) {
        return booking;
      }
    });
    setFilteredBookingsList(result);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filtersContainer}>
        <Pressable
          onPress={getAllBookings}
          style={[
            styles.filterBtn,
            {
              backgroundColor: filter.filterName === null ? "black" : "#919090",
            },
          ]}
        >
          <Text style={styles.filterLabel}>All</Text>
        </Pressable>
        <Pressable
          onPress={() => filterBookings(Constants.STATUS_CONFIRMED)}
          style={[
            styles.filterBtn,
            {
              backgroundColor:
                filter.filterName === Constants.STATUS_CONFIRMED
                  ? "black"
                  : "#919090",
            },
          ]}
        >
          <Text style={styles.filterLabel}>{Constants.STATUS_CONFIRMED}</Text>
        </Pressable>
        <Pressable
          onPress={() => filterBookings(Constants.STATUS_PENDING)}
          style={[
            styles.filterBtn,
            {
              backgroundColor:
                filter.filterName === Constants.STATUS_PENDING
                  ? "black"
                  : "#919090",
            },
          ]}
        >
          <Text style={styles.filterLabel}>{Constants.STATUS_PENDING}</Text>
        </Pressable>
        <Pressable
          onPress={() => filterBookings(Constants.STATUS_REJECTED)}
          style={[
            styles.filterBtn,
            {
              backgroundColor:
                filter.filterName === Constants.STATUS_REJECTED
                  ? "black"
                  : "#919090",
            },
          ]}
        >
          <Text style={styles.filterLabel}>{Constants.STATUS_REJECTED}</Text>
        </Pressable>
      </View>

      <FlatList
        data={filter.useFilter ? filteredBookingsList : bookingsList}
        renderItem={(rowData) => {
          const booking = rowData.item;

          return (
            <View style={styles.listItemContainer}>
              <View style={styles.listItemWidth}>
                <View style={styles.listItemDescContainer}>
                  <View style={styles.ownerInfo}>
                    <Image
                      source={{ uri: booking.ownerInfo.image }}
                      style={styles.ownerImage}
                    />
                    <Text style={styles.ownerNameLabel}>
                      {booking.ownerInfo.name}
                    </Text>
                  </View>

                  <View style={styles.vehicleInfoContainer}>
                    <Text style={styles.vehicleInfoTitle}>Requesting:</Text>
                    <View style={styles.vehicleInfo}>
                      <Text style={styles.vehicleInfoText}>
                        <Text style={styles.vehicleName}>
                          Vehicle: {booking.vehicle.make} {booking.vehicle.model}
                        </Text>
                      </Text>
                      <Text style={styles.vehicleInfoText}>
                        <Text style={styles.licensePlate}>
                          License Plate: {booking.vehicle.licensePlate}
                        </Text>
                      </Text>
                      <Text style={styles.vehicleInfoText}>
                        <Text style={styles.price}>
                          Price: ${booking.vehicle.rentalPrice.toFixed(2)}
                        </Text>
                      </Text>
                      {booking.requestDate !== undefined && (
                        <Text style={styles.vehicleInfoText}>
                          <Text style={styles.date}>
                            Date: {booking.requestDate.split("T")[0]}
                          </Text>
                        </Text>
                      )}
                    </View>
                  </View>
                </View>

                <View style={styles.statusDetailsContainer}>
                  {booking.status === Constants.STATUS_PENDING && (
                    <Text style={[styles.statusRefLabel, { color: "#420000" }]}>
                      {Constants.STATUS_PENDING.toUpperCase()}
                    </Text>
                  )}
                  {booking.status === Constants.STATUS_CONFIRMED &&
                    booking.referenceCode !== undefined && (
                      <Text style={[styles.statusRefLabel, { color: "blue" }]}>
                        {Constants.STATUS_CONFIRMED.toUpperCase()} ({booking.referenceCode})
                      </Text>
                    )}
                  {booking.status === Constants.STATUS_REJECTED && (
                    <Text style={[styles.statusRefLabel, { color: "red" }]}>
                      {Constants.STATUS_REJECTED.toUpperCase()}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          );
        }}
        keyExtractor={(booking) => booking.id}
      ></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  filtersContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  filterBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
  },
  filterLabel: {
    color: "#FFF",
    fontWeight: "bold",
  },
  listItemContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
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
  listItemWidth: {
    width: "90%",
    alignSelf: "center",
    paddingVertical: 0,
  },
  listItemDescContainer: {
    flexDirection: "row",
    gap: 15,
  },
  ownerInfo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ownerImage: {
    height: 70,
    width: 70,
    borderRadius: 50,
    marginBottom: 5,
  },
  ownerNameLabel: {
    width: "80%",
    fontWeight: "bold",
    textAlign: "center",
  },
  vehicleInfoContainer: {
    flex: 2,
    justifyContent: "space-around",
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  licensePlate: {
    fontSize: 14,
    marginBottom: 5,
    color: "#666",
  },
  price: {
    fontSize: 14,
    color: "#888",
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  statusRefLabel: {
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
    fontSize: 15,
  },
});

export default ReservationScreen;
