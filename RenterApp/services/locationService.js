import * as Location from "expo-location";

const checkPermission = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.debug("No location permission for geocoding")
    throw new Error("Location required for adding listing");
  }
};

const doForwardGeocode = async (address) => {
  console.log("Performing forward geocoding");

  await checkPermission();

  const geocodedLocation = await Location.geocodeAsync(address);

  const result = geocodedLocation[0];
  if (result === undefined) {
    console.debug("No coordinates found during forward geocoding");
    throw new Error("Pickup address cannot be identified");
  }

  console.log(`Forward geocoding result: ${JSON.stringify(result, null, 2)}`);
  return { latitude: result.latitude, longitude: result.longitude };
};

const doReverseGeocode = async (coords) => {
  console.log("Performing reverse geocoding");

  await checkPermission();

  const address = await Location.reverseGeocodeAsync(coords);
  const result = address[0];

  if (result === undefined) {
    console.debug("No address found during reverse geocoding");
    throw new Error("Pickup address cannot be identified");
  }

  console.log(`Reverse geocoding result: ${JSON.stringify(result, null, 2)}`);
  return result;
};

const getCurrentLocation = async () => {
  try {
  // 1. get permissions
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
      alert(`Permission to access location was denied`)
  return
  }
        // 2. if permission granted, then get the location
        // - The first time, this can take 5-30 seconds to complete
        let location = 
              await Location.getCurrentPositionAsync();      
        
  //       console.log(`The current location is:`)
  //       console.log(location)
  // alert(JSON.stringify(location))
  return location
     } catch (err) {
  console.log(err)
     }
  }
  

export { doForwardGeocode, doReverseGeocode, getCurrentLocation };
