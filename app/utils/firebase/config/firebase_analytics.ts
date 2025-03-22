import { iniApp } from './firebase_app'
import { getAnalytics, isSupported } from 'firebase/analytics'

const analytics = isSupported().then((yes) => (yes ? getAnalytics(iniApp) : null))

export { analytics }