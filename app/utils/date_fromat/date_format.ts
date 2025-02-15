export const convertDate = (timestamp: any) => {
    if(!timestamp)
        return ""
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}`: date.getMinutes()
    const second = date.getSeconds() < 10 ? `0${date.getSeconds()}`: date.getSeconds()

    return `${year}/${month}/${day} ${hour}:${minute}:${second}`
}