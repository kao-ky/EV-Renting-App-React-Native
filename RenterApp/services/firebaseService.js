import { signInWithEmailAndPassword } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../configs/dbConfig";
import DbConstants from "../constants/DbConstants";
import { Status as Constants } from "../constants/common";

const login = async (email, password) => {
  let isLoggedIn = false;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    isLoggedIn = true;
    console.log(`User ${auth.currentUser?.uid} logged in`);
  } catch (err) {
    console.log(`Error when signing in user: ${err}`);
  }

  return isLoggedIn;
};

const logout = async () => {
  let isLoggedOut = false;

  try {
    const userUid = auth.currentUser?.uid;
    await auth.signOut();
    isLoggedOut = true;
    console.log(`User (uid: ${userUid}) logged out`);
  } catch (err) {
    console.error(
      `Error when signing user (uid: ${auth.currentUser.uid} out: ${err}`
    );
  }

  return isLoggedOut;
};

// get all listings of the user's as a dictionary: allListings[listingId] = listingData
const getAllListings = async () => {
  try {
    const allListings = [];
    const listingDocs = await getDocs(
      collection(db, DbConstants.COLLECTION_LISTINGS)
    );
    listingDocs.forEach((doc) => {
      const listing = {
        ...doc.data(),
      };
      allListings[doc.id] = listing;
    });

    return allListings;
  } catch (err) {
    console.log(`Error when getting all listings: ${err}`);
    return [];
  }
};

// get all listings of the user's as a dictionary: allListings[listingId] = listingData
const getListingByListingId = async (listingId) => {
  try {
    const docRef = doc(db, DbConstants.COLLECTION_LISTINGS, listingId);
    const snapshot = await getDoc(docRef);
    return snapshot.data();
  } catch (err) {
    console.log(
      `Unable to get listing with listingId=${listingId}. Error: ${err}`
    );
    return;
  }
};

const getUserAllBookings = async () => {
  try {
    const bookingsList = [];

    const userBookingsQuery = query(
      collection(db, DbConstants.COLLECTION_BOOKINGS),
      where("renterUid", "==", auth.currentUser.uid)
    );

    const bookingDocs = await getDocs(userBookingsQuery);

    // Set booking info
    bookingDocs.forEach((doc) => {
      const booking = {
        id: doc.id,
        ...doc.data(),
      };
      bookingsList.push(booking);
    });

    const ownerUidInfoDict = [];

    // Set listing and owner info
    for (const [index, booking] of bookingsList.entries()) {
      const listingInfo = await getListingByListingId(booking.listingId);

      if (!(listingInfo.ownerUid in ownerUidInfoDict)) {
        const ownerInfo = await getOwnerInfoByOwnerUid(listingInfo.ownerUid);
        if (ownerInfo !== undefined || ownerInfo !== null) {
          ownerUidInfoDict[listingInfo.ownerUid] = ownerInfo;
        }
      }

      bookingsList[index] = {
        ...booking,
        vehicle: listingInfo,
        ownerInfo: {
          name: ownerUidInfoDict[listingInfo.ownerUid].name,
          image: ownerUidInfoDict[listingInfo.ownerUid].image,
        },
      };
    }

    //console.debug(`Bookings list: \n${JSON.stringify(bookingsList, null, 2)}`);
    console.log(`Retrieved all of the user's bookings. Booking Count: ${bookingsList.length}`);
    return bookingsList;
  } catch (err) {
    console.log(`Unable to retrieve all of the user's bookings. Error: ${err}`);
    return [];
  }
};

const getOwnerInfoByOwnerUid = async (ownerUid) => {
  try {
    const docRef = doc(db, DbConstants.COLLECTION_USERS, ownerUid);
    const snapshot = await getDoc(docRef);
    return snapshot.data();
  } catch (err) {
    console.log(
      `Unable to get ownerInfo on ownerUid ${ownerUid}. Error: ${err}`
    );
  }
};

const addBooking = async (listing, bookingDate) => {
  try {
    console.log(`Adding booking with user uid [${auth.currentUser.uid}]`);
    const renterUid = auth.currentUser.uid;
    const bookingCollection = collection(db, DbConstants.COLLECTION_BOOKINGS);

    const booking = {
      listingId: listing.id,
      renterUid: renterUid,
      requestDate: bookingDate,
      status: Constants.STATUS_PENDING,
    };
    console.log(booking);

    const addedDoc = await addDoc(bookingCollection, booking);
    console.log(`Documented added. Ref: ${addedDoc.id}`);
    console.log(`Booking: ${JSON.stringify(booking, null, 2)}`);
    return { isAdded: true, docId: addedDoc.id };
  } catch (err) {
    console.error(
      `Failed to add booking for user [uid: ${auth.currentUser?.uid}]. ${err}`
    );
    return { isAdded: false, error: err.message };
  }
};

export { login, logout, getAllListings, getUserAllBookings, addBooking };
