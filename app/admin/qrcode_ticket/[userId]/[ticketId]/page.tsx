import ConfirmTicketLayout from "@/app/components/ConfirmTicketLayout"

const MemberTicketPage = async ({ params }: { params: Promise<{ userId: string, ticketId: string }> }) => {
    const _params = (await params)
    const { userId, ticketId } = _params

    return (
        <>
            <ConfirmTicketLayout userId={userId} ticketId={ticketId} />
        </>
    )
}

export default MemberTicketPage