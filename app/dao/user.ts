export class User {
    userId: string // Unique Id that is generated from firestore
    name: string // Google name
    displayName: string // Ticket System Display Name
    email: string
    created: any
    updated: any
    address: string
    role: number

    constructor(userId: string, name: string, displayName: string = "", email: string, created: any, updated: any, address: string = "", role: number = 0) {
        this.userId = userId
        this.name = name
        this.displayName = displayName
        this.email = email
        this.created = created
        this.updated = updated
        this.address = address
        this.role = role
    }
}