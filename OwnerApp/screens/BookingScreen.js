import React, { useState, useCallback } from "react";
import {
  Alert,
  FlatList,
  Image,
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  getUserAllBookingsDocs,
  updateBookingStatus,
} from "../services/firebaseService";
import Constants from "../constants/Label";

const BookingScreen = () => {
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
    const allBookings = await getUserAllBookingsDocs();
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

  const confirmBooking = async (bookingId, isApproving) => {
    const result = await updateBookingStatus(bookingId, isApproving);

    if (result.isUpdated) {
      getBookings();
      Alert.alert(`Booking ${result.bookingStatus}`);
    } else {
      Alert.alert(
        "Error",
        "Encountered unknown failure when changing booking status"
      );
    }
  };

  const alertBookingConfirmation = (bookingId, isApproving) => {
    const decision = isApproving ? Constants.ACTION_APPROVE : Constants.ACTION_DECLINE;

    Alert.alert(
      "Confirmation",
      `Are you sure you want to ${decision.toLowerCase()} this booking?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: decision,
          onPress: () => confirmBooking(bookingId, isApproving),
          style: isApproving ? "default" : "destructive",
        },
      ]
    );
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
                  <View style={styles.renterInfo}>
                    <Image
                      source={{ uri: booking.renterInfo.image }}
                      style={styles.renterImage}
                    />
                    <Text style={styles.renterNameLabel}>
                      {booking.renterInfo.name}
                    </Text>
                  </View>

                  <View style={styles.vehicleInfoContainer}>
                    <Text style={styles.vehicleInfoTitle}>Requests:</Text>
                    <View style={styles.vehicleInfo}>
                      <Text>
                        {booking.vehicle.make} {booking.vehicle.model}
                      </Text>
                      <Text>{booking.vehicle.licensePlate}</Text>
                      <Text>For ${booking.vehicle.rentalPrice.toFixed(2)}</Text>
                      {booking.requestDate !== undefined && (
                        <Text>on {booking.requestDate.split("T")[0]}</Text>
                      )}
                    </View>
                  </View>
                </View>

                <View style={styles.statusDetailsContainer}>
                  {booking.status === Constants.STATUS_PENDING && (
                    <Text style={[styles.statusRefLabel, { color: "#420000" }]}>
                      {Constants.ACTION_APPROVAL_REQUIRED.toUpperCase()}
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

                {(booking.status === Constants.STATUS_PENDING ||
                  booking.status === undefined) && (
                  <View style={styles.confirmStatusContainer}>
                    <Pressable
                      onPress={() => alertBookingConfirmation(booking.id, true)}
                      style={[
                        styles.changeStatusBtn,
                        { backgroundColor: "#039487" },
                      ]}
                    >
                      <Text style={styles.changeStatusBtnLabel}>
                        {Constants.ACTION_APPROVE}
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() =>
                        alertBookingConfirmation(booking.id, false)
                      }
                      style={[
                        styles.changeStatusBtn,
                        { backgroundColor: "#FF0021" },
                      ]}
                    >
                      <Text style={styles.changeStatusBtnLabel}>
                        {Constants.ACTION_DECLINE}
                      </Text>
                    </Pressable>
                  </View>
                )}
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
    // backgroundColor: "#919090",
  },
  filterLabel: {
    color: "#FFF",
    fontWeight: "bold",
  },
  listItemContainer: {
    width: "90%",
    borderWidth: 2,
    backgroundColor: "#edeff0",
    borderRadius: 16,
    alignSelf: "center",
    borderColor: "#9DB2BF",
    margin: 5,
  },
  listItemWidth: {
    width: "90%",
    alignSelf: "center",
    paddingVertical: 5,
  },
  listItemDescContainer: {
    flexDirection: "row",
    gap: 15,
  },
  renterInfo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  renterImage: {
    height: 70,
    width: 70,
    borderRadius: 50,
    marginBottom: 5,
  },
  renterNameLabel: {
    width: "80%",
    fontWeight: "bold",
    textAlign: "center",
  },
  vehicleInfoContainer: {
    flex: 2,
  },
  vehicleInfoTitle: {
    fontWeight: "bold",
  },
  vehicleInfo: {
    flex: 1,
    justifyContent: "space-evenly",
    height: 100,
  },
  statusRefLabel: {
    fontWeight: "bold",
    textAlign: "center",
    margin: 8,
    fontSize: 15,
  },
  confirmStatusContainer: {
    flexDirection: "row",
    gap: 20,
  },
  changeStatusBtn: {
    flex: 1,
    borderRadius: 5,
  },
  changeStatusBtnLabel: {
    paddingVertical: 5,
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default BookingScreen;
