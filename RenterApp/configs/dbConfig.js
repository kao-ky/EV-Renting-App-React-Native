import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC9Z0R3a8uBLMRIgAy8vSeNZ-CYupt8o4s",
  authDomain: "react-native-ev-project.firebaseapp.com",
  projectId: "react-native-ev-project",
  storageBucket: "react-native-ev-project.appspot.com",
  messagingSenderId: "93729227449",
  appId: "1:93729227449:web:2b0db43f2340dd6ab9d168",
  measurementId: "G-Z6318SRS8F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
