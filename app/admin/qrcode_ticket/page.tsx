"use client"

import ConfirmTicketLayout from "@/app/components/ConfirmTicketLayout";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const PageContent = () => {
    const searchParams = useSearchParams();
    const userId: string = searchParams.get("userId") ?? "";
    const ticketId: string = searchParams.get("ticketId") ?? "";

    // Invalid Entry
    if(userId === "" || ticketId === "") {
        return errorPage()
    }

    return (
        <div>
            <h3>Tickets</h3>
            <ConfirmTicketLayout userId={userId} ticketId={ticketId} />
        </div>
    )
}

// export default MemberTicketPage
export default function MemberTicketPage() {
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