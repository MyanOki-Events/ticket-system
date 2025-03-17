import { User } from "../dao/user";
import { FirebaseWhere } from "../utils/firebase/firebase_where";
import { WhereOpt } from "../utils/firebase/firebase_where_opt";
import { getDocumentById, getDocumentByWhereClause, getMultipleDocuments, addNewDocument, setDocumentByDocId } from "../utils/firebase/if/firebase_store_if";

export const getAllUsers = async () => {
    let users: User[] = []
    try {
        const result = await getMultipleDocuments("users")
        for (let i = 0; i < result.length; i++) {
            const { id, ...other } = result[i]
            users.push({ userId: id, ...other } as User)
        }
        return users
    } catch (error) {
        console.log(error) // use firebase log trace later
    }
    return users
}

export const getUserById = async (userId: string) => {
    try {
        const result = await getDocumentById("users", userId)
        if (result) {
            const { id, ...other } = result
            return { userId: id, ...other } as User
        }
    } catch (error) {
        console.log(error) // use firebase log trace later
    }
    return {}
}

export const getUserByEmail = async (email: string) => {
    try {
        const data = [new FirebaseWhere("email", WhereOpt.WHERE_EQUAL, email)]
        const result = await getDocumentByWhereClause("users", data)
        if (result && result.length != 0) {
            const { id, ...other } = result[0]
            return { userId: id, ...other } as User
        }
    } catch (error) {
        console.log(error) // use firebase log trace later
    }
    return {}
}

export const addNewUser = async (user: User) => {
    try {
        const { userId, ...other } = user
        return await addNewDocument("users", other)
    } catch (error) {
        console.log(error)
    }
    return ""
}

export const updateUser = async (userId: string, data: any) => {
    try {
        await setDocumentByDocId("users", userId, data)
    } catch (error) {
        console.log(error)
    }
}