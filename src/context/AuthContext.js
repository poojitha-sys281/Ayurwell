// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext();
export function useAuth() { return useContext(AuthContext); }

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser]   = useState(null);
  const [userProfile, setUserProfile]   = useState(null);
  const [loading, setLoading]           = useState(true);

  // Create account (OTP already verified in Signup.js before calling this)
  async function signup(email, password, name, mobile) {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCred.user.uid), {
      name, email, mobile: mobile || "",
      createdAt: serverTimestamp(),
      dosha: null, healthProfile: null,
    });
    return userCred;
  }

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    setUserProfile(null);
    return signOut(auth);
  }

  async function saveOptionalProfile(data) {
    if (!currentUser) return;
    await setDoc(doc(db, "users", currentUser.uid),
      { optionalProfile: data, updatedAt: serverTimestamp() },
      { merge: true }
    );
  }

  // Returns the profile data AND sets it in state
  async function fetchUserProfile(uid) {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        const data = snap.data();
        setUserProfile(data);
        return data;           // ← LOGIN uses this to decide where to navigate
      }
      return null;
    } catch (e) {
      console.warn("Could not fetch user profile:", e.code);
      return null;
    }
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) fetchUserProfile(user.uid);
      else setUserProfile(null);
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{
      currentUser, userProfile,
      signup, login, logout,
      saveOptionalProfile, fetchUserProfile,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
