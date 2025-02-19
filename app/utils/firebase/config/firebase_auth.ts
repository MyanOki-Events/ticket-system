import { iniApp } from "./firebase_app";
import { getAuth } from "firebase/auth";

const auth = getAuth(iniApp);

export { auth }