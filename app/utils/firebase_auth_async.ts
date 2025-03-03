import { signInWithCredential, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase/config/firebase_auth";

// Sign in to Firebase when a user logs in with NextAuth
export const signInWithFirebase = async (idToken: string) => {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    await signInWithCredential(auth, credential);
  } catch (error) {
    throw error
  }
};

// Listen for Firebase auth state changes
export const getFirebaseUser = (setUser: (user: any) => void) => {
  return onAuthStateChanged(auth, (user) => {
    console.log("user", user)
    setUser(user);
  });
};

// Sign out of Firebase when the user logs out
export const signOutFromFirebase = async () => {
  await signOut(auth);
};
