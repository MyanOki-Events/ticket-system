import { serverTimestamp } from "firebase/database"
import Ticket from "../dao/ticket"
import { addRealTimeData, readRealTimeData, deleteRealTimeData, updateRealTimeData, addNewItemWithIcId } from "../utils/firebase/if/firebase_realtime_db_if"

const addNewTickets = async (uId: string, eventId: string, totalTicket: number = 1) => {
    // const path: string = `tickets`
    const counterPath: string = `metadata/${eventId}/ticketLastId`
    const dataPath: string = `users/${uId}/tickets`
    const ticket: Ticket = new Ticket(uId)
    let { userId, ticketNo, ticketId, ...other } = ticket
    other.ticketType = eventId
    other.created = serverTimestamp()
    return await addNewItemWithIcId(counterPath, dataPath, other, totalTicket)
    // await addRealTimeData(path, other, totalTicket)
}

const getTicketsByUserId = async (userId: string, callback: (data: any) => void) => {
    const path: string = `users/${userId}/tickets`
    readRealTimeData(path, callback)
}

const getTicketsByUserIdAndTicketId = async (userId: string, ticketId: string, callback: (data: any) => void) => {
    const path: string = `users/${userId}/tickets/${ticketId}`
    readRealTimeData(path, callback)
}

const deleteTicketByIds = async (userId: string, ticketId: string) => {
    const path: string = `users/${userId}/tickets/${ticketId}`
    await deleteRealTimeData(path)
}

const updateTicketByIds = async (userId: string, ticketId: string, data: any) => {
    const path: string = `users/${userId}/tickets/${ticketId}`
    const updated = serverTimestamp()
    const other = { "updated": updated, ...data }
    await updateRealTimeData(path, other)
}

export { addNewTickets, getTicketsByUserId, deleteTicketByIds, updateTicketByIds, getTicketsByUserIdAndTicketId }