class FirebaseWhere {
    operand: string
    operator: WhereOpt
    value: any
    constructor(operand: string, operator: WhereOpt, value: any) {
        this.operand = operand
        this.operator = operator
        this.value = value
    }
}