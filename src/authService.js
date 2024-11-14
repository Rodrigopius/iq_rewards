// src/authService.js
import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Register user and save additional info in Firestore
export const registerUser = async (email, password, username) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save additional info in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      username: username,
      email: email,
      createdAt: new Date(),
    });

    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Logout function
export const logout = async () => {
  try {
    await signOut(auth);
    console.log('User successfully logged out');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};
