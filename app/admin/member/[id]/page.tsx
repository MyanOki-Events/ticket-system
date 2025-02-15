import { getUserById } from "@/app/services/user_service"

const MemberPage = async ({ params } : {params : Promise<{ id : string }>}) => {
    // user id
    const ids = (await params).id
    // get user profile
    const result = (await getUserById(ids)) as User
    // get user ticket-cart

    return (
        <div className="container">
            {result.id}
            {result.email}
            {result.name}
            {result.role}
        </div>
    )
}

export default MemberPage