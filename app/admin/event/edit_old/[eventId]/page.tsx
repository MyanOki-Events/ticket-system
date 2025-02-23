import EventEditFormLayout from "@/app/components/EventEditFormLayout";
import Header from "@/app/components/Header";
import Event from "@/app/dao/event";
import { addNewEvent, getEventById } from "@/app/services/event_services";
import { redirect } from "next/navigation"

const EventEditPage = async ({ params }: { params: Promise<{ eventId: string }> }) => {
    // event id
    const eventId = (await params).eventId
    // get user profile
    const eventInfo = (await getEventById(eventId)) as Event

    // user information not exist redirect to error page
    if (eventInfo && !eventInfo?.eventId) {
        redirect("/error/not-authorized")
    }

    eventInfo.created = ""
    eventInfo.updated = ""

    return (
        <>
            <div><Header /></div>
            <EventEditFormLayout eventInfo={eventInfo} />
        </>
    )
}

export default EventEditPage