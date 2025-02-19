export default class Ticket {
    // UserのIdと紐付く
    userId: string

    // DocumentIdをticketIdとして使う
    ticketId: string

    // チケットの使い済みか否か判定フラグ
    isUsed: boolean

    // お支払い済みか否か
    isPaid: boolean

    // 次のイベントなどに必要になる、今回は形として残す
    ticketType: string

    created: any

    updated: any

    constructor(userId: string, ticketId: string = "", created: any = "", updated: any = "", isUsed: boolean = false, isPaid = false, ticketType: string = "") {
        this.userId = userId
        this.ticketId = ticketId
        this.isUsed = isUsed
        this.isPaid = isPaid
        this.ticketType = ticketType
        this.created = created
        this.updated = updated
    }
}