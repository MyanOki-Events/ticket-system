class Ticket {
    // UserのIdと紐付く
    userId: string
    
    // DocumentIdをticketNoとして使う
    ticketNo: string

    // チケットの使い済みか否か判定フラグ
    isAlreadyUsed: boolean

    // 次のイベントなどに必要になる、今回は形として残す
    ticketType: string

    constructor(userId: string, ticketNo: string, isAlreadyUsed: boolean = false, ticketType: string = "") {
        this.userId = userId
        this.ticketNo = ticketNo
        this.isAlreadyUsed = isAlreadyUsed
        this.ticketType = ticketType
    }
}