class User {
    id: string // Unique Id that is generated from firestore
    name: string
    email: string
    role: number

    constructor(id: string,name: string, email: string, role: number = 0) {
        this.id = id
        this.name = name
        this.email = email
        this.role = role
    }
}