import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { auth } from './firebaseConfig'; // Import your Firebase auth configuration
import { onAuthStateChanged, User } from 'firebase/auth';

// Define the type for the AuthContext
interface AuthContextType {
  currentUser: User | null;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Subscribe to the onAuthStateChanged listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Update the state with the current user
    });


      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User present
          setCurrentUser(user)
          // redirect to home if user is on /login page 
        } else {
          // User not logged in
          // redirect to login if on a protected page 
        }
      })
  

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children} {/* Render children within the AuthContext provider */}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider'); // Ensure that the hook is used correctly
  }
  return context; // Return the current context value
};
