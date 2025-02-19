"use client"

import TicketLayout from "@/app/components/TicketLayout"
import { User } from "@/app/dao/user"
import { getUserById } from "@/app/services/user_service"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
// import { readRealTimeData } from "@/app/utils/firebase/if/firebase_realtime_db_if"
// import { useEffect } from "react"

const PageContent = () => {
    const searchParams = useSearchParams();
    const userId: string = searchParams.get("userId") ?? "";
    const [userInfo, setUserInfo] = useState<User>();
    // Invalid Entry
    if (userId === "") {
        return errorPage()
    }
    // const ids = (await params).id
    // get user profile
    // const userInfo = (await getUserById(ids)) as User
    useEffect(() => {
        getUserById(userId)
            .then((res) => {
                setUserInfo(res as User)
            })
            .catch((error) => console.log(error))
    })

    if (!userInfo) {
        return loadinPage()
    }

    return (
        <div className="container">
            <div>
                <h2>Member</h2>
                <h5>Name : {userInfo.userId}</h5>
                <h5>Email : {userInfo.email}</h5>
            </div>
            <div>
                <TicketLayout userId={userInfo.userId} />
            </div>
        </div>
    )
}

export default function MemberPage() {
    return (
        <Suspense fallback={loadinPage()}>
            <PageContent />
        </Suspense>
    );
}

const loadinPage = () => {
    return (
        <div>Loading...</div>
    )
}

const errorPage = () => {
    return (
        <div>Invalid...</div>
    )
}