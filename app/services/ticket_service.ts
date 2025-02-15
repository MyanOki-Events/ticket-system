import { serverTimestamp } from "firebase/database"
import Ticket from "../dao/ticket"
import { addRealTimeData, readRealTimeData, deleteRealTimeData, updateRealTimeData } from "../utils/firebase/if/firebase_realtime_db_if"

const addNewTickets = async (uId: string, totalTicket: number = 1) => {
    const path: string = `users/${uId}/tickets`
    const ticket: Ticket = new Ticket(uId)
    let { userId, ticketId, ...other } = ticket
    other.created = serverTimestamp()
    await addRealTimeData(path, other, totalTicket)
}

const getTicketsByUserId = async (userId: string, callback: (data: any) => void) => {
    const path: string = `users/${userId}/tickets`
    readRealTimeData(path, callback)
}

const deleteTicketByIds = async (userId: string, ticketId: string) => {
    const path: string = `users/${userId}/tickets/${ticketId}`
    await deleteRealTimeData(path)
}

const updateTicketByIds = async (userId: string, ticketId: string, data: any) => {
    const path: string = `users/${userId}/tickets/${ticketId}`
    await updateRealTimeData(path, data)
}

export { addNewTickets, getTicketsByUserId, deleteTicketByIds, updateTicketByIds }