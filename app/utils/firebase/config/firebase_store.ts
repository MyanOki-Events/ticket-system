import { iniApp } from "./firebase_app";
import { getFirestore } from "firebase/firestore";

const storeDb = getFirestore(iniApp);

export { storeDb }