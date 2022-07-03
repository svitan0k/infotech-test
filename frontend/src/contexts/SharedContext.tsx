import { useEffect, useState } from "react"
import { createContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { handleReceivedNewMessage, handleReceivedOpenChat } from "../features/chatFeatures/chatStateSlice"
import { userLogout } from "../features/userInfoFeatures/userInfoStateSlice"
import { RootState } from "../store"
import socket from "../webSocketsUtil/webSocketServer"

interface ContextTS {
    children: React.ReactNode
}

const morseCode: { [key: string]: string } = {
    "A": ".-",
    "B": "-...",
    "C": "-.-.",
    "D": "-..",
    "E": ".",
    "F": "..-.",
    "G": "--.",
    "H": "....",
    "I": "..",
    "J": ".---",
    "K": "-.-",
    "L": ".-..",
    "M": "--",
    "N": "-.",
    "O": "---",
    "P": ".--.",
    "Q": "--.-",
    "R": ".-.",
    "S": "...",
    "T": "-",
    "U": "..-",
    "V": "...-",
    "W": ".--",
    "X": "-..-",
    "Y": "-.--",
    "Z": "--..",
    " ": `\xa0\xa0\xa0`,
    "0": "-----",
    "1": ".----",
    "2": "..---",
    "3": "...--",
    "4": "....-",
    "5": ".....",
    "6": "-....",
    "7": "--...",
    "8": "---..",
    "9": "----.",
    ".": ".-.-.-",
    ",": "--..--",
    "?": "..--..",
    "'": ".----.",
    "!": "-.-.--",
    "/": "-..-.",
    "(": "-.--.",
    ")": "-.--.-",
    "&": ".-...",
    ":": "---...",
    ";": "-.-.-.",
    "=": "-...-",
    "+": ".-.-.",
    "-": "-....-",
    "_": "..--.-",
    "\"": ".-..-.",
    "$": "...-..-",
    "@": ".--.-.",
}

export function convertToMorseCode(message: string) {
    console.log(message.toUpperCase().split(' ').map((word) => word.split('').map((symbol) => {
        return morseCode[symbol] ? morseCode[symbol] : symbol
    }).join(' ')).join("   "))
    return message.toUpperCase().split(' ').map((word) => word.split('').map((symbol) => {
        return morseCode[symbol] ? morseCode[symbol] : symbol
    }).join(' ')).join("   ")
}


export function decryptMorseCode(message: string): string {
    // console.log("Decrypted:", message.split('   ').map((word) => word.split(' ').map((symbol) => {
    //     return Object.keys(morseCode).find((key) => morseCode[key] === symbol)
    // }).join('')).join(' '))
    return message.split('   ').map((word) => word.split(' ').map((symbol) => {
        return Object.keys(morseCode).find((key) => morseCode[key] === symbol)
    }).join('')).join(' ');
}


export const shareContext: React.Context<any> = createContext<ContextTS | null>(null)

const SharedContextWrapper: React.FC<ContextTS> = (props) => {

    const [passedUsername, setPassedUsername] = useState<string>('')

    return (
        <shareContext.Provider value={{
            passedUsername,
            setPassedUsername,
        }}>
            {props.children}
        </shareContext.Provider>
    )
}

export default SharedContextWrapper