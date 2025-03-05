import { ref, onValue, push, child, update, get, remove, runTransaction, set } from "firebase/database";
import { realtimeDb } from "../config/firebase_realtime_db";

export const addNewItemWithIcId = async (counterPath: string, dataPath: string, data: any, times: number = 1) => {
    let ticketIds: any = []
    try {
        while (times > 0) {
            const counterRef = ref(realtimeDb, counterPath)
            const transactionResult = await runTransaction(counterRef, (currentId: number | null) => {
                return (currentId || 0) + 1;
            });

            if (!transactionResult.committed) {
                console.error("Transaction failed");
                return;
            }

            const newId = transactionResult.snapshot.val() as number;

            const newItem = { 'autoId': newId, ...data }

            await push(ref(realtimeDb, dataPath), newItem);

            console.log(`New item added with ID: ${newId}`);

            times -= 1;

            ticketIds.push(newId)
        }
    } catch (error) {
        console.error("Error adding new item:", error);
        ticketIds = null
    }
    return ticketIds
}

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

export const addRealTimeData = async (path: string, data: any) => {
    try {
        const targetPathRef = ref(realtimeDb, path);
        await push(targetPathRef, data)
    } catch (error) {
        throw error
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