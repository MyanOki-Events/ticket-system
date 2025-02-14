import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config/firebase_auth";

const provider = new GoogleAuthProvider()

export { auth, provider, signInWithPopup, signOut, onAuthStateChanged }