export const formattedMessage = (sender: string, message: string) => {
    return {
        sender: sender,
        message: message,
        time: new Date(Date.now()).getHours().toString() + ":" + new Date(Date.now()).getMinutes().toString()
    }
}