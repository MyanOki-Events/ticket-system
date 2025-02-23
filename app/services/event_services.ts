import { serverTimestamp } from "firebase/firestore"
import Event from "../dao/event"
import { addNewDocument, deleteDocumentByDocId, getDocumentById, getMultipleDocuments, updateDocumentByDocId } from "../utils/firebase/if/firebase_store_if"

const TABLE_NAME = "events"

export const getAllEvent = async () => {
    let events: Event[] = []
    try {
        const result = await getMultipleDocuments(TABLE_NAME)
        for (let i = 0; i < result.length; i++) {
            const { id, ...other } = result[i]
            events.push({ eventId: id, ...other } as Event)
        }
        return events
    } catch (error) {
        console.log(error) // use firebase log trace later
    }
    return events
}

export const addNewEvent = async (event: Event) => {
    try {
        const { eventId, ...other } = event
        other.created = serverTimestamp()
        return await addNewDocument(TABLE_NAME, other)
    } catch (error) {
        console.log(error)
    }
    return ""
}

export const getEventById = async (eventId: string) => {
    try {
        const result = await getDocumentById(TABLE_NAME, eventId)
        if (result) {
            const { id, ...other } = result
            return { eventId: id, ...other } as Event
        }
    } catch (error) {
        console.log(error) // use firebase log trace later
    }
    return {}
}

export const updateEventById = async (data: Event) => {
    try {
        const { eventId, created, ...other } = data
        other.updated = serverTimestamp()
        await updateDocumentByDocId(TABLE_NAME, eventId, other)
    } catch (error) {
        console.log(error) // use firebase log trace later
    }
}

export const deleteEventById = async (eventId: string) => {
    try {
        await deleteDocumentByDocId(TABLE_NAME, eventId)
    } catch (error) {
        console.log(error) // use firebase log trace later
    }
}