import { serverTimestamp } from "firebase/database"
import Ticket from "../dao/ticket"
import { addRealTimeData, readRealTimeData, deleteRealTimeData, updateRealTimeData, addNewItemWithIcId, readDataAtOnce, getLastAutoIncrementNumber } from "../utils/firebase/if/firebase_realtime_db_if"
import { generateUniqueNumber } from "../utils/mono_utils/common"

const addNewTickets = async (uId: string, eventId: string, totalTicket: number = 1) => {
    let ticketIds: number[] = []
    try {
        // const path: string = `tickets`
        // const counterPath: string = `metadata/${eventId}/ticketLastId`

        // database address
        const path: string = `users/${uId}/tickets`

        while (totalTicket > 0) {
            // data setup
            const ticket: Ticket = new Ticket(uId)
            let { userId, ticketId, ...other } = ticket
            other.ticketType = eventId
            other.created = serverTimestamp()
            other.ticketTmpNo = generateUniqueNumber()

            // return await addNewItemWithIcId(counterPath, dataPath, other, totalTicket)

            // add process
            await addRealTimeData(path, other)

            // save [ticketTmpNo] in ticketIds
            ticketIds.push(other.ticketTmpNo)

            totalTicket -= 1
        }
    } catch (error) {
        console.log(error)
        ticketIds = []
    }

    return ticketIds
}

const getAllTickets = async (callback: (data: any) => void) => {
    const path: string = `users`
    readRealTimeData(path, callback)
}

const getTicketsByUserId = async (userId: string, callback: (data: any) => void) => {
    const path: string = `users/${userId}/tickets`
    readRealTimeData(path, callback)
}

const getTicketsByUserIdAndTicketIdOnce = async (userId: string, ticketId: string) => {
    const path: string = `users/${userId}/tickets/${ticketId}`
    return await readDataAtOnce(path)
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

const updateTicketPayment = async (userId: string, ticketType: string, ticketId: string) => {
    const counterPath: string = `metadata/${ticketType}/ticketLastId`
    const lastTicketNumber = await getLastAutoIncrementNumber(counterPath)

    const path: string = `users/${userId}/tickets/${ticketId}`
    const updated = serverTimestamp()
    const other = { "updated": updated, "ticketNo": lastTicketNumber, "isPaid": true }
    await updateRealTimeData(path, other)
}

/** get count of paid tickets on different ticket type */
const getCountOfPaidTickets = async (ticketType: string, callback: (data: any) => void) => {
    const counterPath: string = `metadata/${ticketType}/ticketLastId`
    readRealTimeData(counterPath, callback)
}

export {
    addNewTickets,
    getTicketsByUserId,
    deleteTicketByIds,
    updateTicketByIds,
    getTicketsByUserIdAndTicketId,
    getTicketsByUserIdAndTicketIdOnce,
    getAllTickets,
    updateTicketPayment,
    getCountOfPaidTickets
}