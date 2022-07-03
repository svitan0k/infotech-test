import { Helpers } from "../../Helpers";
import { cbFunction } from "../HandlersRouter";

export const decryptMessageHandler = (message: string, decryptMessageCallback: cbFunction): void => {
    Helpers.decryptMorseCode(message).then((result) => {
        console.log('DECRYPTED MESSAGE:', result)
        decryptMessageCallback(200, {message: result})
    })
}