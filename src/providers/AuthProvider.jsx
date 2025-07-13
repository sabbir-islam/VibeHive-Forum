import React, { useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import app from "../Firebase/firebase.config";
import { AuthContext } from "./authContext";

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  // Function to check if admin data exists in localStorage
  const checkAdminLogin = () => {
    try {
      const adminInfo = localStorage.getItem("adminInfo");
      const adminEmail = localStorage.getItem("adminEmail");

      console.log("AuthProvider: Checking for admin login", {
        adminEmail,
        hasAdminInfo: !!adminInfo,
      });

      if (adminInfo && adminEmail) {
        const adminData = JSON.parse(adminInfo);

        // Ensure the admin data has the correct structure
        const validatedAdminData = {
          ...adminData,
          role: "admin", // Ensure role is always set
          email: adminEmail,
          // Add any missing required fields
          name: adminData.name || "Admin User",
          photo: adminData.photo || "https://i.ibb.co/ZJP3sFZ/admin.png",
        };

        console.log("AuthProvider: Found valid admin data", validatedAdminData);
        return validatedAdminData;
      }
      console.log("AuthProvider: No admin data found");
      return null;
    } catch (error) {
      console.error("Error checking admin login:", error);
      return null;
    }
  };

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logout = () => {
    setLoading(true);
    // Clear admin data on logout
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminInfo");
    return signOut(auth);
  };

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");

    // First check for admin login from localStorage (this is independent of Firebase auth)
    const checkAndSetAdmin = () => {
      const adminData = checkAdminLogin();
      if (adminData) {
        console.log("AuthProvider: Using admin data from localStorage");
        setCurrentUser({
          ...adminData,
          email: localStorage.getItem("adminEmail") || adminData.email,
          role: "admin", // Ensure role is set explicitly
        });
        return true;
      }
      return false;
    };

    // Initial check for admin
    const isAdmin = checkAndSetAdmin();

    // Only set up Firebase auth listener if not already logged in as admin
    const unsubscribe = isAdmin
      ? () => {} // No-op if admin is already logged in
      : onAuthStateChanged(auth, (user) => {
          console.log("AuthProvider: Auth state changed", {
            user: user?.email,
          });

          // Check for admin login first (in case it was set after component mounted)
          if (!checkAndSetAdmin()) {
            // If not admin, use Firebase user if available
            if (user) {
              console.log("AuthProvider: Setting current user from Firebase");
              setCurrentUser(user);
            } else {
              console.log("AuthProvider: No user logged in");
              setCurrentUser(null);
            }
          }

          setLoading(false);
        });

    // Set loading to false in case we have an admin user and don't trigger the auth state change
    if (isAdmin) {
      setLoading(false);
    }

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    currentUser,
    createUser,
    signIn,
    signInWithGoogle,
    logout,
    checkAdminLogin,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
