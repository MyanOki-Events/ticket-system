import TicketLayout from "@/app/components/TicketLayout"
import { User } from "@/app/dao/user"
import { getUserById } from "@/app/services/user_service"
import { redirect } from "next/navigation"

const MemberPage = async ({ params }: { params: Promise<{ userId: string }> }) => {
    // user id
    const userId = (await params).userId
    // get user profile
    const userInfo = (await getUserById(userId)) as User

    // user information not exist redirect to error page
    if (userInfo && !userInfo?.userId) {
        redirect("/error/not-authorized")
    }

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