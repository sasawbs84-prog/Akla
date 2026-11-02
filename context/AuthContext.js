"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  updateProfile,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  loginWithGoogle: async () => {},
  loginAsGuest: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync user profile in Firestore
  const syncUserProfile = async (firebaseUser, additionalData = {}) => {
    if (!firebaseUser) return;
    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: firebaseUser.uid,
          email: firebaseUser.email || null,
          displayName: firebaseUser.displayName || additionalData.displayName || "شيف أكلة",
          photoURL: firebaseUser.photoURL || null,
          isAnonymous: firebaseUser.isAnonymous || false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          hasCompletedOnboarding: false,
          preferences: {},
        });
      } else {
        await setDoc(
          userRef,
          {
            updatedAt: serverTimestamp(),
            ...(additionalData.displayName ? { displayName: additionalData.displayName } : {}),
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.error("Error syncing user profile:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    await syncUserProfile(userCredential.user, { displayName });
    return userCredential.user;
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await syncUserProfile(userCredential.user);
    return userCredential.user;
  };

  const loginWithGoogle = async () => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    await syncUserProfile(userCredential.user);
    return userCredential.user;
  };

  const loginAsGuest = async () => {
    const userCredential = await signInAnonymously(auth);
    await syncUserProfile(userCredential.user, { displayName: "ضيف أكلة" });
    return userCredential.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        loginWithGoogle,
        loginAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

