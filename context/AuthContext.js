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
  checkOnboardingStatus: async () => false,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync user profile in Firestore
  const syncUserProfile = async (firebaseUser, additionalData = {}) => {
    if (!firebaseUser) return { hasCompletedOnboarding: false, preferences: {} };
    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const initialDoc = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || null,
          displayName: firebaseUser.displayName || additionalData.displayName || "شيف أكلة",
          photoURL: firebaseUser.photoURL || null,
          isAnonymous: firebaseUser.isAnonymous || false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          hasCompletedOnboarding: false,
          preferences: {},
        };
        await setDoc(userRef, initialDoc);
        return { hasCompletedOnboarding: false, preferences: {} };
      } else {
        const data = userSnap.data() || {};
        await setDoc(
          userRef,
          {
            updatedAt: serverTimestamp(),
            ...(additionalData.displayName ? { displayName: additionalData.displayName } : {}),
          },
          { merge: true }
        );

        const hasStoredPrefs =
          data.preferences?.proteins &&
          Object.keys(data.preferences.proteins).length > 0;
        const isCompleted = data.hasCompletedOnboarding === true || hasStoredPrefs;

        return {
          hasCompletedOnboarding: isCompleted,
          preferences: data.preferences || {},
        };
      }
    } catch (err) {
      console.error("Error syncing user profile:", err);
      return { hasCompletedOnboarding: false, preferences: {} };
    }
  };

  const checkOnboardingStatus = async (uid) => {
    if (!uid) return false;
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data() || {};
        const hasStoredPrefs =
          data.preferences?.proteins &&
          Object.keys(data.preferences.proteins).length > 0;
        return data.hasCompletedOnboarding === true || hasStoredPrefs;
      }
    } catch (err) {
      console.warn("Error checking onboarding status:", err);
    }
    return false;
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
    const profile = await syncUserProfile(userCredential.user, { displayName });
    return {
      user: userCredential.user,
      hasCompletedOnboarding: profile?.hasCompletedOnboarding ?? false,
    };
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await syncUserProfile(userCredential.user);
    return {
      user: userCredential.user,
      hasCompletedOnboarding: profile?.hasCompletedOnboarding ?? false,
    };
  };

  const loginWithGoogle = async () => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const profile = await syncUserProfile(userCredential.user);
    return {
      user: userCredential.user,
      hasCompletedOnboarding: profile?.hasCompletedOnboarding ?? false,
    };
  };

  const loginAsGuest = async () => {
    const userCredential = await signInAnonymously(auth);
    const profile = await syncUserProfile(userCredential.user, { displayName: "ضيف أكلة" });
    return {
      user: userCredential.user,
      hasCompletedOnboarding: profile?.hasCompletedOnboarding ?? false,
    };
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
        checkOnboardingStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

