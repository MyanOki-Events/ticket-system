import { iniApp } from "./firebase_app";
import { getDatabase } from "firebase/database";

const realtimeDb = getDatabase(iniApp);

export { realtimeDb }