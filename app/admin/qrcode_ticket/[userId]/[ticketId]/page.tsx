import ConfirmTicketLayout from "@/app/components/ConfirmTicketLayout"

const MemberTicketPage = async ({ params }: { params: Promise<{ userId: string, ticketId: string }> }) => {
    const _params = (await params)
    const { userId, ticketId } = _params

    return (
        <div className="container">
            <h2>Confirmation</h2>
            <div>
                <ConfirmTicketLayout userId={userId} ticketId={ticketId}/>
            </div>
        </div>
    )
}

export default MemberTicketPage