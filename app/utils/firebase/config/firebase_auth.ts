import { iniApp } from "./firebase_app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";

const auth = getAuth(iniApp);

setPersistence(auth, browserLocalPersistence)

export { auth }