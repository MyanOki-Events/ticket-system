"use client"

import { useSession } from "next-auth/react"
import { useAuth } from "../contexts/AuthContext"
import Header from "../components/Header"
import Footer from "../components/Footer"
import LoadingLayout from "../components/LoadingLayout"
import { useEffect, useState } from "react"
import { getUserById, updateUser } from "../services/user_service"
import { User } from "../dao/user"

enum ChangeEventEle {
    USER_DISPLAY_NAME = "user-display-name-id",
    ADDRESS = "address-id"
}

const SettingsPage = () => {
    const { data: session } = useSession()
    const userId: string = session?.user.userId ?? ""
    const { loading } = useAuth()

    const [userFormData, setUserFormData] = useState({
        "email": "",
        "name": "",
        "displayName": "",
        "address": ""
    });
    const [updateTrigger, setUpdateTrigger] = useState<number>(Math.random())

    useEffect(() => {
        if (userId && userId !== "") {
            // load user information
            getUserById(userId)
                .then((data) => {
                    const { email, name, address, displayName } = data as User
                    setUserFormData({ email, name, displayName, address })
                })
                .catch((error) => console.log(error))
        }
    }, [userId])

    const updateElementAction = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserFormData({ ...userFormData, [event.target.name]: event.target.value });
    }

    const updateUserProfile = async () => {
        await updateUser(userId, {
            "displayName": userFormData.displayName ?? "",
            "address": userFormData.address ?? ""
        })
        setUpdateTrigger(Math.random())
    }

    return (
        <div key={updateTrigger}>
            <Header />
            {
                loading ?
                    <LoadingLayout /> :
                    <div className="container">
                        <h3 className="text-center" style={{ paddingTop: '60px', color: '#2a9d8f' }}>Profile</h3>
                        <div className="mb-3 col col-sm-10 col-md-6 m-auto">
                            <label htmlFor="staticEmail" className="col-form-label">Email</label>
                            <div className="">
                                <input type="text" name="email" className="form-control" id="staticEmail" value={userFormData.email || ""} readOnly />
                            </div>
                        </div>
                        <div className="mb-3 col col-sm-10 col-md-6 m-auto">
                            <label htmlFor="user-name-id" className="col-form-label">Google Name</label>
                            <div className="">
                                <input type="text" className="form-control" id="user-name-id" value={userFormData.name || ""} readOnly />
                            </div>
                        </div>
                        <div className="mb-3 col col-sm-10 col-md-6 m-auto">
                            <label htmlFor={ChangeEventEle.USER_DISPLAY_NAME} className="col-form-label">User Name</label>
                            <div className="">
                                <input type="text" name="displayName" onChange={updateElementAction} className="form-control" id={ChangeEventEle.USER_DISPLAY_NAME} value={userFormData.displayName || ""} placeholder="Enter User Name" />
                            </div>
                            {/* <div id="userNameHelp" className="form-text">After update username refresh page for name reflection.</div> */}
                        </div>
                        <div className="mb-3 col col-sm-10 col-md-6 m-auto">
                            <label htmlFor={ChangeEventEle.ADDRESS} className="col-form-label">Address</label>
                            <div className="">
                                <input type="text" name="address" onChange={updateElementAction} className="form-control" id={ChangeEventEle.ADDRESS} value={userFormData.address || ""} placeholder="Enter Address" />
                            </div>
                        </div>
                        <div className="mb-3 col col-sm-10 col-md-6 m-auto">
                            <div className="">
                                <button className="btn btn-success form-control" onClick={updateUserProfile}>Update</button>
                            </div>
                        </div>
                    </div>
            }
            <Footer />
        </div>
    )
}

export default SettingsPage