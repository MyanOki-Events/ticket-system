import { ref, onValue,  } from "firebase/database";
import { realtimeDb } from "../config/firebase_realtime_db";

export const loadRealTimeData = (callback: (data: any) => void) => {
    const starCountRef = ref(realtimeDb, 'tickets');
    onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        callback(data)
    });
}