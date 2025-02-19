import { ref, onValue, push, child, update, get, remove } from "firebase/database";
import { realtimeDb } from "../config/firebase_realtime_db";

export const readRealTimeData = (path: string, callback: (data: any) => void) => {
    try {
        const targetPathRef = ref(realtimeDb, path);
        onValue(targetPathRef, (snapshot) => {
            const data = snapshot.val();
            callback(data)
        });
    } catch (error) {
        console.log(error)
    }
}

export const addRealTimeData = async (path: string, data: any, times: number = 1) => {
    try {
        const targetPathRef = ref(realtimeDb, path);
        while (times > 0) {
            await push(targetPathRef, data)
            times -= 1
        }
    } catch (error) {
        console.log(error)
    }
}

export const deleteRealTimeData = async (path: string) => {
    try {
        const targetPathRef = ref(realtimeDb, path);
        await remove(targetPathRef)
    } catch (error) {
        console.log(error)
    }
}

export const updateRealTimeData = async (path: string, data: any) => {
    try {
        const targetPathRef = ref(realtimeDb, path);
        await update(targetPathRef, data)
    } catch (error) {
        console.log(error)
    }
}