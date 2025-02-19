export class User {
    userId: string // Unique Id that is generated from firestore
    name: string
    email: string
    created: any
    updated: any
    role: number

    constructor(userId: string,name: string, email: string, created: any, updated: any, role: number = 0) {
        this.userId = userId
        this.name = name
        this.email = email
        this.created = created
        this.updated = updated
        this.role = role
    }
}