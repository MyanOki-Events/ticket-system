import { getDocumentById, getDocumentByWhereClause, getMultipleDocuments } from "../utils/firebase/if/firebase_store_if";

export const getAllUsers = async () => {
    try {
        const result = await getMultipleDocuments("users")
        return result as User[]
    } catch (error) {
        console.log(error) // use firebase log trace later
    }
    return []
}

export const getUserById = async (id: string) => {
    try {
        const result = await getDocumentById("users", id)
        if (result)
            return result as User
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
            return result[0] as User
        }
    } catch (error) {
        console.log(error) // use firebase log trace later
    }
    return {}
}