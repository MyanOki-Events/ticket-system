import { storeDb } from "../config/firebase_store";
import { 
    addDoc, 
    getDoc,
    collection, 
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    query,
    where
} from "firebase/firestore";

export const addNewDocument = async (inputData: any, collectionName: string) => {
    await addDoc(collection(storeDb, collectionName), inputData);
};

export const getDocumentById = async (collectionName: string, id: string) => {
    const docRef = doc(storeDb, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data()
    } 
    return null
}

export const getDocumentByWhereClause = async (collectionName: string, data: JsonObject) => {
    // const q = query(collection(storeDb, collectionName), where(data.key, ">", 25));
    return null
}

export const getMultipleDocuments = async (collectionName: string) => {
    const snapshot = await getDocs(collection(storeDb, collectionName));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deleteDocumentByDocId = async (collectionName: string, docId: string) => {
    await deleteDoc(doc(storeDb, collectionName, docId));
};

export const updateDocumentByDocId = async (collectionName: string, docId: string, updateData: any) => {
    await updateDoc(doc(storeDb, collectionName, docId), updateData);
};