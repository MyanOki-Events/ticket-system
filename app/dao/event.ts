export default class Event {
    eventId: string;
    eventTitle: string;
    eventDate: string;
    eventTime: string;
    location: string;
    price: number;
    eventCode: string;
    created: any;
    updated: any;

    constructor(eventId: string, eventTitle: string, eventDate: string, eventTime: string, location: string, price: number, eventCode: string, created: any, updated: any) {
        this.eventId = eventId
        this.eventTitle = eventTitle
        this.eventDate = eventDate
        this.eventTime = eventTime
        this.location = location
        this.price = price
        this.eventCode = eventCode
        this.created = created
        this.updated = updated
    }
}