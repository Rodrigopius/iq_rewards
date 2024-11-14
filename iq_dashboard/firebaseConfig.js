// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";


// Your Firebase configuration details
const firebaseConfig = {
  apiKey: "AIzaSyDRq09oR3CdXX4gl2VwOUS0EBGZomxNM8Q",
  authDomain: "iq-reward.firebaseapp.com",
  projectId: "iq-reward",
  storageBucket: "iq-reward.firebasestorage.app",
  messagingSenderId: "1015394460046",
  appId: "1:1015394460046:web:0c19c5ac86000674e9c4df",
  measurementId: "G-7QKVL2WFN0"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get Firebase auth and Firestore instances
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Set persistence to localStorage (so user stays logged in across sessions)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    // Persistence is successfully set, can now proceed with authentication
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

// Export auth and db instances for use in the app
export { auth, db, storage,app };
