import TicketLayout from "@/app/components/TicketLayout"
import { User } from "@/app/dao/user"
import { getUserById } from "@/app/services/user_service"
// import { readRealTimeData } from "@/app/utils/firebase/if/firebase_realtime_db_if"
// import { useEffect } from "react"

const MemberPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    // user id
    const ids = (await params).id
    // get user profile
    const userInfo = (await getUserById(ids)) as User

    return (
        <div className="container">
            <div>
                <h2>Member</h2>
                <h5>Name : {userInfo.name}</h5>
                <h5>Email : {userInfo.email}</h5>
            </div>
            <div>
                <TicketLayout userId={userInfo.userId} />
            </div>
        </div>
    )
}

export default MemberPage