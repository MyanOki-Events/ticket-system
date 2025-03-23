import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://ticket-system-b7e87-default-rtdb.asia-southeast1.firebasedatabase.app",
    });
}

export const realtimeDbInstance = admin.database()