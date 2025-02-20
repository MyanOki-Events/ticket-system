import { User as nextAuthUser } from "next-auth";
import { User as daoUser } from "../dao/user";
import { getUserByEmail, addNewUser } from "./user_service";
import { serverTimestamp } from "firebase/firestore";

export const loginProcess = async (nextUser: nextAuthUser) => {
    if (nextUser && nextUser?.email) {
        let retUser: daoUser = await getUser(nextUser.email)
        if (!retUser || !Object.keys(retUser) || Object.keys(retUser).length === 0) {
            // User doesn't exist, save user to firebase
            const user: daoUser = new daoUser("", nextUser?.name ?? "Undefined User", nextUser.email, serverTimestamp(), "")
            const docId: string = await addNewUser(user)
            user.userId = docId
            return user;
        }
        return retUser;
    }
    return;
}

const getUser = async (email: string) => {
    return await getUserByEmail(email) as daoUser
}