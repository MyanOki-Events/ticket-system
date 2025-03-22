export default class Ticket {
    // ticket owner_id
    userId: string

    // ticket unique_id(random)
    ticketId: string

    // ticket business_id
    ticketNo: string | null

    // ticket business_id(temporary_id)
    ticketTmpNo: number

    // ticket usable state
    isUsed: boolean

    // ticket payment status
    isPaid: boolean

    // ticket info_id(foreign key of event_id)
    ticketType: string

    // ticket order date
    created: any

    // ticket order finish date | payment finish date
    updated: any

    // ticket expire date (2 days)
    expired: any

    constructor(userId: string, ticketNo: string | null = null, ticketTmpNo: number = 0, ticketId: string = "", created: any = "", updated: any = "", expired: any = "", isUsed: boolean = false, isPaid = false, ticketType: string = "") {
        this.userId = userId
        this.ticketNo = ticketNo
        this.ticketTmpNo = ticketTmpNo
        this.ticketId = ticketId
        this.isUsed = isUsed
        this.isPaid = isPaid
        this.ticketType = ticketType
        this.created = created
        this.updated = updated
        this.expired = expired
    }
}