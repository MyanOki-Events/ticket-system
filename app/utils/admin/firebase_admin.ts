import admin from "firebase-admin"

if(admin.apps.length) {
    admin.initializeApp(
        {
            credential: admin.credential.cert({
                projectId: process.env.NEXT_ADMIN_FIREBASE_PROJECT_ID,
                clientEmail: process.env.NEXT_ADMIN_FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.NEXT_ADMIN_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
            })
        }
    )
}

const adminDb = admin.firestore()

const loadUsers = async () => {
    // export default async function handler(req, res) {
    // if (req.method === "GET") {
      const usersSnapshot = await adminDb.collection("users").get();
      const users = usersSnapshot.docs.map((doc) => doc.data());
      console.log(users)
    //   res.status(200).json(users);
    // }
}

export {loadUsers}