import moment from "moment"
import { Helpers } from "../Helpers"

export const formattedMessage = (sender: string, message: string, isNewChat: boolean) => {

    return {
        sender: sender,
        message: Helpers.convertToMorseCode(message, true), // "true" to run this function synchronously
        time: moment().format('HH:mm'),
        isNewChat: isNewChat,
    }
}