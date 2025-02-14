import { iniApp } from "./firebase_app";
import { getStorage } from "firebase/storage";

const storage = getStorage(iniApp);

export { storage }