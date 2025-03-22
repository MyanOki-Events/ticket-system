import { logEvent } from "firebase/analytics"
import { analytics } from "../config/firebase_analytics"

export const logAnalyticsEvent = async (eventName: string, metaData: any) => {
    try {
        const anal = await analytics
        if (anal) {
            logEvent(anal, eventName, metaData)
        }
    } catch (error) {
        console.log(error)
    }
}