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

    userInfo.created = ""
    userInfo.updated = ""

    return (
        <>
            <TicketLayout userInfo={userInfo} />
        </>
    )
}

export default MemberPage